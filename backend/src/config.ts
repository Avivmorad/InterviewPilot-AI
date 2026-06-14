import 'dotenv/config'

function readPort(value: string | undefined): number {
  const port = Number(value ?? 3001)

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be a valid TCP port.')
  }

  return port
}

export const config = {
  port: readPort(process.env.PORT),
  clientOrigin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
}
