import type { ReactNode } from 'react'

import { Header } from '@/components/layout/header'
import type { ApiConnectionStatus } from '@/types/interview'

type AppShellProps = {
  apiConnectionStatus: ApiConnectionStatus
  children: ReactNode
}

export function AppShell({ apiConnectionStatus, children }: AppShellProps) {
  return (
    <div className="app-atmosphere min-h-svh text-foreground">
      <Header apiConnectionStatus={apiConnectionStatus} />
      <main className="min-h-[calc(100svh-4.75rem)]">{children}</main>
    </div>
  )
}
