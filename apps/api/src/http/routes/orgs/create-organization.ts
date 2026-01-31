import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { auth } from '../../middlewares/auth'
import { prisma } from '../../../lib/prisma'
import { BadRequestError } from '../_errors/bad-request-error'
import { createSlug } from '../../../utils/create-slug'

export async function createOrganization(app: FastifyInstance) {
  // 1. Registra o middleware de autenticação antes da rota
  app.register(auth)

  app.withTypeProvider<ZodTypeProvider>().post(
    '/organizations',
    {
      schema: {
        tags: ['Organizations'],
        summary: 'Create a new organization',
        security: [{ bearerAuth: [] }],
        body: z.object({
          name: z.string(),
          domain: z.string().nullish(),
          shouldAttachUsersByDomain: z.boolean().optional(),
        }),
        response: {
          201: z.object({
            organizationId: z.string().uuid(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { name, domain, shouldAttachUsersByDomain } = request.body
      const userId = await request.getCurrentUserId()

      // Validação: Se informou domínio, verifica se já existe
      if (domain) {
        const organizationByDomain = await prisma.organization.findUnique({
          where: { domain },
        })

        if (organizationByDomain) {
          throw new BadRequestError('Another organization with this domain already exists.')
        }
      }


     const organization = await prisma.organization.create({
  data: {
    name,
    slug: createSlug(name),
    domain,
    shoudAttachByDomain: shouldAttachUsersByDomain,
    ownerId: userId,
    members: {
      create: {
        userId,
        role: 'ADMIN',
      },
    },
  },
})

      return reply.status(201).send({
        organizationId: organization.id,
      })
    },
  )
}