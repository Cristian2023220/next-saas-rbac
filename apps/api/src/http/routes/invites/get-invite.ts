

import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'



import { BadRequestError } from '../_errors/bad-request-error'
import { prisma } from '../../../lib/prisma'

export async function getInvite(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/invites/:inviteId',
    {
      schema: {
        tags: ['invites'],
        summary: 'Get invite details',
        params: z.object({
          inviteId: z.string().uuid(),
        }),
response: {
          200: z.object({
            invite: z.object({
              id: z.string().uuid(),
              role: z.enum(['ADMIN', 'MEMBER', 'BILLING']),
              email: z.string().email(),
              createdAt: z.date(),
              author: z.object({
                id: z.string().uuid(),
                name: z.string().nullable(),
                avatarUrl: z.string().url().nullable(),
              }).nullable(),
              organization: z.object({
                name: z.string(),
              }).nullable(), 
            }),
          }),
        },
      },
    },
    async (request) => {
      const { inviteId } = request.params

      const invite = await prisma.invite.findUnique({
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true,
          author: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
          organization: {
            select: {
              name: true,
            },
          },
        },
        where: {
          id: inviteId,
        },
      })

      if (!invite) {
        throw new BadRequestError('Invite not found.')
      }
      return { invite }
    },
  )
}
