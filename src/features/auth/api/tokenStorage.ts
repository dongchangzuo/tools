const ACCESS_TOKEN_KEY = 'tools.accessToken'
const USER_INFO_KEY = 'tools.userInfo'

type AuthListener = () => void
const authListeners = new Set<AuthListener>()

function emitAuthChange() {
  authListeners.forEach((listener) => listener())
}

export function subscribeAuth(listener: AuthListener): () => void {
  authListeners.add(listener)
  return () => {
    authListeners.delete(listener)
  }
}

export type AuthSnapshot = {
  accessToken: string | null
  userInfo: UserInfo | null
}

const emptyAuthSnapshot: AuthSnapshot = { accessToken: null, userInfo: null }
let cachedAuthSnapshot: AuthSnapshot = emptyAuthSnapshot

function userInfoEquals(left: UserInfo | null, right: UserInfo | null) {
  if (left === right) return true
  if (!left || !right) return false
  return left.username === right.username && left.email === right.email
}

export function getAuthSnapshot(): AuthSnapshot {
  const accessToken = getAccessToken()
  const userInfo = getUserInfo()

  if (
    cachedAuthSnapshot.accessToken === accessToken
    && userInfoEquals(cachedAuthSnapshot.userInfo, userInfo)
  ) {
    return cachedAuthSnapshot
  }

  cachedAuthSnapshot = { accessToken, userInfo }
  return cachedAuthSnapshot
}

export function getServerAuthSnapshot(): AuthSnapshot {
  return emptyAuthSnapshot
}

function clearAccessTokenStorage() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  sessionStorage.removeItem(ACCESS_TOKEN_KEY)
}

export function setAccessToken(token: string, remember: boolean) {
  clearAccessTokenStorage()
  const storage = remember ? localStorage : sessionStorage
  storage.setItem(ACCESS_TOKEN_KEY, token)
  emitAuthChange()
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY) ?? sessionStorage.getItem(ACCESS_TOKEN_KEY)
}

export function clearAccessToken() {
  clearAccessTokenStorage()
  emitAuthChange()
}

export type UserInfo = { username: string; email: string }

export function setUserInfo(info: UserInfo) {
  try {
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(info))
    emitAuthChange()
  } catch { /* noop */ }
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
  emitAuthChange()
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
