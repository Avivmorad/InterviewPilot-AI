export type StructuredLogEvent = {
  event: string
  [key: string]: unknown
}

export function logStructuredEvent(event: StructuredLogEvent): void {
  if (process.env.NODE_ENV === 'test') {
    return
  }

  console.info(JSON.stringify(event))
}