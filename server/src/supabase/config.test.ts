import assert from 'node:assert/strict'
import test from 'node:test'

import { hasSupabaseAuthSecrets, readSupabaseEnvironment } from './config.js'

test('reads and trims Supabase environment variables', () => {
  const environment = readSupabaseEnvironment({
    SUPABASE_URL: 'https://project.supabase.co ',
    SUPABASE_ANON_KEY: ' anon-key ',
    SUPABASE_SERVICE_ROLE_KEY: ' service-role-key ',
  })

  assert.deepEqual(environment, {
    url: 'https://project.supabase.co',
    anonKey: 'anon-key',
    serviceRoleKey: 'service-role-key',
  })
  assert.equal(hasSupabaseAuthSecrets(environment), true)
})

test('rejects missing Supabase URL before auth is enabled', () => {
  assert.throws(() => readSupabaseEnvironment({}), /SUPABASE_URL must be set/)
})
