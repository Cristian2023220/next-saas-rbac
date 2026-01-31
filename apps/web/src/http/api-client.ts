import ky from 'ky'
import { getCookie } from 'cookies-next'
import { env } from 'process';

export const api = ky.create({
  prefixUrl: env.NEXT_PUBLIC_API_URL, 
  hooks: {
    beforeRequest: [
      async (request) => {
        let token: string | undefined;
        if (typeof window === 'undefined') {

          const { cookies: serverCookies } = await import('next/headers') 
          

          token = await getCookie('token', { cookies: serverCookies }) as string | undefined
        } 

        else {
          token = getCookie('token') as string | undefined
        }
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`)
        }
      },
    ]
  }
})