'use server'

import { redirect } from "next/navigation"
import { env } from "@saas/env"

export async function signInWithGithub() {
    const githubSigninURL = new URL('login/oauth/authorize', 'https://github.com')

    githubSigninURL.searchParams.set('client_id', env.GITHUB_OAUTH_CLIENT_ID)
    githubSigninURL.searchParams.set('redirect_uri', env.GITHUB_OAUTH_CLIENT_REDIRECT_URI)
    githubSigninURL.searchParams.set('scope', 'user')

    redirect(githubSigninURL.toString())
}