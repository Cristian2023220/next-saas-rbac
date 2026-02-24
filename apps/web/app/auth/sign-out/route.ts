import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()

  // 1. Remove o cookie de autenticação (troque 'token' pelo nome do seu cookie)
  cookieStore.delete('token')

  // 2. Cria a URL de redirecionamento para a página de login ou home
  const redirectUrl = request.nextUrl.clone()
  redirectUrl.pathname = '/auth/sign-in'
  redirectUrl.search = ''

  // 3. Redireciona o usuário
  return NextResponse.redirect(redirectUrl)
}