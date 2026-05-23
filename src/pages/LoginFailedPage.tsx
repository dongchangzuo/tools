import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import type { ApiErrorCode } from '../lib/api/types'
import { getLoginErrorContent } from '../lib/auth/authErrorContent'

export type LoginFailedLocationState = {
  code?: ApiErrorCode
  message?: string
  email?: string
}

function AlertIcon() {
  return (
    <svg
      className="auth-error-page__icon"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function LoginFailedPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as LoginFailedLocationState | null

  if (!state?.code && !state?.message) {
    return <Navigate to="/login" replace />
  }

  const content = getLoginErrorContent(state.code, state.message)

  const retryLogin = () => {
    navigate('/login', { state: { email: state.email }, replace: true })
  }

  return (
    <main className="login-page auth-error-page">
      <div className="login-page__glow login-page__glow--one" aria-hidden="true" />
      <div className="login-page__glow login-page__glow--two" aria-hidden="true" />
      <div className="login-shell">
        <section className="login-form-panel auth-error-page__panel" aria-labelledby="login-failed-title">
          <div className="auth-error-page__icon-wrap" aria-hidden="true">
            <AlertIcon />
          </div>

          <div className="login-form-panel__header">
            <p className="login-form-panel__eyebrow">{content.eyebrow}</p>
            <h2 id="login-failed-title">{content.title}</h2>
          </div>

          <div className="login-status-card login-status-card--warning auth-error-page__card" role="alert">
            <span className="login-status-card__label">错误详情</span>
            <p className="login-status auth-error-page__message">{content.message}</p>
          </div>

          <ul className="auth-error-page__hints">
            {content.hints.map((hint) => (
              <li key={hint}>{hint}</li>
            ))}
          </ul>

          <div className="auth-error-page__actions">
            <button type="button" className="login-submit" onClick={retryLogin}>
              返回重新登录
            </button>
            <Link to="/reset-password" className="login-link auth-error-page__secondary-link">
              忘记密码？去重置
            </Link>
            <Link to="/register" className="login-link auth-error-page__secondary-link">
              还没有账号？立即注册
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
