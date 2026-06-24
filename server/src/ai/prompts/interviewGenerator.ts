import {
  getLevelLabel,
  getRoleLabel,
  type CreateInterviewRequest,
  type Level,
  type Role,
} from '../../types/interviewTypes.js'

export function buildInterviewGeneratorPrompt({
  role,
  level,
  interviewType,
  questionCount,
}: CreateInterviewRequest): string {
  const difficulty = level
  const roleLabel = getRoleLabel(role)
  const levelLabel = getLevelLabel(level)
  const interviewTypeGuidance = {
    Technical:
      'Generate only technical interview questions focused on role-specific knowledge, practical problem solving, architecture, debugging, and tradeoffs.',
    Behavioral:
      'Generate only behavioral interview questions focused on communication, ownership, collaboration, conflict handling, learning, and decision making in engineering work.',
    Mixed:
      'Generate a balanced mix of technical and behavioral questions. Include at least one behavioral question and at least one technical question.',
  }[interviewType]
  const roleGuidance = getRoleGuidance(role, level)
  const levelGuidance = getLevelGuidance(level)

  return `You are a professional technical interviewer.

Generate exactly ${questionCount} ${interviewType.toLowerCase()} interview questions for a ${levelLabel} ${roleLabel}.

Requirements:
- Match the selected role and ${levelLabel} difficulty closely.
- Interview type: ${interviewType}.
- ${interviewTypeGuidance}
- Level guidance: ${levelGuidance}
- Role guidance: ${roleGuidance}
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

function getLevelGuidance(level: Level): string {
  if (level === 'intern') {
    return [
      'Focus on fundamentals, core terminology, simple practical scenarios, coursework or personal projects, communication, curiosity, learning ability, and basic debugging.',
      'Avoid senior-level expectations such as advanced system design, distributed architecture, organizational leadership, and complex production incident ownership.',
    ].join(' ')
  }

  if (level === 'junior') {
    return 'Focus on role fundamentals, small features, debugging, clear explanations, and practical implementation choices.'
  }

  if (level === 'mid-level') {
    return 'Focus on production implementation, tradeoffs, testing, reliability, collaboration, and independent ownership.'
  }

  return 'Focus on architecture, technical tradeoffs, mentoring, reliability, scaling, governance, and business impact.'
}

function getRoleGuidance(role: Role, level: Level): string {
  if (role === 'generative-ai-engineer') {
    const levelSpecificGuidance = {
      intern:
        'For Intern, cover basic LLM understanding, prompt-writing fundamentals, calling an AI API, parsing structured responses, simple hallucination explanations, basic RAG concepts, small personal or academic AI projects, basic error handling, and responsible AI awareness.',
      junior:
        'For Junior, cover small LLM applications, prompt templates, structured outputs, validation, basic RAG pipelines, embeddings, provider APIs, retries, rate limits, and simple evaluation cases.',
      'mid-level':
        'For Mid-Level, cover production architecture, evaluation pipelines, provider abstraction, observability, cost and latency, prompt versioning, RAG quality, failure handling, security, and testing strategies.',
      senior:
        'For Senior, cover system architecture, technical tradeoffs, reliability, evaluation strategy, model and provider selection, scaling, governance, safety, team standards, architecture leadership, and business impact.',
    } satisfies Record<Level, string>

    return [
      'Keep this role focused on LLM application engineering, prompt engineering, structured outputs, JSON schema validation, model APIs, context windows, tokens, generation settings, hallucinations, grounding, embeddings, vector search, RAG, tool or function calling, basic AI agents, evaluation datasets, prompt regression testing, provider fallback, retries, rate limits, safety, guardrails, cost, latency, logging, observability, and production reliability.',
      levelSpecificGuidance[level],
    ].join(' ')
  }

  if (role === 'ai-engineer') {
    return 'Keep AI Engineer broader than Generative AI Engineer, including machine learning fundamentals, data pipelines, model training or inference, deployment, feature engineering, MLOps, and general production AI systems.'
  }

  return 'Focus on the practical engineering skills, tools, tradeoffs, collaboration patterns, and problem-solving expectations for the selected role.'
}
