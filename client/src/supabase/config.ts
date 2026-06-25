export type SupabaseClientEnvironment = {
  url: string
  anonKey: string
}

type SupabaseClientEnvironmentSource = {
  VITE_SUPABASE_URL?: string
  VITE_SUPABASE_ANON_KEY?: string
}

function readRequiredUrl(value: string | undefined): string {
  const url = value?.trim()

  if (!url) {
    throw new Error('VITE_SUPABASE_URL must be set before Phase 2 auth is enabled.')
  }

  try {
    const parsed = new URL(url)
    const isLocalHost = parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1'

    if (parsed.protocol !== 'https:' && !isLocalHost) {
      throw new Error('Supabase URL must use https or localhost during local development.')
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`VITE_SUPABASE_URL is invalid: ${error.message}`, {
        cause: error,
      })
    }

    throw new Error('VITE_SUPABASE_URL is invalid.', { cause: error })
  }

  return url
}

function readRequiredKey(value: string | undefined): string {
  const key = value?.trim()

  if (!key) {
    throw new Error('VITE_SUPABASE_ANON_KEY must be set before Phase 2 auth is enabled.')
  }

  return key
}

export function readSupabaseClientEnvironment(
  env: SupabaseClientEnvironmentSource = import.meta.env as unknown as SupabaseClientEnvironmentSource,
): SupabaseClientEnvironment {
  return {
    url: readRequiredUrl(env.VITE_SUPABASE_URL),
    anonKey: readRequiredKey(env.VITE_SUPABASE_ANON_KEY),
  }
}
