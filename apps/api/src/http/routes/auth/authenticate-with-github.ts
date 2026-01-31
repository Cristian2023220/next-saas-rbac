import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import axios from 'axios'
import { prisma } from '../../../lib/prisma'
import { BadRequestError } from '../_errors/bad-request-error'
import { env } from '@saas/env../../env' // <--- 1. Importação do env adicionada

export async function authenticateWithGithub(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions/github',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Authenticate with GitHub',
        body: z.object({
          code: z.string(),
        }),
        response: {
          201: z.object({
            token: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { code } = request.body

      const { data: githubOAuthData } = await axios.post(
        'https://github.com/login/oauth/access_token',
        null,
        {
          params: {
            client_id: env.GITHUB_OAUTH_CLIENT_ID,
            client_secret: env.GITHUB_OAUTH_CLIENT_SECRET,
            redirect_uri: env.GITHUB_OAUTH_CLIENT_REDIRECT_URI,
            code,
          },
          headers: {
            Accept: 'application/json',
          },
        },
      )

      if (githubOAuthData.error) {
        throw new BadRequestError(
          `GitHub Error: ${githubOAuthData.error_description}`,
        )
      }

      const { access_token } = z
        .object({
          access_token: z.string(),
          error: z.string().optional(),
        })
        .parse(githubOAuthData)

      // 2. Busca dados do usuário
      const { data: githubUser } = await axios.get(
        'https://api.github.com/user',
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      )

      const {
        id: githubId,
        name,
        email,
        avatar_url: avatarUrl,
      } = z
        .object({
          id: z.number(),
          name: z.string().nullable(),
          email: z.string().nullable(),
          avatar_url: z.string().url(),
        })
        .parse(githubUser)

      let primaryEmail = email

      if (!primaryEmail) {
        const { data: emails } = await axios.get(
          'https://api.github.com/user/emails',
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          },
        )

        const emailsSchema = z.array(
          z.object({
            email: z.string(),
            primary: z.boolean(),
            verified: z.boolean(),
          }),
        )

        const validatedEmails = emailsSchema.parse(emails)

        // Pega o e-mail que é primário
        const primaryEmailObj = validatedEmails.find((email) => email.primary)

        primaryEmail = primaryEmailObj?.email || null
      }

      if (!primaryEmail) {
        throw new BadRequestError(
          'Your GitHub account must have a public email to sign up.',
        )
      }

      // 3. Cria ou atualiza o usuário no banco
      let user = await prisma.user.findUnique({
        where: { email: primaryEmail },
      })

      if (!user) {
        user = await prisma.user.create({
          data: {
            name: name ?? '',
            email: primaryEmail,
            avatarUrl,
          },
        })
      }

      let account = await prisma.account.findUnique({
        where: {
          provider_userId: {
            provider: 'GITHUB',
            userId: user.id,
          },
        },
      })

      if (!account) {
        await prisma.account.create({
          data: {
            provider: 'GITHUB',
            providerAccountId: String(githubId),
            userId: user.id,
          },
        })
      }

      const token = await reply.jwtSign(
        {
          sub: user.id,
        },
        {
          sign: {
            expiresIn: '7d',
          },
        },
      )

      return reply.status(201).send({ token })
    },
  )
}