import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { FormEvent } from 'react'
import { ApiError } from '../../../shared/api/types'
import { forgotPassword, verifyResetCode } from '../api/authApi'
import { setResetSession } from '../api/tokenStorage'
import '../auth.css'

const emailRule = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const codeRule = /^\d{6}$/

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isVerifyingCode, setIsVerifyingCode] = useState(false)
  const [showCodeInput, setShowCodeInput] = useState(false)
  const [code, setCode] = useState('')
  const [status, setStatus] = useState('')
  const [emailError, setEmailError] = useState('')
  const [codeError, setCodeError] = useState('')

  const navigate = useNavigate()

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
      setShowCodeInput(false)
      return
    }

    setIsSubmitting(true)
    setStatus('')
    setCodeError('')

    try {
      const response = await forgotPassword({ email: email.trim() })
      setShowCodeInput(true)
      setCode('')
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

  const handleVerifyCode = async () => {
    if (!codeRule.test(code.trim())) {
      setCodeError('请输入 6 位数字验证码。')
      return
    }

    setIsVerifyingCode(true)
    setCodeError('')

    try {
      const response = await verifyResetCode({ email: email.trim(), code: code.trim() })
      setResetSession(response.resetToken, email.trim())
      navigate('/reset-password/confirm')
    } catch (error) {
      if (error instanceof ApiError) {
        setCodeError(error.message)
      } else {
        setCodeError('验证失败，请稍后重试。')
      }
    } finally {
      setIsVerifyingCode(false)
    }
  }

  return (
    <main className="login-page">
      <div className="login-page__glow login-page__glow--one" aria-hidden="true" />
      <div className="login-page__glow login-page__glow--two" aria-hidden="true" />
      <div className="login-shell">
        <section className="login-form-panel" aria-labelledby="reset-title">
          <div className="login-form-panel__header">
            <p className="login-form-panel__eyebrow">安全重置</p>
            <h2 id="reset-title">重置密码</h2>
            <p>输入你注册时使用的邮箱，我们会发送一封重置链接，帮助你继续学习之旅。</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <label className="login-field">
              <span>邮箱</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="name@company.com"
                value={email}
                aria-invalid={Boolean(emailError)}
                aria-describedby={emailError ? 'reset-email-error' : undefined}
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
                <span id="reset-email-error" className="login-field__error">
                  {emailError}
                </span>
              ) : null}
            </label>

            {showCodeInput ? (
              <div className="reset-code-card">
                <h3 className="reset-code-card__title">输入验证码</h3>
                <p className="reset-code-card__copy">
                  我们已向 {email} 发送了一封含验证码的邮件。
                </p>
                <label className="login-field reset-code-card__field">
                  <span>验证码</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    placeholder="123456"
                    value={code}
                    aria-invalid={Boolean(codeError)}
                    aria-describedby={codeError ? 'reset-code-error' : undefined}
                    onChange={(event) => {
                      setCode(event.target.value)
                      if (codeError) {
                        setCodeError('')
                      }
                    }}
                    required
                  />
                  {codeError ? (
                    <span id="reset-code-error" className="login-field__error">
                      {codeError}
                    </span>
                  ) : null}
                </label>
                <button
                  type="button"
                  className="login-submit reset-code-card__button"
                  onClick={handleVerifyCode}
                  disabled={isVerifyingCode}
                >
                  {isVerifyingCode ? '验证中…' : '验证'}
                </button>
              </div>
            ) : null}

            <button type="submit" className="login-submit" disabled={isSubmitting || showCodeInput}>
              {isSubmitting ? '发送中…' : '发送验证码'}
            </button>

            <p className="login-status" aria-live="polite">
              {status}
            </p>

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
