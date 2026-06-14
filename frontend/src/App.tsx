import { useState } from 'react'

import { AppLayout } from '@/components/layout/app-layout'
import { HomePage } from '@/pages/home-page'
import {
  createInterview,
  InterviewApiError,
} from '@/services/interview-api'
import type { CreateInterviewResponse, InterviewConfig } from '@/types/interview'

function App() {
  const [savedConfig, setSavedConfig] = useState<InterviewConfig | null>(null)
  const [interview, setInterview] = useState<CreateInterviewResponse | null>(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

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
    <AppLayout>
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
