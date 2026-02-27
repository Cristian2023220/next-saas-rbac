import Header from '@/components/header'
import { Tabs } from '@/components/tabs'
import type { JSX } from 'react' 

export default async function OrgLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ slug: string }>
}>) : Promise<JSX.Element> {
  const { slug } = await params

  return (
    <div>
      <div className="pt-6">
        <Header />
        <Tabs org={slug} />
      </div>

      <main className="mx-auto w-full max-w-[1200px] py-4">{children}</main>
    </div>
  )
}