'use server'

import { revalidateTag } from 'next/cache'


import { rejectInvite } from '@/http/reject-invite'
import { acceptInvite } from 'app/(app)/org/[slug]/members/accept-invite'

export async function acceptInviteAction(inviteId: string) {
  await acceptInvite(inviteId)

  revalidateTag('organizations')
}

export async function rejectInviteAction(inviteId: string) {
  await rejectInvite(inviteId)
}