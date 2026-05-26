const ACCESS_TOKEN_KEY = 'tools.accessToken'
const USER_INFO_KEY = 'tools.userInfo'

export function setAccessToken(token: string, remember: boolean) {
  clearAccessToken()
  const storage = remember ? localStorage : sessionStorage
  storage.setItem(ACCESS_TOKEN_KEY, token)
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY) ?? sessionStorage.getItem(ACCESS_TOKEN_KEY)
}

export function clearAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  sessionStorage.removeItem(ACCESS_TOKEN_KEY)
}

export type UserInfo = { username: string; email: string }

export function setUserInfo(info: UserInfo) {
  try { localStorage.setItem(USER_INFO_KEY, JSON.stringify(info)) } catch { /* noop */ }
}

export function getUserInfo(): UserInfo | null {
  try {
    const raw = localStorage.getItem(USER_INFO_KEY)
    if (!raw) return null
    return JSON.parse(raw) as UserInfo
  } catch { return null }
}

export function clearUserInfo() {
  localStorage.removeItem(USER_INFO_KEY)
}

const RESET_TOKEN_KEY = 'tools.resetToken'
const RESET_EMAIL_KEY = 'tools.resetEmail'

export function setResetSession(resetToken: string, email: string) {
  sessionStorage.setItem(RESET_TOKEN_KEY, resetToken)
  sessionStorage.setItem(RESET_EMAIL_KEY, email)
}

export function getResetToken(): string | null {
  return sessionStorage.getItem(RESET_TOKEN_KEY)
}

export function getResetEmail(): string | null {
  return sessionStorage.getItem(RESET_EMAIL_KEY)
}

export function clearResetSession() {
  sessionStorage.removeItem(RESET_TOKEN_KEY)
  sessionStorage.removeItem(RESET_EMAIL_KEY)
}
