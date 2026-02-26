import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // 1. Cria a URL para onde o usuário vai voltar (tela de login)
  const redirectUrl = request.nextUrl.clone()
  redirectUrl.pathname = '/auth/sign-in'

  // 2. Cria a resposta que obriga o navegador a redirecionar
  const response = NextResponse.redirect(redirectUrl)

  // 3. Apaga o cookie "anexando" a ordem diretamente nessa resposta
  response.cookies.delete('token')

  return response
}