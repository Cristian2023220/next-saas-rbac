import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { auth } from '../../middlewares/auth'
import { prisma } from '../../../lib/prisma'
import { BadRequestError } from '../_errors/bad-request-error'

export async function getOrganization(app: FastifyInstance) {
  app.register(auth)

  app.withTypeProvider<ZodTypeProvider>().get(
    '/organizations/:slug',
    {
      schema: {
        tags: ['Organizations'],
        summary: 'Get details from organization',
        security: [{ bearerAuth: [] }],
        params: z.object({
          slug: z.string(),
        }),
        response: {
          200: z.object({
            organization: z.object({
              id: z.string().uuid(),
              name: z.string(),
              slug: z.string(),
              domain: z.string().nullable(),
              shouldAttachUsersByDomain: z.boolean().nullable(), // Nome bonito para o Front-end
              avatarUrl: z.string().url().nullable(),
              createdAt: z.date(),
              updatedAt: z.date(),
              ownerId: z.string().uuid(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { slug } = request.params
      const userId = await request.getCurrentUserId()

      const organization = await prisma.organization.findFirst({
        where: {
          slug,
          members: {
            some: {
              userId,
            },
          },
        },
        select: {
          id: true,
          name: true,
          slug: true,
          domain: true,
          shoudAttachByDomain: true, 
          avatarUrl: true,
          createdAt: true,
          updatedAt: true,
          ownerId: true,
        },
      })

      if (!organization) {
        throw new BadRequestError('Organization not found.')
      }

      return {
        organization: {
          id: organization.id,
          name: organization.name,
          slug: organization.slug,
          domain: organization.domain,
          avatarUrl: organization.avatarUrl,
          createdAt: organization.createdAt,
          updatedAt: organization.updatedAt,
          ownerId: organization.ownerId,
          shouldAttachUsersByDomain: organization.shoudAttachByDomain,
        },
      }
    },
  )
}