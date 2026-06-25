import assert from 'node:assert/strict'
import test from 'node:test'

import {
  buildSupabaseServiceClientConfig,
  createSupabaseServiceClient,
} from './client.js'

test('builds a server-side Supabase client config with auth disabled', () => {
  const config = buildSupabaseServiceClientConfig({
    url: 'https://project.supabase.co',
    anonKey: 'anon-key',
    serviceRoleKey: 'service-role-key',
  })

  assert.deepEqual(config, {
    url: 'https://project.supabase.co',
    serviceRoleKey: 'service-role-key',
    options: {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    },
  })
})

test('rejects missing Supabase auth secrets for the server client', () => {
  assert.throws(
    () =>
      buildSupabaseServiceClientConfig({
        url: 'https://project.supabase.co',
      }),
    /SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY must be set/,
  )
})

test('creates a Supabase client when the server secrets are present', () => {
  const client = createSupabaseServiceClient({
    url: 'https://project.supabase.co',
    anonKey: 'anon-key',
    serviceRoleKey: 'service-role-key',
  })

  assert.equal(typeof client.from, 'function')
})
