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

export const config = {
  port: readPort(process.env.PORT),
  clientOrigins: readClientOrigins(process.env.CLIENT_ORIGIN),
}
