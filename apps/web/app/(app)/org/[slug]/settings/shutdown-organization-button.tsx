import { XCircle } from 'lucide-react'
import { redirect } from 'next/navigation'
import { revalidateTag } from 'next/cache'

import { getCurrentOrg } from '@/auth/auth'
import { Button } from '@/components/ui/button'
import { shutdownOrganization } from '@/http/shutdown-organization'

export function ShutdownOrganizationButton() {
  async function shutdownOrganizationAction() {
    'use server'

    const currentOrg = await getCurrentOrg()

    await shutdownOrganization({ org: currentOrg! })
    revalidateTag('organizations')
    redirect('/')
  }

  return (
    <form action={shutdownOrganizationAction}>
      <Button type="submit" variant="destructive" className="w-56">
        <XCircle className="mr-2 size-4" />
        Shutdown organization
      </Button>
    </form>
  )
  // (O redirect que estava solto aqui embaixo foi apagado!)
}