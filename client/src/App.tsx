import { useEffect, useMemo, useRef, useState } from 'react'
import { SupabaseAuthPanel } from '@/components/auth/supabase-auth-panel'
import { AppLayout } from '@/components/layout/app-layout'
import { HomePage } from '@/pages/home-page'
import {
  createInterview,
  getApiHealth,
  InterviewApiError,
} from '@/services/interview-api'
import {
  createSupabaseBrowserClient,
} from '@/supabase/client'
import {
  hasSupabaseClientEnvironment,
} from '@/supabase/config'
import type {
  ApiConnectionStatus,
  CreateInterviewResponse,
  InterviewConfig,
  InterviewQuestionResult,
} from '@/types/interview'

function App() {
  const [savedConfig, setSavedConfig] = useState<InterviewConfig | null>(null)
  const [interview, setInterview] = useState<CreateInterviewResponse | null>(null)
  const [interviewResults, setInterviewResults] = useState<Record<string, InterviewQuestionResult>>({})
  const pendingSessionFocusRef = useRef(false)
  const reportLoadingTimerRef = useRef<number | undefined>(undefined)
  const sessionRef = useRef<HTMLElement | null>(null)
  const setupRef = useRef<HTMLDivElement | null>(null)
  const [isReportLoading, setIsReportLoading] = useState(false)
  const [isReportVisible, setIsReportVisible] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [apiConnectionStatus, setApiConnectionStatus] =
    useState<ApiConnectionStatus>('checking')
  const supabaseEnabled = hasSupabaseClientEnvironment()
  const { client: supabaseClient, error: supabaseError } = useMemo(() => {
    if (!supabaseEnabled) {
      return {
        client: null,
        error: '',
      }
    }

    try {
      return {
        client: createSupabaseBrowserClient(),
        error: '',
      }
    } catch (supabaseEnvironmentError) {
      return {
        client: null,
        error:
          supabaseEnvironmentError instanceof Error
            ? 'Supabase auth is not available because the browser env is invalid.'
            : 'Supabase auth is not available right now.',
      }
    }
  }, [supabaseEnabled])

  useEffect(() => {
    let isActive = true

    getApiHealth()
      .then(() => {
        if (isActive) {
          setApiConnectionStatus('connected')
        }
      })
      .catch(() => {
        if (isActive) {
          setApiConnectionStatus('unavailable')
        }
      })

    return () => {
      isActive = false
      clearReportLoadingTimer()
    }
  }, [])

  useEffect(() => {
    if (!interview || !pendingSessionFocusRef.current) {
      return
    }

    pendingSessionFocusRef.current = false
    window.requestAnimationFrame(() => {
      sessionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      sessionRef.current?.focus({ preventScroll: true })
    })
  }, [interview])

  function clearReportLoadingTimer() {
    window.clearTimeout(reportLoadingTimerRef.current)
    reportLoadingTimerRef.current = undefined
  }

  function handleCompleteInterview() {
    clearReportLoadingTimer()
    setIsReportVisible(false)
    setIsReportLoading(true)

    reportLoadingTimerRef.current = window.setTimeout(() => {
      reportLoadingTimerRef.current = undefined
      setIsReportLoading(false)
      setIsReportVisible(true)
    }, 500)
  }

  async function handleStartInterview(config: InterviewConfig) {
    clearReportLoadingTimer()
    setSavedConfig(config)
    setInterview(null)
    setInterviewResults({})
    setIsReportLoading(false)
    setIsReportVisible(false)
    setError('')
    setIsLoading(true)

    try {
      const nextInterview = await createInterview(config)
      pendingSessionFocusRef.current = true
      setInterview(nextInterview)
    } catch (requestError) {
      setError(
        requestError instanceof InterviewApiError
          ? requestError.message
          : 'Interview generation failed. Please try again.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  function handleStartNewInterview() {
    clearReportLoadingTimer()
    setSavedConfig(null)
    setInterview(null)
    setInterviewResults({})
    setIsReportLoading(false)
    setIsReportVisible(false)
    setError('')

    window.requestAnimationFrame(() => {
      setupRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setupRef.current?.focus({ preventScroll: true })
    })
  }

  return (
    <AppLayout apiConnectionStatus={apiConnectionStatus}>
      <HomePage
        error={error}
        interview={interview}
        interviewResults={interviewResults}
        isReportLoading={isReportLoading}
        isReportVisible={isReportVisible}
        isLoading={isLoading}
        onCompleteInterview={handleCompleteInterview}
        onStartNewInterview={handleStartNewInterview}
        onResultChange={(result) =>
          setInterviewResults((currentResults) => ({
            ...currentResults,
            [result.question.id]: result,
          }))
        }
        onResultRemove={(questionId) => {
          clearReportLoadingTimer()
          setInterviewResults((currentResults) => {
            const nextResults = { ...currentResults }
            delete nextResults[questionId]
            return nextResults
          })
          setIsReportLoading(false)
          setIsReportVisible(false)
        }}
        onStartInterview={handleStartInterview}
        savedConfig={savedConfig}
        supabaseAuth={
          <SupabaseAuthPanel
            client={supabaseClient}
            configurationError={supabaseError || null}
            isConfigured={supabaseEnabled}
          />
        }
        sessionRef={sessionRef}
        setupRef={setupRef}
      />
    </AppLayout>
  )
}

export default App
