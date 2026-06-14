import type { CreateInterviewRequest } from '../../types/interviewTypes.js'

export function buildInterviewGeneratorPrompt({
  role,
  level,
  questionCount,
}: CreateInterviewRequest): string {
  const difficulty = level.toLowerCase()

  return `You are a professional technical interviewer.

Generate exactly ${questionCount} interview questions for a ${level} ${role}.

Requirements:
- Match the selected role and ${level} difficulty closely.
- Prioritize technical questions relevant to the role.
- Include at most one behavioral question when it is useful for this role and level.
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
