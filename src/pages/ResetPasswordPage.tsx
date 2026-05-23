import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { FormEvent } from 'react'

const MIN_PASSWORD_LENGTH = 8
const MAX_PASSWORD_LENGTH = 64

export function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState('')
  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
  })

  const validateFields = () => {
    const nextErrors = {
      password: '',
      confirmPassword: '',
    }

    if (!password) {
      nextErrors.password = '请输入新的密码。'
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
    return !nextErrors.password && !nextErrors.confirmPassword
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!validateFields()) {
      setStatus('')
      return
    }

    setIsSubmitting(true)
    setStatus('')

    window.setTimeout(() => {
      setIsSubmitting(false)
      setStatus('密码已更新。你现在可以使用新密码登录。')
    }, 900)
  }

  return (
    <main className="login-page">
      <div className="login-page__glow login-page__glow--one" aria-hidden="true" />
      <div className="login-page__glow login-page__glow--two" aria-hidden="true" />
      <div className="login-shell">
        <section className="login-form-panel" aria-labelledby="reset-title">
          <div className="login-form-panel__header">
            <p className="login-form-panel__eyebrow">设置新密码</p>
            <h2 id="reset-title">重置密码</h2>
            <p>请设置一个新的密码，确保它足够安全，方便你后续登录。</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <label className="login-field">
              <span>新密码</span>
              <input
                type="password"
                name="password"
                autoComplete="new-password"
                placeholder="至少 8 个字符"
                value={password}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? 'reset-password-error' : undefined}
                onChange={(event) => {
                  setPassword(event.target.value)
                  if (errors.password) {
                    setErrors((previous) => ({ ...previous, password: '' }))
                  }
                }}
              />
              {errors.password ? (
                <span id="reset-password-error" className="login-field__error">
                  {errors.password}
                </span>
              ) : null}
            </label>

            <label className="login-field">
              <span>确认新密码</span>
              <input
                type="password"
                name="confirmPassword"
                autoComplete="new-password"
                placeholder="再次输入新密码"
                value={confirmPassword}
                aria-invalid={Boolean(errors.confirmPassword)}
                aria-describedby={errors.confirmPassword ? 'reset-confirm-password-error' : undefined}
                onChange={(event) => {
                  setConfirmPassword(event.target.value)
                  if (errors.confirmPassword) {
                    setErrors((previous) => ({ ...previous, confirmPassword: '' }))
                  }
                }}
              />
              {errors.confirmPassword ? (
                <span id="reset-confirm-password-error" className="login-field__error">
                  {errors.confirmPassword}
                </span>
              ) : null}
            </label>

            <button type="submit" className="login-submit" disabled={isSubmitting}>
              {isSubmitting ? '保存中…' : '更新密码'}
            </button>

            <p className="login-status" aria-live="polite">
              {status || '完成密码更新后，你可以直接返回登录页使用新密码。'}
            </p>

            <p className="login-link-row">
              <Link to="/login" className="login-link">
                返回登录
              </Link>
            </p>
          </form>
        </section>
      </div>
    </main>
  )
}
