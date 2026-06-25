import { randomUUID } from 'node:crypto'

import type { NextFunction, Request, RequestHandler, Response } from 'express'

import { logStructuredEvent } from '../observability/structuredLog.js'

type RateLimitEntry = {
  count: number
  resetAt: number
}

export type RateLimitOptions = {
  windowMs?: number
  maxRequests?: number
}

const defaultRateLimitOptions: Required<RateLimitOptions> = {
  windowMs: 60_000,
  maxRequests: 20,
}

function getClientKey(request: Request): string {
  const forwardedFor = request.get('x-forwarded-for')
  const firstForwardedAddress = forwardedFor?.split(',')[0]?.trim()
  return firstForwardedAddress ?? request.ip ?? 'unknown-client'
}

function getRequestPath(request: Request): string {
  return request.baseUrl || request.path || request.originalUrl
}

export function createRequestContextMiddleware(): RequestHandler {
  return (request, response, next) => {
    const headerRequestId = request.get('x-request-id')?.trim()
    const requestId = headerRequestId?.length ? headerRequestId : randomUUID()
    const startedAt = Date.now()

    response.setHeader('x-request-id', requestId)

    response.on('finish', () => {
      logStructuredEvent({
        event: 'http_request',
        requestId,
        method: request.method,
        path: request.originalUrl,
        statusCode: response.statusCode,
        durationMs: Date.now() - startedAt,
        ip: getClientKey(request),
      })
    })

    next()
  }
}

export function createInterviewRateLimitMiddleware(
  options: RateLimitOptions = {},
): RequestHandler {
  const windowMs = options.windowMs ?? defaultRateLimitOptions.windowMs
  const maxRequests = options.maxRequests ?? defaultRateLimitOptions.maxRequests
  const entries = new Map<string, RateLimitEntry>()

  return (request, response, next) => {
    if (request.method === 'OPTIONS') {
      next()
      return
    }

    const now = Date.now()
    const clientKey = `${getClientKey(request)}:${getRequestPath(request)}`
    const currentEntry = entries.get(clientKey)

    if (!currentEntry || currentEntry.resetAt <= now) {
      entries.set(clientKey, {
        count: 1,
        resetAt: now + windowMs,
      })
      next()
      return
    }

    if (currentEntry.count >= maxRequests) {
      const retryAfterSeconds = Math.max(
        1,
        Math.ceil((currentEntry.resetAt - now) / 1000),
      )
      response.setHeader('Retry-After', retryAfterSeconds.toString())
      response.status(429).json({
        error: 'Too many interview requests. Please try again later.',
        code: 'RATE_LIMITED',
      })
      return
    }

    currentEntry.count += 1
    next()
  }
}
