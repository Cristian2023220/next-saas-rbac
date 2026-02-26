import { Role } from '@saas/auth'

import { api } from './api-client'

interface GetInvitesResponse {
  invites: {
    id: string
    role: Role
    email: string
    createdAt: string
    author: {
      id: string
      name: string | null
    } | null
  }[]
}

export async function getInvites(org: string) {
  try {
    const result = await api
      .get(`organizations/${org}/invites`, {
        next: {
          tags: [`${org}/invites`],
        },
      })
      .json<GetInvitesResponse>()

    return result
  } catch (error: any) { // <--- Adicionamos o 'catch' bem aqui!
    // 👇 O nosso código espião para capturar a mensagem do backend
    if (error.response) {
      const errorBody = await error.response.json().catch(() => ({}))
      console.error('🚨 ERRO REAL DA API:', errorBody)
    } else {
      console.error('🚨 OUTRO ERRO:', error)
    }
    
    throw error // Repassa o erro para o Next.js lidar
  }
}