import { api } from './api-client'

interface GetBillingResponse {
  billing: {
    seats: {
      amount: number
      unit: number
      price: number
    }
    projects: {
      amount: number
      unit: number
      price: number
    }
    total: number
  }
}

export async function getBilling(org: string) {
  const result = await api
    .get(`organizations/${org}/billing`, {
      cache: 'no-store',
      next: {
        tags: ['billing'],
      },
    })
    .json<GetBillingResponse>()

  return result
}