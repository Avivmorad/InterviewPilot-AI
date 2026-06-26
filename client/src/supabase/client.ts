import { createClient, type SupabaseClient } from '@supabase/supabase-js'

import {
  readSupabaseClientEnvironment,
  type SupabaseClientEnvironment,
} from './config'

const browserAuthOptions = {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
} as const

export type SupabaseBrowserClientConfig = SupabaseClientEnvironment & {
  options: typeof browserAuthOptions
}

export function buildSupabaseBrowserClientConfig(
  environment: SupabaseClientEnvironment = readSupabaseClientEnvironment(),
): SupabaseBrowserClientConfig {
  return {
    ...environment,
    options: browserAuthOptions,
  }
}

export function createSupabaseBrowserClient(
  environment: SupabaseClientEnvironment = readSupabaseClientEnvironment(),
): SupabaseClient {
  const config = buildSupabaseBrowserClientConfig(environment)

  return createClient(config.url, config.anonKey, config.options)
}

let browserClient: SupabaseClient | undefined

export function getSupabaseBrowserClient(): SupabaseClient {
  if (!browserClient) {
    browserClient = createSupabaseBrowserClient()
  }

  return browserClient
}
