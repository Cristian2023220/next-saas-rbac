import Header from '@/components/header'
import type { JSX } from 'react'

export default async function Home(): Promise<JSX.Element> {
  return (
    <div className="space-y-4 py-4">
      <Header />
      <main className="mx-auto w-full max-w-[1200px] space-y-4">
        <p className="text-sm text-muted-foreground">Select a organization</p>
      </main>
    </div>
  )
}
