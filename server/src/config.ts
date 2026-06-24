import 'dotenv/config'

function readPort(value: string | undefined): number {
  const port = Number(value ?? 3001)

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be a valid TCP port.')
  }

  return port
}

function readClientOrigins(value: string | undefined): string[] {
  const origins = (value ?? 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)

  if (origins.length === 0) {
    throw new Error('CLIENT_ORIGIN must include at least one allowed origin.')
  }

  return origins
}

function isLocalViteOrigin(origin: string): boolean {
  if (process.env.NODE_ENV === 'production') {
    return false
  }

  try {
    const url = new URL(origin)
    const port = Number(url.port)
    const isLocalHost = url.hostname === 'localhost' || url.hostname === '127.0.0.1'

    return url.protocol === 'http:' && isLocalHost && port >= 5173 && port <= 5179
  } catch {
    return false
  }
}

export const config = {
  port: readPort(process.env.PORT),
  clientOrigins: readClientOrigins(process.env.CLIENT_ORIGIN),
}

export function isAllowedClientOrigin(origin: string | undefined): boolean {
  return (
    !origin ||
    config.clientOrigins.includes(origin) ||
    isLocalViteOrigin(origin)
  )
}
