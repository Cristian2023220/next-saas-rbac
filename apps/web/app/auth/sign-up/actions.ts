'use server'

import { HTTPError } from 'ky'
import { z } from 'zod'
import { redirect } from 'next/navigation'
import { signUp } from '@/http/sign-up'

const signUpSchema = z.object({
    name: z.string().refine(value => value.split(' ').length > 1, {
        message: 'Pleane, enter your full name'
    }),
  email: z.string().email({message: 'Please, provide a valid email address.'}),
  password: z.string().min(6, {message: 'Password should hate at least 6 characters.'}),
  confirm_password: z.string(),
}).refine(data => data.password == data.confirm_password, {
    message: 'Password confirmation does not match.',
    path: ['confirm_password'],
})

export async function signUpAction(data: FormData) {
  const result = signUpSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors
    return { success: false, message: null, errors }
  }

  const { name, email, password } = result.data

  try {
    await signUp({
        name,
      email,
      password,
    })

  } catch (err){
    if(err instanceof HTTPError){
      const {message} = await err.response.json()
      return { success: false, message, errors: null }
    }

    console.error(err)
    return { success: false, message: 'Unexpected error, try again in a few minutes.', errors: null }
  }
  redirect('/') 
}
export async function signInWithGithub() {
    const githubSigninURL = new URL('login/oauth/authorize', 'https://github.com')

    githubSigninURL.searchParams.set('client_id', 'Ov23liVXJ2M5Sw2FWTWc')
    githubSigninURL.searchParams.set('redirect_uri', 'http://localhost:3000/api/auth/callback')
    githubSigninURL.searchParams.set('scope', 'user')

    redirect(githubSigninURL.toString())
}