import { organizationSchema } from '@saas/auth'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'



import { BadRequestError } from '../_errors/bad-request-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'
import { auth } from '../../middlewares/auth'
import { getUserPermissions } from '../../../utils/get-users-permissions'
import { prisma } from '../../../lib/prisma'

export async function transferOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .patch(
      '/organizations/:slug/owner',
      {
        schema: {
          tags: ['Organizations'],
          summary: 'Transfer organization ownership.',
          security: [{ bearerAuth: [] }],
          body: z.object({
            transferToUserId: z.string().uuid(),
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
        const { transferToUserId } = request.body
        const { slug } = request.params
        const userId = await request.getCurrentUserId()
        const { membership, organization } =
          await request.getUserMembership(slug)

        const authOrganization = organizationSchema.parse({
        id: organization.id,
        owner_id: organization.ownerId,
      })

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('transfer_ownership', authOrganization)) {
          throw new UnauthorizedError(
            `You're not allowed to transfer this organization ownership.`,
          )
        }

        const transferToMembership = await prisma.member.findUnique({
          where: {
            organizationId_userId: {
              organizationId: organization.id,
              userId: transferToUserId,
            },
          },
        })

        if (!transferToMembership) {
          throw new BadRequestError(
            'Targer user is not a member of this organization.',
          )
        }

        await prisma.$transaction([
  // 1. Rebaixa o dono ATUAL para 'ADMIN'
  prisma.member.update({
    where: {
      organizationId_userId: {
        organizationId: organization.id,
        userId: userId, // <-- Usa o userId de quem está fazendo a requisição (antigo dono)
      },
    },
    data: {
      role: 'ADMIN',
    },
  }),

  // 2. Transfere a organização para o novo dono
  prisma.organization.update({
    where: { id: organization.id },
    data: { ownerId: transferToUserId },
  }),
])

        return reply.status(204).send(null)
      },
    )
}