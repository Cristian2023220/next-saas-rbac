import { ReactNode } from 'react' // 1. Adicione este import
import { XOctagon } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { revokeInviteAction } from './actions'

interface RevokeInviteButtonProps {
  inviteId: string
}

// 2. Adicione : ReactNode aqui 👇
export function RevokeInviteButton({ inviteId }: RevokeInviteButtonProps): ReactNode {
  return (
    <form action={revokeInviteAction.bind(null, inviteId)}>
      <Button size="sm" variant="destructive">
        <XOctagon className="mr-2 size-4" />
        Revoke invite
      </Button>
    </form>
  )
}