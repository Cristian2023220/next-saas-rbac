import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const redirectUrl = request.nextUrl.clone()
    
    // Manda o usuário para a tela de login
    redirectUrl.pathname = '/auth/sign-in'
    
    // Deleta o token
    const cookieStore = await cookies()
    cookieStore.delete('token')

    // USA a URL que configuramos acima
    return NextResponse.redirect(redirectUrl)
}