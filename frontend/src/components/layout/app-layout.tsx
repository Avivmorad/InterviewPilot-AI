import type { ReactNode } from 'react'

import { Header } from '@/components/layout/header'

type AppLayoutProps = {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <Header />
      <main>{children}</main>
    </div>
  )
}
