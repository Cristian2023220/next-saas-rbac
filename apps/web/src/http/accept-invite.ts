import { api } from '@/http/api-client'
import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'

export async function acceptInviteAction(inviteId: string) {
  try {
    console.log('Enviando requisição para aceitar convite:', inviteId)
    await api.post(`invites/${inviteId}/accept`)
    console.log('Convite aceito com sucesso no backend!')
  } catch (error: any) {
    console.error('=== ERRO AO ACEITAR CONVITE NO BACKEND ===')
    
    // Mostra o erro detalhado no terminal
    if (error.response) {
      const errorData = await error.response.json().catch(() => null)
      console.error('Status:', error.response.status)
      console.error('Detalhes:', errorData || error.message)
    } else {
      console.error(error)
    }
    
    // Propaga o erro para impedir o redirecionamento se falhar
    throw error 
  }
  
  // Limpa o cache para o menu atualizar com a nova organização
  revalidateTag('organizations') 

  // Redireciona para a home
  redirect('/')
}