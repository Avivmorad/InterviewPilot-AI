import type { CreateInterviewRequest } from '../../types/interviewTypes.js'

export function buildInterviewGeneratorPrompt({
  role,
  level,
  interviewType,
  questionCount,
}: CreateInterviewRequest): string {
  const difficulty = level.toLowerCase()
  const interviewTypeGuidance = {
    Technical:
      'Generate only technical interview questions focused on role-specific knowledge, practical problem solving, architecture, debugging, and tradeoffs.',
    Behavioral:
      'Generate only behavioral interview questions focused on communication, ownership, collaboration, conflict handling, learning, and decision making in engineering work.',
    Mixed:
      'Generate a balanced mix of technical and behavioral questions. Include at least one behavioral question and at least one technical question.',
  }[interviewType]

  return `You are a professional technical interviewer.

Generate exactly ${questionCount} ${interviewType.toLowerCase()} interview questions for a ${level} ${role}.

Requirements:
- Match the selected role and ${level} difficulty closely.
- Interview type: ${interviewType}.
- ${interviewTypeGuidance}
- Keep each question clear, specific, and answerable in an interview.
- Write all question content and expected concepts in English.
- List 2 to 5 concise expected concepts for each question.
- Use the difficulty value "${difficulty}" for every question.
- Do not include question IDs. The API assigns them after validating the response.
- Return strict JSON only. Do not include markdown, code fences, or commentary.

Return this exact JSON shape:
{
  "questions": [
    {
      "topic": "React",
      "difficulty": "${difficulty}",
      "question": "Question text",
      "expectedConcepts": ["Concept one", "Concept two"]
    }
  ]
}

The questions array must contain exactly ${questionCount} items.`
}
