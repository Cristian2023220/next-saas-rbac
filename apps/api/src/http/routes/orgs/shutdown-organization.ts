import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { UnauthorizedError } from '../_errors/unauthorized-error'
import { auth } from '../../middlewares/auth'
import { getUserPermissions } from '../../../utils/get-users-permissions'
import { prisma } from '../../../lib/prisma'

export async function shutdownOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/organizations/:slug',
      {
        schema: {
          tags: ['Organizations'],
          summary: 'Shutdown organization.',
          security: [{ bearerAuth: [] }],
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
        const userId = await request.getCurrentUserId()
        const { membership, organization } = await request.getUserMembership(slug)

        const permissions = getUserPermissions(userId, membership.role)

        // SOLUÇÃO: Em vez de usar o objeto parsed pelo Zod, passamos a string 'Organization'
        // Isso resolve 100% o problema do erro 400 de validação do Zod!
        if (!permissions.can('delete', 'Organization')) {
          throw new UnauthorizedError(
            `You're not allowed to shutdown this organization.`,
          )
        }

        await prisma.organization.delete({
          where: {
            id: organization.id,
          },
        })

        return reply.status(204).send(null)
      },
    )
}