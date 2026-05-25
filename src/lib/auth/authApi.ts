import { apiGet, apiPost } from '../api/client'
import type {
  AuthResponse,
  MeResponse,
  MessageResponse,
  RegisterResponse,
  VerifyResetCodeResponse,
} from '../api/types'

export function register(payload: { username: string; email: string; password: string }) {
  return apiPost<RegisterResponse>('/auth/register', payload, { auth: false })
}

export function login(payload: { email: string; password: string; rememberMe?: boolean }) {
  return apiPost<AuthResponse>('/auth/login', payload, { auth: false })
}

export function verifyEmail(token: string) {
  return apiGet<MessageResponse>(`/auth/verify-email?token=${encodeURIComponent(token)}`, { auth: false })
}

export function resendActivationCode(payload: { email: string }) {
  return apiPost<MessageResponse>('/auth/resend-activation-code', payload, { auth: false })
}

export function forgotPassword(payload: { email: string }) {
  return apiPost<MessageResponse>('/auth/forgot-password', payload, { auth: false })
}

export function verifyResetCode(payload: { email: string; code: string }) {
  return apiPost<VerifyResetCodeResponse>('/auth/verify-reset-code', payload, { auth: false })
}

export function resetPassword(payload: { resetToken: string; password: string }) {
  return apiPost<MessageResponse>('/auth/reset-password', payload, { auth: false })
}

export function getMe() {
  return apiGet<MeResponse>('/auth/me')
}
