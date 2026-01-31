import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { auth } from '../../middlewares/auth'
import { prisma } from '../../../lib/prisma'
import { roleSchema } from '../../../../../../packages/auth/src/roles'

export async function getMembership(app: FastifyInstance) {
  app.register(auth)

  app.withTypeProvider<ZodTypeProvider>().get(
    '/organizations/:slug/membership',
    {
      schema: {
        tags: ['Organizations'],
        summary: 'Get user membership on organization',
        security: [{ bearerAuth: [] }],
        params: z.object({
          slug: z.string(),
        }),
        response: {
          200: z.object({
            membership: z.object({
              id: z.string().uuid(),
              role: z.enum(['ADMIN', 'MEMBER', 'BILLING']),
              userId: z.string().uuid(),
              organizationId: z.string().uuid(),
            }).nullable(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { slug } = request.params


      const userId = await request.getCurrentUserId()

      const membership = await prisma.member.findFirst({
        where: {
          userId,
          organization: {
            slug,
          },
        },
        select: {
          id: true,
          role: true,
          organizationId: true,
          userId: true,
        },
      })

      return { membership }
    },
  )
}