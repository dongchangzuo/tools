import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import type { FormEvent } from 'react'
import { ApiError } from '../../../shared/api/types'
import { resendActivationCode } from '../api/authApi'
import '../auth.css'

const emailRule = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function ResendActivationPage() {
  const [searchParams] = useSearchParams()
  const [email, setEmail] = useState(() => searchParams.get('email') ?? '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState('')
  const [emailError, setEmailError] = useState('')

  const validateEmail = (value: string) => {
    if (!value.trim()) {
      return '请输入邮箱地址。'
    }

    if (!emailRule.test(value.trim())) {
      return '邮箱格式不正确，请输入如 name@company.com 的地址。'
    }

    return ''
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextEmailError = validateEmail(email)
    setEmailError(nextEmailError)

    if (nextEmailError) {
      setStatus('')
      return
    }

    setIsSubmitting(true)
    setStatus('')

    try {
      const response = await resendActivationCode({ email: email.trim() })
      setStatus(response.message)
    } catch (error) {
      if (error instanceof ApiError) {
        setStatus(error.message)
      } else {
        setStatus('发送失败，请稍后重试。')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="login-page activation-flow-page">
      <div className="login-page__glow login-page__glow--one" aria-hidden="true" />
      <div className="login-page__glow login-page__glow--two" aria-hidden="true" />
      <div className="login-shell activation-flow-page__shell">
        <section
          className="login-form-panel activation-flow-panel"
          aria-labelledby="resend-activation-title"
        >
          <div className="login-form-panel__header">
            <p className="login-form-panel__eyebrow activation-flow-panel__eyebrow">账户激活</p>
            <h2 id="resend-activation-title">重新发送激活邮件</h2>
            <p>输入注册邮箱，我们会重新发送激活链接。</p>
          </div>

          <form className="login-form activation-resend-form" onSubmit={handleSubmit} noValidate>
            <label className="login-field">
              <span>邮箱</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="name@company.com"
                value={email}
                aria-invalid={Boolean(emailError)}
                aria-describedby={emailError ? 'resend-email-error' : undefined}
                onBlur={() => setEmailError(validateEmail(email))}
                onChange={(event) => {
                  setEmail(event.target.value)
                  if (emailError) {
                    setEmailError(validateEmail(event.target.value))
                  }
                }}
                required
              />
              {emailError ? (
                <span id="resend-email-error" className="login-field__error">
                  {emailError}
                </span>
              ) : null}
            </label>

            <button type="submit" className="login-submit activation-resend-form__submit" disabled={isSubmitting}>
              {isSubmitting ? '发送中…' : '发送激活邮件'}
            </button>

            {status ? (
              <div className="activation-card" aria-live="polite">
                <p className="activation-card__message">{status}</p>
              </div>
            ) : (
              <p className="activation-resend-form__hint">
                如果该邮箱已注册且尚未激活，我们会向您的邮箱发送新的激活链接。
              </p>
            )}

            <p className="login-link-row">
              <Link to="/login" className="login-link">
                返回登录
              </Link>
              <Link to="/register" className="login-link">
                还没有账号？立即注册
              </Link>
            </p>
          </form>
        </section>
      </div>
    </main>
  )
}
