import { api } from './api-client' 

interface TransferOrganizationRequest {
  org: string
  transferToUserId: string
}

export async function transferOrganization({
  org,
  transferToUserId,
}: TransferOrganizationRequest) {
  await api.patch(`organizations/${org}/owner`, {
    json: {
      transferToUserId,
    },
  })
}