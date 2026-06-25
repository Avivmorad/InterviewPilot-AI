export type SupabaseEnvironment = {
  url: string
  anonKey?: string
  serviceRoleKey?: string
}

function readRequiredUrl(value: string | undefined): string {
  const url = value?.trim()

  if (!url) {
    throw new Error('SUPABASE_URL must be set before Phase 2 auth is enabled.')
  }

  try {
    const parsed = new URL(url)
    const isLocalHost = parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1'

    if (parsed.protocol !== 'https:' && !isLocalHost) {
      throw new Error('Supabase URL must use https or localhost during local development.')
    }
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? `SUPABASE_URL is invalid: ${error.message}`
        : 'SUPABASE_URL is invalid.',
    )
  }

  return url
}

function readOptionalSecret(value: string | undefined): string | undefined {
  const secret = value?.trim()
  return secret?.length ? secret : undefined
}

export function readSupabaseEnvironment(
  env: NodeJS.ProcessEnv = process.env,
): SupabaseEnvironment {
  return {
    url: readRequiredUrl(env.SUPABASE_URL),
    anonKey: readOptionalSecret(env.SUPABASE_ANON_KEY),
    serviceRoleKey: readOptionalSecret(env.SUPABASE_SERVICE_ROLE_KEY),
  }
}

export function hasSupabaseAuthSecrets(environment: SupabaseEnvironment): boolean {
  return Boolean(environment.anonKey && environment.serviceRoleKey)
}
