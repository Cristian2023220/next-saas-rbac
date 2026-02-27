import { Role } from '@saas/auth'

import { api } from './api-client'

interface GetInviteResponse {
  invite: {
    id: string
    role: Role
    email: string
    createdAt: string
    organization: {
      name: string
    }
    author: {
      id: string
      name: string | null
      avatarUrl: string | null
    } | null
  }
}

export async function getInvite(inviteId: string) {
  try {
    const result = await api.get(`invites/${inviteId}`).json<GetInviteResponse>()
    return result
  } catch (error) {
    // Retorna null em vez de explodir a tela com erro
    return null 
  }
}
