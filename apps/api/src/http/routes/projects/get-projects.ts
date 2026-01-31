import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'



import { UnauthorizedError } from '../_errors/unauthorized-error'
import { auth } from '../../middlewares/auth'
import { getUserPermissions } from '../../../utils/get-users-permissions'
import { prisma } from '../../../lib/prisma'

export async function getProjects(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/projects',
      {
        schema: {
          tags: ['projects'],
          summary: 'Get all organization projects',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              projects: z.array(
                z.object({
                  description: z.string().nullable(),
                  id: z.string(),
                  name: z.string(),
                  slug: z.string(),
                  avatarUrl: z.string().url().nullable(),
                  createdAt: z.date(),
                  organizationId: z.string(),
                  ownerId: z.string(),
                  owner: z.object({
                    id: z.string(),
                    name: z.string().nullable(),
                    avatarUrl: z.string().url().nullable(),
                  }),
                }),
              ),
            }),
          },
        },
      },

      async (request, reply) => {
        const { slug } = request.params
        const userId = await request.getCurrentUserId()
        const { organization, membership } =
          await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('get', 'Project')) {
          throw new UnauthorizedError(
            `You're not allowed to see organization projects.`,
          )
        }

        const projects = await prisma.project.findMany({
          select: {
            id: true,
            name: true,
            description: true,
            slug: true,
            ownerId: true,
            avatarUrl: true,
            organizationId: true,
            createdAt: true,
            owner: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
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
        return reply.send({projects})
      },
    )
}