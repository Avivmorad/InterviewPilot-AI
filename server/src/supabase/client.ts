import { createClient, type SupabaseClient } from '@supabase/supabase-js'

import {
  hasSupabaseAuthSecrets,
  readSupabaseEnvironment,
  type SupabaseEnvironment,
} from './config.js'
import type { SupabaseDatabase } from './database.js'

const serverAuthOptions = {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
} as const

export type SupabaseServiceClientConfig = {
  url: string
  serviceRoleKey: string
  options: typeof serverAuthOptions
}

export function buildSupabaseServiceClientConfig(
  environment: SupabaseEnvironment = readSupabaseEnvironment(),
): SupabaseServiceClientConfig {
  if (!hasSupabaseAuthSecrets(environment)) {
    throw new Error(
      'SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY must be set before Phase 2 auth is enabled.',
    )
  }

  if (!environment.serviceRoleKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY must be set before Phase 2 auth is enabled.',
    )
  }

  return {
    url: environment.url,
    serviceRoleKey: environment.serviceRoleKey,
    options: serverAuthOptions,
  }
}

export function createSupabaseServiceClient(
  environment: SupabaseEnvironment = readSupabaseEnvironment(),
): SupabaseClient<SupabaseDatabase> {
  const config = buildSupabaseServiceClientConfig(environment)

  return createClient<SupabaseDatabase>(
    config.url,
    config.serviceRoleKey,
    config.options,
  )
}
