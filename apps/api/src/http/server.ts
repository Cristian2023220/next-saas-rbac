import fastify from 'fastify';
import fastifySwagger from '@fastify/swagger';
import fastifyCors from '@fastify/cors';
import {
    jsonSchemaTransform,
    serializerCompiler,
    validatorCompiler,
    ZodTypeProvider
} from 'fastify-type-provider-zod'
import { createAccount } from './routes/auth/create-accont';
import fastifySwaggerUI from '@fastify/swagger-ui'
import { authenticateWithPassword } from './routes/auth/authenticate-with-password';
import fastifyJwt from '@fastify/jwt';
import { getProfile } from './routes/auth/get-profile';
import { errorHandler } from './error_handler';
import { requestPasswordRecover } from './routes/auth/request-password-recover';
import { authenticateWithGithub } from './routes/auth/authenticate-with-github';
import { setDefaultResultOrder } from 'node:dns'
import { env } from '@saas/env../../env'
import { createOrganization } from './routes/orgs/create-organization';
import { getMembership } from './routes/orgs/get-membership';
import { getOrganization } from './routes/orgs/get-organization';
import { getOrganizations } from './routes/orgs/get-organizations';
import { updateOrganization } from './routes/orgs/update-organization';
import { shutdownOrganization } from './routes/orgs/shutdown-organization';
import { transferOrganization } from './routes/orgs/transfer-organization';
import { createProject } from './routes/projects/create-project';
import { deleteProject } from './routes/projects/delete-project';
import { getProject } from './routes/projects/get-project';
import { getProjects } from './routes/projects/get-projects';
import { updateProject } from './routes/projects/update-project';
import { getMembers } from './routes/member/get-members';
import { updateMember } from './routes/member/update-member';
import { removeMember } from './routes/member/remove-member';
import { createInvite } from './routes/invites/create-invite';
import { getInvite } from './routes/invites/get-invite';
import { getInvites } from './routes/invites/get.invites';
import { rejectInvite } from './routes/invites/reject-invite';
import { acceptInvite } from './routes/invites/accept-invite';
import { getPendingInvites } from './routes/invites/get-pending-invites';
import { getOrganizationBilling } from './routes/biling/get-organization-billing';
import { resetPassword } from './routes/auth/reset-password';
import { revokeInvite } from './routes/invites/revoke-invite';




const app = fastify({ logger: true }).withTypeProvider<ZodTypeProvider>()
setDefaultResultOrder('ipv4first')

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)
app.setErrorHandler(errorHandler)


app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Next.js SAAS',
      description: 'Fullstack Next.js SAAS application & RBAC',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  transform: jsonSchemaTransform, // Importante para o Zod funcionar
})

app.register(fastifySwaggerUI, {
  routePrefix: '/docs',
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET
})

app.register(fastifyCors)

// Routes auth
app.register(createAccount)
app.register(authenticateWithPassword)
app.register(getProfile)
app.setErrorHandler(errorHandler)
app.register(requestPasswordRecover)
app.register(resetPassword)
app.register(authenticateWithGithub)

//Routes Orgs
app.register(createOrganization)
app.register(getMembership)
app.register(getOrganization)
app.register(getOrganizations)
app.register(updateOrganization)
app.register(shutdownOrganization)
app.register(transferOrganization)

//Routes Projects
app.register(createProject)
app.register(deleteProject)
app.register(getProject)
app.register(getProjects)
app.register(updateProject)

//Routes Members
app.register(getMembers)
app.register(updateMember)
app.register(removeMember)


// Routes invites
app.register(createInvite)
app.register(getInvite)
app.register(getInvites)
app.register(rejectInvite)
app.register(acceptInvite)
app.register(revokeInvite)
app.register(getPendingInvites)


// Route biling
app.register(getOrganizationBilling)





app.listen ({port: env.SERVER_PORT}).then(() => {
    console.log('HTTP server running on http://localhost:3333/docs');
});