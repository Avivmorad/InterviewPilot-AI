export function normalizeFeedbackText(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^[\s>*-]+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .trim()
}

export function splitFeedbackParagraphs(text: string): string[] {
  return normalizeFeedbackText(text)
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
}

export function normalizeFeedbackItems(items: string[]): string[] {
  return items
    .map((item) => normalizeFeedbackText(item))
    .filter((item) => item.length > 0)
}
