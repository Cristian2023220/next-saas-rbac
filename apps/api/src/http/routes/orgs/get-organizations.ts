import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { auth } from '../../middlewares/auth'
import { prisma } from '../../../lib/prisma'
import { roleSchema } from '@saas/auth/src/roles'

export async function getOrganizations(app: FastifyInstance) {
  app.register(auth)

  app.withTypeProvider<ZodTypeProvider>().get(
    '/organizations',
    {
      schema: {
        tags: ['Organizations'],
        summary: 'Get organizations where user is a member',
        security: [{ bearerAuth: [] }],
        // Params removido pois é uma listagem geral, não detalhe de uma específica
        response: {
          200: z.object({
            organizations: z.array(
              z.object({
                id: z.string().uuid(),
                name: z.string(),
                slug: z.string(),
                avatarUrl: z.string().url().nullable(),
                role: z.enum(['ADMIN', 'MEMBER', 'BILLING']),
              }),
            ),
          }),
        },
      },
    },
    async (request, reply) => {
      const userId = await request.getCurrentUserId()

      const organizations = await prisma.organization.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          avatarUrl: true,
          members: {
            select: {
              role: true,
            },
            // IMPORTANTE: Filtrar para pegar apenas o cargo DO USUÁRIO ATUAL
            where: {
              userId,
            },
          },
        },
        where: {
          members: {
            some: {
              userId,
            },
          },
        },
      })

      // Mapeamento para formatar o retorno (tirar o role de dentro do array members)
      const organizationsWithUserRole = organizations.map(
        ({ members, ...org }) => {
          return {
            ...org,
            role: members[0].role, // Como filtramos pelo ID, sempre virá apenas 1 item
          }
        },
      )

      return {
        organizations: organizationsWithUserRole,
      }
    },
  )
}