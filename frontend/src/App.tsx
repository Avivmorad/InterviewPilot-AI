import { useEffect, useState } from 'react'

import { AppLayout } from '@/components/layout/app-layout'
import { HomePage } from '@/pages/home-page'
import {
  createInterview,
  getApiHealth,
  InterviewApiError,
} from '@/services/interview-api'
import type {
  ApiConnectionStatus,
  CreateInterviewResponse,
  InterviewConfig,
} from '@/types/interview'

function App() {
  const [savedConfig, setSavedConfig] = useState<InterviewConfig | null>(null)
  const [interview, setInterview] = useState<CreateInterviewResponse | null>(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [apiConnectionStatus, setApiConnectionStatus] =
    useState<ApiConnectionStatus>('checking')

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
    }
  }, [])

  async function handleStartInterview(config: InterviewConfig) {
    setSavedConfig(config)
    setInterview(null)
    setError('')
    setIsLoading(true)

    try {
      setInterview(await createInterview(config))
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

  return (
    <AppLayout apiConnectionStatus={apiConnectionStatus}>
      <HomePage
        error={error}
        interview={interview}
        isLoading={isLoading}
        onStartInterview={handleStartInterview}
        savedConfig={savedConfig}
      />
    </AppLayout>
  )
}

export default App
