import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { UserSchema, organizationSchema, defineAbilityFor } from '@saas/auth'
import { z } from 'zod'
import { auth } from '../../middlewares/auth'
import { prisma } from '../../../lib/prisma'
import { BadRequestError } from '../_errors/bad-request-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function shutdownOrganization(app: FastifyInstance) {
  app.register(auth)

  app.withTypeProvider<ZodTypeProvider>().delete(
    '/organizations/:slug',
    {
      schema: {
        tags: ['Organizations'],
        summary: 'Shutdown Organization',
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

      // 1. Busca a membership e a organização pelo slug
      const { membership, organization } = await request.getUserMembership(slug)
      

      const userId = await request.getCurrentUserId()

      // 2. Validação de Permissões (CASL)
      
      // Criamos a representação do usuário para o CASL
      const authUser = UserSchema.parse({
        id: userId,
        role: membership.role,
      })

      // Criamos a representação da organização para o CASL
      const authOrganization = organizationSchema.parse(organization)

      // Geramos as permissões baseadas no usuário
      const { cannot } = defineAbilityFor(authUser)

      // Verificamos se ele PODE atualizar ESSA organização específica
      if (cannot('delete', authOrganization)) {
        throw new UnauthorizedError("You're not allowed to shutdown this organization")
      }

      
      // 4. Atualização no banco
      await prisma.organization.delete({
        where: {
          id: organization.id,
        },
      })

      return reply.status(204).send()
    },
  )
}