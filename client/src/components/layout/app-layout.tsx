import type { ReactNode } from 'react'

import { Header } from '@/components/layout/header'
import type { ApiConnectionStatus } from '@/types/interview'

type AppLayoutProps = {
  apiConnectionStatus: ApiConnectionStatus
  children: ReactNode
}

export function AppLayout({ apiConnectionStatus, children }: AppLayoutProps) {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <Header apiConnectionStatus={apiConnectionStatus} />
      <main>{children}</main>
    </div>
  )
}
