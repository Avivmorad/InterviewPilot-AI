export const INTERVIEW_ROLES = [
  { value: 'frontend-developer', label: 'Frontend Developer' },
  { value: 'backend-developer', label: 'Backend Developer' },
  { value: 'full-stack-developer', label: 'Full Stack Developer' },
  { value: 'ai-engineer', label: 'AI Engineer' },
  { value: 'generative-ai-engineer', label: 'Generative AI Engineer' },
] as const

export const INTERVIEW_LEVELS = [
  { value: 'intern', label: 'Intern' },
  { value: 'junior', label: 'Junior' },
  { value: 'mid-level', label: 'Mid-Level' },
  { value: 'senior', label: 'Senior' },
] as const
export const INTERVIEW_TYPES = ['Technical', 'Behavioral', 'Mixed'] as const
export const QUESTION_COUNTS = [3] as const

export type Role = (typeof INTERVIEW_ROLES)[number]['value']
export type Level = (typeof INTERVIEW_LEVELS)[number]['value']
export type InterviewType = (typeof INTERVIEW_TYPES)[number]
export type QuestionCount = (typeof QUESTION_COUNTS)[number]
export type Difficulty = Level

export type InterviewQuestion = {
  id: string
  topic: string
  difficulty: Difficulty
  question: string
  expectedConcepts: string[]
}

export type EvaluationConfidenceLevel = 'low' | 'medium' | 'high'

export type CreateInterviewRequest = {
  role: Role
  level: Level
  interviewType: InterviewType
  questionCount: QuestionCount
}

export type CreateInterviewResponse = {
  interviewId: string
  questions: InterviewQuestion[]
}

export type EvaluateAnswerRequest = {
  question: InterviewQuestion
  answer: string
}

export type AnswerEvaluation = {
  score: number
  strengths: string[]
  weaknesses: string[]
  missingConcepts: string[]
  improvedAnswer: string
  confidenceLevel: EvaluationConfidenceLevel
}

export function getRoleLabel(roleValue: Role): string {
  return INTERVIEW_ROLES.find((role) => role.value === roleValue)?.label ?? roleValue
}

export function getLevelLabel(levelValue: Level): string {
  return INTERVIEW_LEVELS.find((level) => level.value === levelValue)?.label ?? levelValue
}
