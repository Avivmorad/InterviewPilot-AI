export type SupabaseAuthGateway = {
  auth: {
    signInWithPassword: (
      credentials: SupabaseAuthCredentials,
    ) => Promise<{
      error: { message: string } | null
      data: { session: unknown | null }
    }>
    signUp: (
      credentials: SupabaseAuthCredentials,
    ) => Promise<{
      error: { message: string } | null
      data: { session: unknown | null }
    }>
    signOut: () => Promise<{
      error: { message: string } | null
    }>
    resetPasswordForEmail: (
      email: string,
      options: { redirectTo: string },
    ) => Promise<{
      error: { message: string } | null
    }>
  }
}

export type SupabaseAuthCredentials = {
  email: string
  password: string
}

export class SupabaseAuthError extends Error {
  readonly code: string

  constructor(
    message: string,
    code: string,
  ) {
    super(message)
    this.name = 'SupabaseAuthError'
    this.code = code
  }
}

function toSafeAuthError(
  error: unknown,
  fallbackMessage: string,
  code: string,
): SupabaseAuthError {
  if (error && typeof error === 'object' && 'message' in error) {
    const message = error.message

    if (typeof message === 'string' && message.trim()) {
      return new SupabaseAuthError(message, code)
    }
  }

  return new SupabaseAuthError(fallbackMessage, code)
}

export async function signInWithEmailAndPassword(
  client: SupabaseAuthGateway,
  credentials: SupabaseAuthCredentials,
): Promise<void> {
  const { error } = await client.auth.signInWithPassword(credentials)

  if (error) {
    throw toSafeAuthError(error, 'Could not sign in. Please try again.', 'SIGN_IN_FAILED')
  }
}

export async function signUpWithEmailAndPassword(
  client: SupabaseAuthGateway,
  credentials: SupabaseAuthCredentials,
): Promise<boolean> {
  const { data, error } = await client.auth.signUp(credentials)

  if (error) {
    throw toSafeAuthError(error, 'Could not create the account. Please try again.', 'SIGN_UP_FAILED')
  }

  return Boolean(data.session)
}

export async function signOutSupabaseUser(client: SupabaseAuthGateway): Promise<void> {
  const { error } = await client.auth.signOut()

  if (error) {
    throw toSafeAuthError(error, 'Could not sign out. Please try again.', 'SIGN_OUT_FAILED')
  }
}

export async function requestPasswordRecovery(
  client: SupabaseAuthGateway,
  email: string,
  redirectTo: string,
): Promise<void> {
  const { error } = await client.auth.resetPasswordForEmail(email, {
    redirectTo,
  })

  if (error) {
    throw toSafeAuthError(
      error,
      'Could not send the password recovery email. Please try again.',
      'PASSWORD_RECOVERY_FAILED',
    )
  }
}
