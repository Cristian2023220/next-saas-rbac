import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { signInWithGithub } from "@/http/sign-in-with-github";
import { acceptInvite } from "app/(app)/org/[slug]/members/accept-invite";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')

    if (!code) {
        return NextResponse.json({
            message: 'Github Oauth code was not found',
        }, { status: 400 })
    }

    // Chama o backend para pegar o token
    const { token } = await signInWithGithub({ code })

    // Salva o token nos cookies
    const cookieStore = await cookies();
    cookieStore.set('token', token, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    const inviteId = cookieStore.get('inviteId')?.value

     if (inviteId) {
         try {
           await acceptInvite(inviteId)
              cookieStore.delete('inviteId')
    } catch {}
  }

    // Prepara o redirecionamento para a Home
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/'
    redirectUrl.search = '' // Limpa o ?code=123 da URL

    // Redireciona usando a URL limpa
    return NextResponse.redirect(redirectUrl)
}