
import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'



import { UnauthorizedError } from '../_errors/unauthorized-error'
import { getUserPermissions } from '../../../utils/get-users-permissions'
import { prisma } from '../../../lib/prisma'

export async function getInvites(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/organization/:slug/invites',
    {
      schema: {
        tags: ['invites'],
        summary: 'Get all organization invites',
        params: z.object({
          slug: z.string(),
        }),
        response: {
          200: z.object({
            invites: z.array(
              z.object({
                id: z.string().uuid(),
                email: z.string().email(),
                role: z.enum(['ADMIN', 'MEMBER', 'BILLING']),
                createdAt: z.date(),
                author: z
                  .object({
                    id: z.string(),
                    name: z.string().nullable(),
                  })
                  .nullable(),
              }),
            ),
          }),
        },
      },
    },
    async (request) => {
      const { slug } = request.params
      const userId = await request.getCurrentUserId()
      const { organization, membership } = await request.getUserMembership(slug)

      const { cannot } = getUserPermissions(userId, membership.role)

      if (cannot('get', 'Invite')) {
        throw new UnauthorizedError(
          `You're not allowed to get organization invites.`,
        )
      }

      const invites = await prisma.invite.findMany({
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true,
          author: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        where: {
          organizationId: organization.id,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      return { invites }
    },
  )
}