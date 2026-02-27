import { redirect } from 'next/navigation'
import React from 'react'
import type { JSX } from 'react' 

import { isAuthenticated } from '@/auth/auth'

export default async function OrgLayout({
  children,
  sheet,
}: Readonly<{
  children: React.ReactNode
  sheet: React.ReactNode
}>): Promise<JSX.Element> {
  const isAuth = await isAuthenticated()
  
  if (!isAuth) {
    redirect('/auth/sign-in')
  }

  return (
    <>
      {children}
      {sheet}
    </>
  )
}