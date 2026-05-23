import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { FormEvent } from 'react'
import { ApiError } from '../lib/api/types'
import { register } from '../lib/auth/authApi'

const emailRule = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const usernameRule = /^[A-Za-z0-9_\u4e00-\u9fff-]{2,20}$/
const MAX_EMAIL_LENGTH = 254
const MIN_PASSWORD_LENGTH = 8
const MAX_PASSWORD_LENGTH = 64
type StatusTone = 'success' | 'warning'

export function RegisterPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agree, setAgree] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState('')
  const [statusTone, setStatusTone] = useState<StatusTone>('success')
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const validateFields = () => {
    const nextErrors = {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    }

    if (!username.trim()) {
      nextErrors.username = '请输入你的用户名。'
    } else if (username.trim().length < 2 || username.trim().length > 20) {
      nextErrors.username = '用户名长度需为 2-20 个字符。'
    } else if (!usernameRule.test(username.trim())) {
      nextErrors.username = '用户名只能包含字母、数字、中划线、下划线或中文。'
    }

    if (!email.trim()) {
      nextErrors.email = '请输入邮箱地址。'
    } else if (email.trim().length > MAX_EMAIL_LENGTH) {
      nextErrors.email = '邮箱长度不能超过 254 个字符。'
    } else if (!emailRule.test(email.trim())) {
      nextErrors.email = '邮箱格式不正确，请输入如 name@company.com 的地址。'
    }

    if (!password) {
      nextErrors.password = '请输入密码。'
    } else if (password.length < MIN_PASSWORD_LENGTH) {
      nextErrors.password = '密码至少需要 8 个字符。'
    } else if (password.length > MAX_PASSWORD_LENGTH) {
      nextErrors.password = '密码不能超过 64 个字符。'
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = '请再次输入密码。'
    } else if (confirmPassword !== password) {
      nextErrors.confirmPassword = '两次输入的密码不一致。'
    }

    setErrors(nextErrors)
    return !nextErrors.username && !nextErrors.email && !nextErrors.password && !nextErrors.confirmPassword
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!agree) {
      setStatus('请先同意服务条款后再继续。')
      setStatusTone('warning')
      return
    }

    const isValid = validateFields()

    if (!isValid) {
      setStatus('')
      return
    }

    setIsSubmitting(true)
    setStatus('')

    try {
      const response = await register({
        username: username.trim(),
        email: email.trim(),
        password,
      })
      setStatusTone('success')
      setStatus(response.message)
    } catch (error) {
      if (error instanceof ApiError && error.code === 'EMAIL_ALREADY_EXISTS') {
        setStatusTone('warning')
        setStatus(error.message)
      } else if (error instanceof ApiError) {
        setStatusTone('warning')
        setStatus(error.message)
      } else {
        setStatusTone('warning')
        setStatus('注册失败，请稍后重试。')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="login-page">
      <div className="login-page__glow login-page__glow--one" aria-hidden="true" />
      <div className="login-page__glow login-page__glow--two" aria-hidden="true" />
      <div className="login-shell">
        <section className="login-form-panel" aria-labelledby="register-title">
          <div className="login-form-panel__header">
            <p className="login-form-panel__eyebrow">创建账户</p>
            <h2 id="register-title">注册新账号</h2>
            <p>建立你的学习档案，开启更高效的专注体验。</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <label className="login-field">
              <span>用户名</span>
              <input
                type="text"
                name="username"
                placeholder="输入你的用户名"
                value={username}
                aria-invalid={Boolean(errors.username)}
                aria-describedby={errors.username ? 'register-username-error' : undefined}
                onChange={(event) => {
                  setUsername(event.target.value)
                  if (errors.username) {
                    setErrors((previous) => ({ ...previous, username: '' }))
                  }
                }}
              />
              {errors.username ? (
                <span id="register-username-error" className="login-field__error">
                  {errors.username}
                </span>
              ) : null}
            </label>

            <label className="login-field">
              <span>邮箱</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="name@company.com"
                value={email}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'register-email-error' : undefined}
                onChange={(event) => {
                  setEmail(event.target.value)
                  if (errors.email) {
                    setErrors((previous) => ({ ...previous, email: '' }))
                  }
                }}
              />
              {errors.email ? (
                <span id="register-email-error" className="login-field__error">
                  {errors.email}
                </span>
              ) : null}
            </label>

            <label className="login-field">
              <span>密码</span>
              <input
                type="password"
                name="password"
                autoComplete="new-password"
                placeholder="至少 8 个字符"
                value={password}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? 'register-password-error' : undefined}
                onChange={(event) => {
                  setPassword(event.target.value)
                  if (errors.password) {
                    setErrors((previous) => ({ ...previous, password: '' }))
                  }
                }}
              />
              {errors.password ? (
                <span id="register-password-error" className="login-field__error">
                  {errors.password}
                </span>
              ) : null}
            </label>

            <label className="login-field">
              <span>确认密码</span>
              <input
                type="password"
                name="confirmPassword"
                autoComplete="new-password"
                placeholder="再次输入密码"
                value={confirmPassword}
                aria-invalid={Boolean(errors.confirmPassword)}
                aria-describedby={errors.confirmPassword ? 'register-confirm-password-error' : undefined}
                onChange={(event) => {
                  setConfirmPassword(event.target.value)
                  if (errors.confirmPassword) {
                    setErrors((previous) => ({ ...previous, confirmPassword: '' }))
                  }
                }}
              />
              {errors.confirmPassword ? (
                <span id="register-confirm-password-error" className="login-field__error">
                  {errors.confirmPassword}
                </span>
              ) : null}
            </label>

            <label className="login-checkbox">
              <input
                type="checkbox"
                checked={agree}
                onChange={(event) => setAgree(event.target.checked)}
              />
              <span>我已阅读并同意服务条款</span>
            </label>

            <button type="submit" className="login-submit" disabled={isSubmitting}>
              {isSubmitting ? '创建中…' : '创建账户'}
            </button>

            {status ? (
              <div
                className={`login-status-card ${statusTone === 'warning' ? 'login-status-card--warning' : ''}`}
                aria-live="polite"
              >
                <span className="login-status-card__label">
                  {statusTone === 'warning' ? '提示' : '还差一步'}
                </span>
                <p className="login-status">{status}</p>
              </div>
            ) : (
              <p className="login-status" aria-live="polite">
                账号创建完成后，你就可以立即开始学习。
              </p>
            )}

            <p className="login-link-row">
              <Link to="/login" className="login-link">
                已有账号？返回登录
              </Link>
            </p>
          </form>
        </section>
      </div>
    </main>
  )
}
