import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { UserSchema, organizationSchema, defineAbilityFor } from '@saas/auth'
import { z } from 'zod'
import { auth } from '../../middlewares/auth'
import { prisma } from '../../../lib/prisma'
import { BadRequestError } from '../_errors/bad-request-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function updateOrganization(app: FastifyInstance) {
  app.register(auth)

  app.withTypeProvider<ZodTypeProvider>().put(
    '/organizations/:slug',
    {
      schema: {
        tags: ['Organizations'],
        summary: 'Update organization details',
        security: [{ bearerAuth: [] }],
        body: z.object({
          name: z.string(),
          domain: z.string().nullish(),
          shouldAttachUsersByDomain: z.boolean().optional(),
        }),
        params: z.object({
          slug: z.string(),
        }),
        response: {
          204: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { slug } = request.params

      // 1. Busca a membership e a organização pelo slug
      const { membership, organization } = await request.getUserMembership(slug)
      
      const { name, domain, shouldAttachUsersByDomain } = request.body
      const userId = await request.getCurrentUserId()

      // 2. Validação de Permissões (CASL)
      
      // Criamos a representação do usuário para o CASL
      const authUser = UserSchema.parse({
        id: userId,
        role: membership.role,
      })

      // Criamos a representação da organização para o CASL
      const authOrganization = organizationSchema.parse({
  id: organization.id,
  owner_id: organization.ownerId,
})

      // Geramos as permissões baseadas no usuário
      const { cannot } = defineAbilityFor(authUser)

      console.log('--- DEBUG PERMISSIONS ---')
      console.log('User ID:', userId)
      console.log('User Role:', membership.role)
      console.log('Org Owner ID:', organization.ownerId)
      console.log('Is Owner?', userId === organization.ownerId)

      // Verificamos se ele PODE atualizar ESSA organização específica
      if (cannot('update', authOrganization)) {
        throw new UnauthorizedError("You're not allowed to update this organization")
      }

      // 3. Validação: Se informou domínio, verifica se já existe em OUTRA organização
      if (domain) {
        const organizationByDomain = await prisma.organization.findFirst({
          where: { 
            domain, 
            id: {
              not: organization.id, // Garante que não é a própria organização atual
            }
          },
        })

        if (organizationByDomain) {
          throw new BadRequestError('Another organization with this domain already exists.')
        }
      }

      // 4. Atualização no banco
      await prisma.organization.update({
        where: {
          id: organization.id,
        },
        data: {
          name,
          domain,
          // Mantendo a compatibilidade com o erro de digitação do banco (shoud...)
          shoudAttachByDomain: shouldAttachUsersByDomain,
        },
      })

      return reply.status(204).send()
    },
  )
}