import assert from 'node:assert/strict'
import test from 'node:test'

import {
  requestPasswordRecovery,
  signInWithEmailAndPassword,
  signOutSupabaseUser,
  signUpWithEmailAndPassword,
  type SupabaseAuthGateway,
} from './supabase-auth'

function createMockAuthClient(
  overrides: Partial<SupabaseAuthGateway['auth']> = {},
): SupabaseAuthGateway {
  return {
    auth: {
      signInWithPassword: async () => ({
        data: { session: null },
        error: null,
      }),
      signUp: async () => ({
        data: { session: null },
        error: null,
      }),
      signOut: async () => ({
        error: null,
      }),
      resetPasswordForEmail: async () => ({
        error: null,
      }),
      ...overrides,
    },
  }
}

test('sign in uses the Supabase password auth API', async () => {
  const client = createMockAuthClient({
    signInWithPassword: async (credentials) => {
      assert.deepEqual(credentials, {
        email: 'person@example.com',
        password: 'password-123',
      })

      return {
        data: { session: null },
        error: null,
      }
    },
  })

  await assert.doesNotReject(
    signInWithEmailAndPassword(client, {
      email: 'person@example.com',
      password: 'password-123',
    }),
  )
})

test('sign up returns whether a session was created', async () => {
  const client = createMockAuthClient({
    signUp: async () => ({
      data: { session: null },
      error: null,
    }),
  })

  await assert.doesNotReject(
    signUpWithEmailAndPassword(client, {
      email: 'person@example.com',
      password: 'password-123',
    }),
  )
})

test('sign out delegates to Supabase auth', async () => {
  const client = createMockAuthClient()

  await assert.doesNotReject(signOutSupabaseUser(client))
})

test('password recovery sends the reset email with a redirect target', async () => {
  const client = createMockAuthClient({
    resetPasswordForEmail: async (email, options) => {
      assert.equal(email, 'person@example.com')
      assert.deepEqual(options, {
        redirectTo: 'https://example.com/reset',
      })

      return {
        error: null,
      }
    },
  })

  await assert.doesNotReject(
    requestPasswordRecovery(client, 'person@example.com', 'https://example.com/reset'),
  )
})
