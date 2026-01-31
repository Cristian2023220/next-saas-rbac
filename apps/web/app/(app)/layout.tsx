
import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/auth/auth'
import { Header } from '@/components/header'

export default async function AppLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  if (await !isAuthenticated()) {
    redirect('/auth/sign-in')
  }

  return (
    <div className='py-4'>
      <Header />
      <main>{children}</main>
    </div>
  )
}
