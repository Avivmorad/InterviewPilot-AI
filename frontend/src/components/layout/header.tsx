import { CodeXml } from 'lucide-react'

export function Header() {
  return (
    <header className="border-b bg-card">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <a className="flex items-center gap-3 font-semibold tracking-tight" href="/">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <CodeXml aria-hidden="true" className="size-5" />
          </span>
          <span>InterviewPilot AI</span>
        </a>

        <nav aria-label="Main navigation" className="flex items-center gap-6 text-sm">
          <a className="font-medium text-foreground" href="#home">
            Home
          </a>
          <a
            className="hidden text-muted-foreground transition-colors hover:text-foreground sm:inline"
            href="#how-it-works"
          >
            How it works
          </a>
        </nav>
      </div>
    </header>
  )
}
