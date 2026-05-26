import { API_BASE_URL } from './config'
import { ApiError, type ApiErrorBody } from './types'
import { getAccessToken } from '../../features/auth/api/tokenStorage'

type RequestOptions = {
  auth?: boolean
}

async function parseError(response: Response): Promise<ApiError> {
  try {
    const body = (await response.json()) as ApiErrorBody
    if (body?.code && body?.message) {
      return new ApiError(response.status, body.code, body.message)
    }
  } catch {
    // fall through
  }
  return new ApiError(response.status, 'VALIDATION_ERROR', '请求失败，请稍后重试。')
}

export async function apiGet<T>(path: string, options: RequestOptions = {}): Promise<T> {
  return apiRequest<T>('GET', path, undefined, options)
}

export async function apiPost<T>(path: string, body: unknown, options: RequestOptions = {}): Promise<T> {
  return apiRequest<T>('POST', path, body, options)
}

async function apiRequest<T>(
  method: 'GET' | 'POST',
  path: string,
  body: unknown | undefined,
  options: RequestOptions,
): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  }

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  if (options.auth !== false) {
    const token = getAccessToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    mode: 'cors',
    credentials: 'omit',
  })

  if (!response.ok) {
    throw await parseError(response)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}
