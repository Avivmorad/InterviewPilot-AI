export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type SupabaseProfileRow = {
  id: string
  display_name: string | null
  full_name: string | null
  headline: string | null
  created_at: string
  updated_at: string
}

export type SupabaseInterviewRow = {
  id: string
  user_id: string
  role: string
  level: string
  interview_type: string
  question_count: number
  status: 'in_progress' | 'completed' | 'abandoned'
  overall_score: number | null
  created_at: string
  updated_at: string
  completed_at: string | null
}

export type SupabaseInterviewQuestionRow = {
  id: string
  interview_id: string
  position: number
  topic: string
  difficulty: string
  question: string
  expected_concepts: string[]
  created_at: string
}

export type SupabaseAnswerRow = {
  id: string
  interview_question_id: string
  response_text: string
  submitted_at: string
}

export type SupabaseEvaluationRow = {
  id: string
  answer_id: string
  score: number
  strengths: string[]
  weaknesses: string[]
  missing_concepts: string[]
  improved_answer: string
  confidence_level: 'low' | 'medium' | 'high'
  evaluated_at: string
}

export type SupabaseFinalReportRow = {
  id: string
  interview_id: string
  user_id: string
  overall_score: number
  strengths_summary: string[]
  weaknesses_summary: string[]
  missing_concepts: string[]
  recommended_topics: string[]
  learning_roadmap: string
  created_at: string
  updated_at: string
}

export type SupabaseDatabase = {
  public: {
    Tables: {
      profiles: {
        Row: SupabaseProfileRow
        Insert: {
          id: string
          display_name?: string | null
          full_name?: string | null
          headline?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          display_name?: string | null
          full_name?: string | null
          headline?: string | null
          updated_at?: string
        }
      }
      interviews: {
        Row: SupabaseInterviewRow
        Insert: {
          id?: string
          user_id: string
          role: string
          level: string
          interview_type: string
          question_count: number
          status?: SupabaseInterviewRow['status']
          overall_score?: number | null
          created_at?: string
          updated_at?: string
          completed_at?: string | null
        }
        Update: {
          user_id?: string
          role?: string
          level?: string
          interview_type?: string
          question_count?: number
          status?: SupabaseInterviewRow['status']
          overall_score?: number | null
          completed_at?: string | null
          updated_at?: string
        }
      }
      interview_questions: {
        Row: SupabaseInterviewQuestionRow
        Insert: {
          id?: string
          interview_id: string
          position: number
          topic: string
          difficulty: string
          question: string
          expected_concepts?: string[]
          created_at?: string
        }
        Update: {
          interview_id?: string
          position?: number
          topic?: string
          difficulty?: string
          question?: string
          expected_concepts?: string[]
        }
      }
      answers: {
        Row: SupabaseAnswerRow
        Insert: {
          id?: string
          interview_question_id: string
          response_text: string
          submitted_at?: string
        }
        Update: {
          interview_question_id?: string
          response_text?: string
          submitted_at?: string
        }
      }
      evaluations: {
        Row: SupabaseEvaluationRow
        Insert: {
          id?: string
          answer_id: string
          score: number
          strengths?: string[]
          weaknesses?: string[]
          missing_concepts?: string[]
          improved_answer: string
          confidence_level: SupabaseEvaluationRow['confidence_level']
          evaluated_at?: string
        }
        Update: {
          answer_id?: string
          score?: number
          strengths?: string[]
          weaknesses?: string[]
          missing_concepts?: string[]
          improved_answer?: string
          confidence_level?: SupabaseEvaluationRow['confidence_level']
          evaluated_at?: string
        }
      }
      final_reports: {
        Row: SupabaseFinalReportRow
        Insert: {
          id?: string
          interview_id: string
          user_id: string
          overall_score: number
          strengths_summary?: string[]
          weaknesses_summary?: string[]
          missing_concepts?: string[]
          recommended_topics?: string[]
          learning_roadmap: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          interview_id?: string
          user_id?: string
          overall_score?: number
          strengths_summary?: string[]
          weaknesses_summary?: string[]
          missing_concepts?: string[]
          recommended_topics?: string[]
          learning_roadmap?: string
          updated_at?: string
        }
      }
    }
  }
}
