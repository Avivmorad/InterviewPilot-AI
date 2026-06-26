import { useEffect, useState, type FormEvent } from 'react'
import type { SupabaseClient, User } from '@supabase/supabase-js'
import { KeyRound, LoaderCircle, LogOut, MailCheck, UserPlus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  requestPasswordRecovery,
  signInWithEmailAndPassword,
  signOutSupabaseUser,
  signUpWithEmailAndPassword,
  type SupabaseAuthCredentials,
  SupabaseAuthError,
  type SupabaseAuthGateway,
} from '@/services/supabase-auth'

type AuthMode = 'sign-in' | 'sign-up'

type SupabaseAuthPanelProps = {
  client: SupabaseClient | null
  isConfigured: boolean
  configurationError: string | null
}

function getUserLabel(user: User | null): string {
  return user?.email ?? 'Signed in user'
}

export function SupabaseAuthPanel({
  client,
  configurationError,
  isConfigured,
}: SupabaseAuthPanelProps) {
  const [mode, setMode] = useState<AuthMode>('sign-in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<'loading' | 'signed-in' | 'signed-out'>(
    client ? 'loading' : 'signed-out',
  )
  const [user, setUser] = useState<User | null>(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!client) {
      return
    }

    let isActive = true
    client.auth.getSession().then(({ data }) => {
      if (!isActive) {
        return
      }

      const nextUser = data.session?.user ?? null
      setUser(nextUser)
      setStatus(nextUser ? 'signed-in' : 'signed-out')
    })

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      if (!isActive) {
        return
      }

      const nextUser = session?.user ?? null
      setUser(nextUser)
      setStatus(nextUser ? 'signed-in' : 'signed-out')
      setMessage(nextUser ? 'Session updated from Supabase.' : '')
    })

    return () => {
      isActive = false
      subscription.unsubscribe()
    }
  }, [client])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!client) {
      return
    }

    const credentials: SupabaseAuthCredentials = {
      email: email.trim(),
      password,
    }

    setIsSubmitting(true)
    setError('')
    setMessage('')

    try {
      if (mode === 'sign-in') {
        await signInWithEmailAndPassword(client as SupabaseAuthGateway, credentials)
        setMessage('Signed in successfully.')
      } else {
        const sessionCreated = await signUpWithEmailAndPassword(
          client as SupabaseAuthGateway,
          credentials,
        )
        setMessage(
          sessionCreated
            ? 'Account created and session started.'
            : 'Account created. Check your email for a confirmation link.',
        )
      }
    } catch (authError) {
      setError(
        authError instanceof SupabaseAuthError
          ? authError.message
          : 'Authentication failed. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handlePasswordRecovery() {
    if (!client) {
      return
    }

    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      setError('Enter an email address first.')
      return
    }

    setIsSubmitting(true)
    setError('')
    setMessage('')

    try {
      await requestPasswordRecovery(
        client as SupabaseAuthGateway,
        trimmedEmail,
        window.location.origin,
      )
      setMessage('Password recovery email sent.')
    } catch (authError) {
      setError(
        authError instanceof SupabaseAuthError
          ? authError.message
          : 'Could not send the recovery email. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleSignOut() {
    if (!client) {
      return
    }

    setIsSubmitting(true)
    setError('')
    setMessage('')

    try {
      await signOutSupabaseUser(client as SupabaseAuthGateway)
      setMessage('Signed out successfully.')
    } catch (authError) {
      setError(
        authError instanceof SupabaseAuthError
          ? authError.message
          : 'Could not sign out. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const isSignedIn = status === 'signed-in' && Boolean(user)

  return (
    <section className="soft-panel rounded-lg p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary/80">
            Phase 2 auth
          </p>
          <h2 className="mt-2 text-lg font-extrabold text-white">
            Supabase account access
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Sign up, sign in, sign out, and password recovery are wired here when
            the Supabase env vars are available.
          </p>
        </div>
        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-white">
          {isConfigured ? 'Enabled' : 'Disabled'}
        </span>
      </div>

      {!isConfigured ? (
        <p className="mt-4 rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-muted-foreground">
          Set <span className="font-semibold text-white">VITE_SUPABASE_URL</span>
          {' '}and <span className="font-semibold text-white">VITE_SUPABASE_ANON_KEY</span>
          {' '}to activate the browser auth flows.
        </p>
      ) : isSignedIn ? (
        <div className="mt-4 rounded-lg border border-emerald-400/20 bg-emerald-500/10 p-4">
          <p className="text-sm font-semibold text-emerald-100">
            Signed in as {getUserLabel(user)}
          </p>
          <p className="mt-1 text-sm leading-6 text-emerald-100/80">
            Auth state is being tracked by the Supabase browser client.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button
              disabled={isSubmitting}
              onClick={handleSignOut}
              type="button"
              variant="outline"
            >
              {isSubmitting ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <LogOut className="size-4" />
              )}
              Sign out
            </Button>
          </div>
        </div>
      ) : (
        <form className="mt-4 grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-white" htmlFor="supabase-email">
              Email
            </label>
            <input
              className="h-11 rounded-lg border border-white/12 bg-white/[0.03] px-4 text-sm text-white outline-none placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
              id="supabase-email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              type="email"
              value={email}
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-semibold text-white" htmlFor="supabase-password">
              Password
            </label>
            <input
              className="h-11 rounded-lg border border-white/12 bg-white/[0.03] px-4 text-sm text-white outline-none placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
              id="supabase-password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              type="password"
              value={password}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : mode === 'sign-in' ? (
                <KeyRound className="size-4" />
              ) : (
                <UserPlus className="size-4" />
              )}
              {mode === 'sign-in' ? 'Sign in' : 'Create account'}
            </Button>
            <Button
              disabled={isSubmitting}
              onClick={() => setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in')}
              type="button"
              variant="outline"
            >
              {mode === 'sign-in' ? 'Need an account?' : 'Have an account?'}
            </Button>
            <Button
              disabled={isSubmitting}
              onClick={handlePasswordRecovery}
              type="button"
              variant="ghost"
            >
              <MailCheck className="size-4" />
              Password recovery
            </Button>
          </div>
        </form>
      )}

      {message ? (
        <p className="mt-4 rounded-lg border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm leading-6 text-emerald-100">
          {message}
        </p>
      ) : null}

      {error || configurationError ? (
        <p className="mt-4 rounded-lg border border-red-400/25 bg-red-500/10 p-4 text-sm leading-6 text-red-100">
          {error || configurationError}
        </p>
      ) : null}
    </section>
  )
}
