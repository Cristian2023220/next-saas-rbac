'use server'

import { HTTPError } from 'ky'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'

import { getCurrentOrg } from '@/auth/auth'
import { updateMember } from '@/http/update-member' // O caminho do seu arquivo da imagem

// Crie o schema de validação para a role do membro
const updateMemberSchema = z.object({
  memberId: z.string().uuid({ message: 'ID de membro inválido.' }),
  role: z.string(), // Você pode usar z.enum(['ADMIN', 'MEMBER']) se tiver roles fixas
})

export async function updateMemberAction(data: FormData) {
  // Pega a organização atual (assim como você fez no updateOrganizationAction)
  const currentOrg = await getCurrentOrg()

  const result = updateMemberSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors
    return { success: false, message: null, errors }
  }

  const { memberId, role } = result.data

  try {
    await updateMember({
      org: currentOrg!,
      memberId,
      role: role as "ADMIN" | "MEMBER" | "BILLING",
    })

    revalidateTag('members') 
  } catch (err) {
    if (err instanceof HTTPError) {
      try {
          const { message } = await err.response.json()
          return { success: false, message, errors: null }
      } catch {
          return { success: false, message: 'Recurso não encontrado no servidor (404).', errors: null }
      }
    }

    console.error(err)

    return {
      success: false,
      message: 'Unexpected error, try again in a few minutes.',
      errors: null,
    }
  }

  return {
    success: true,
    message: 'Successfully updated the member role.',
    errors: null,
  }
}