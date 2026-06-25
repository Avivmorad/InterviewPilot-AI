import assert from 'node:assert/strict'
import test from 'node:test'

import {
  buildSupabaseBrowserClientConfig,
  createSupabaseBrowserClient,
} from './client'
import { readSupabaseClientEnvironment } from './config'

test('reads and trims Supabase browser environment variables', () => {
  const environment = readSupabaseClientEnvironment({
    VITE_SUPABASE_URL: 'https://project.supabase.co ',
    VITE_SUPABASE_ANON_KEY: ' anon-key ',
  })

  assert.deepEqual(environment, {
    url: 'https://project.supabase.co',
    anonKey: 'anon-key',
  })
})

test('builds a browser Supabase client config with browser auth enabled', () => {
  const config = buildSupabaseBrowserClientConfig({
    url: 'https://project.supabase.co',
    anonKey: 'anon-key',
  })

  assert.deepEqual(config, {
    url: 'https://project.supabase.co',
    anonKey: 'anon-key',
    options: {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    },
  })
})

test('creates a browser Supabase client when the anon key is present', () => {
  const client = createSupabaseBrowserClient({
    url: 'https://project.supabase.co',
    anonKey: 'anon-key',
  })

  assert.equal(typeof client.from, 'function')
})

test('rejects missing browser Supabase env values', () => {
  assert.throws(
    () =>
      readSupabaseClientEnvironment({
        VITE_SUPABASE_URL: 'https://project.supabase.co',
      }),
    /VITE_SUPABASE_ANON_KEY must be set/,
  )
})
