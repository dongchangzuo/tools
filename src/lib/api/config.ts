/** Default backend origin when no Vite env is set (dev / preview / production build). */
export const DEFAULT_API_HOST = 'http://localhost:8000'
export const DEFAULT_API_PATH = '/api/v1'

/**
 * API base URL resolution:
 *
 * 1. VITE_API_BASE_URL — full base, e.g. http://localhost:8000/api/v1
 * 2. VITE_API_HOST + VITE_API_PATH
 * 3. Default — http://localhost:8000/api/v1 (direct to backend, not the frontend origin)
 */
function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '')
}

function ensureLeadingSlash(value: string): string {
  return value.startsWith('/') ? value : `/${value}`
}

function joinUrl(host: string, path: string): string {
  return `${trimTrailingSlash(host)}${ensureLeadingSlash(path)}`
}

export function resolveApiBaseUrl(): string {
  const explicit = import.meta.env.VITE_API_BASE_URL?.trim()
  if (explicit) {
    return explicit
  }

  const host = import.meta.env.VITE_API_HOST?.trim() || DEFAULT_API_HOST
  const path = import.meta.env.VITE_API_PATH?.trim() || DEFAULT_API_PATH
  return joinUrl(host, path)
}

export const API_BASE_URL = resolveApiBaseUrl()
