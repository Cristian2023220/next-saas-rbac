import { api } from "./api-client"
import {Role} from "@saas/auth"

interface GetMembershipResponse{
    membership: {
    id: string
    role: Role
    organizationId: string
    userId: string
  }
}



export async function getMembership(org: string) {
  const result = await api
    .get(`organizations/${org}/membership`)
    .json<GetMembershipResponse>()

  return result
}