export type ApiErrorCode =
  | 'EMAIL_ALREADY_EXISTS'
  | 'EMAIL_NOT_VERIFIED'
  | 'INVALID_CREDENTIALS'
  | 'VALIDATION_ERROR'
  | 'INVALID_RESET_CODE'
  | 'RESET_CODE_EXPIRED'
  | 'RESET_CODE_NOT_FOUND'
  | 'INVALID_RESET_TOKEN'
  | 'INVALID_ACTIVATION_CODE'
  | 'ACTIVATION_CODE_EXPIRED'
  | 'ACTIVATION_CODE_NOT_FOUND'
  | 'UNAUTHORIZED'

export type ApiErrorBody = {
  code: ApiErrorCode
  message: string
}

export class ApiError extends Error {
  readonly status: number
  readonly code: ApiErrorCode

  constructor(status: number, code: ApiErrorCode, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

export type User = {
  id: string
  username: string
  email: string
}

export type RegisterResponse = {
  message: string
  user: User
}

export type AuthResponse = {
  accessToken: string
  tokenType: string
  expiresIn: number
  user: User
}

export type MessageResponse = {
  message: string
}

export type VerifyResetCodeResponse = {
  resetToken: string
  expiresIn: number
}

export type MeResponse = {
  user: User
}
