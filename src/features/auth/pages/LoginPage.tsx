import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { FormEvent } from 'react'
import { ApiError } from '../../../shared/api/types'
import { login } from '../api/authApi'
import { setAccessToken } from '../api/tokenStorage'
import { setUserInfo } from '../api/tokenStorage'
import { getLoginErrorContent } from '../api/authErrorContent'
import '../auth.css'

const emailRule = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type LoginErrorContent = ReturnType<typeof getLoginErrorContent>

function WeChatIcon() {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="login-icon"
    >
      <title>WeChat</title>
      <path
        fill="#07C160"
        d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.027-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z"
      />
    </svg>
  )
}

function AlipayIcon() {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="login-icon"
    >
      <title>Alipay</title>
      <path
        fill="#1677FF"
        d="M19.695 15.07c3.426 1.158 4.203 1.22 4.203 1.22V3.846c0-2.124-1.705-3.845-3.845-3.845H3.914C1.808.001.102 1.722.102 3.846v16.31c0 2.123 1.706 3.845 3.845 3.845h16.173c2.105 0 3.81-1.722 3.81-3.845v-.157s-6.19-2.602-9.315-4.119c-2.096 2.602-4.8 4.181-7.607 4.181-4.75 0-6.361-4.19-4.112-6.949.49-.602 1.324-1.175 2.617-1.497 2.025-.502 5.247.313 8.266 1.317a16.796 16.796 0 0 0 1.341-3.302H5.781v-.952h4.799V6.975H4.77v-.953h5.81V3.591s0-.409.411-.409h2.347v2.804h5.744v.951h-5.744v1.704h4.69a19.453 19.453 0 0 1-1.986 5.06c1.424.52 2.702 1.011 3.654 1.333m-13.81-2.032c-.596.06-1.71.325-2.321.869-1.83 1.608-.735 4.55 2.968 4.55 2.151 0 4.301-1.388 5.99-3.61-2.403-1.182-4.438-2.028-6.637-1.809"
      />
    </svg>
  )
}

function AlertIcon() {
  return (
    <svg
      className="login-error-modal__icon"
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

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState('')
  const [emailError, setEmailError] = useState('')
  const [loginError, setLoginError] = useState<LoginErrorContent | null>(null)

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

    if (!password) {
      setStatus('请输入密码。')
      return
    }

    setIsSubmitting(true)
    setStatus('')

    try {
      const response = await login({
        email: email.trim(),
        password,
        rememberMe: remember,
      })
      setAccessToken(response.accessToken, remember)
      setUserInfo({ username: response.user.username, email: response.user.email })
      navigate('/')
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.code === 'INVALID_CREDENTIALS' || error.status === 401) {
          setLoginError(getLoginErrorContent(error.code, error.message))
          setStatus('')
          return
        }
        setStatus(error.message)
      } else {
        setStatus('登录失败，请稍后重试。')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const closeLoginErrorDialog = () => {
    setLoginError(null)
  }

  const retryLogin = () => {
    setPassword('')
    setLoginError(null)
  }

  return (
    <main className="login-page">
      <div className="login-page__glow login-page__glow--one" aria-hidden="true" />
      <div className="login-page__glow login-page__glow--two" aria-hidden="true" />
      <div className="login-shell">
        <section className="login-form-panel" aria-labelledby="login-title">
          <div className="login-form-panel__header">
            <p className="login-form-panel__eyebrow">安全访问</p>
            <h2 id="login-title">欢迎回来</h2>
            <p>输入你的凭证，继续学习之旅。</p>
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
                aria-describedby={emailError ? 'email-error' : undefined}
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
                <span id="email-error" className="login-field__error">
                  {emailError}
                </span>
              ) : null}
            </label>

            <label className="login-field">
              <span>密码</span>
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>

            <div className="login-form__row">
              <label className="login-checkbox">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(event) => setRemember(event.target.checked)}
                />
                <span>记住我</span>
              </label>
              <Link to="/reset-password" className="login-link">
                忘记密码？
              </Link>
            </div>

            <button type="submit" className="login-submit" disabled={isSubmitting}>
              {isSubmitting ? '正在打开工作区…' : '登录'}
            </button>

            <div className="login-divider">
              <span>微信和支付宝</span>
            </div>

            <div className="login-socials">
              <button type="button" className="login-social-btn" aria-label="使用微信登录">
                <WeChatIcon />
              </button>
              <button type="button" className="login-social-btn" aria-label="使用支付宝登录">
                <AlipayIcon />
              </button>
            </div>

            <p className="login-status" aria-live="polite">
              {status}
            </p>

            <p className="login-link-row">
              <Link to="/resend-activation" className="login-link">
                未收到激活邮件？重新发送
              </Link>
              <Link to="/register" className="login-link">
                还没有账号？立即注册
              </Link>
            </p>
          </form>
        </section>
      </div>

      {loginError ? (
        <div className="login-error-modal-backdrop" onClick={closeLoginErrorDialog}>
          <div
            className="login-error-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-error-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="login-error-modal__close"
              aria-label="关闭登录失败提示"
              onClick={closeLoginErrorDialog}
            >
              ×
            </button>

            <div className="login-error-modal__icon-wrap" aria-hidden="true">
              <AlertIcon />
            </div>

            <p className="login-form-panel__eyebrow">{loginError.eyebrow}</p>
            <h2 id="login-error-title" className="login-error-modal__title">
              {loginError.title}
            </h2>

            <div className="login-status-card login-status-card--warning login-error-modal__body">
              <span className="login-status-card__label">错误详情</span>
              <p className="login-status login-error-modal__message">{loginError.message}</p>
            </div>

            <ul className="login-error-modal__hints">
              {loginError.hints.map((hint) => (
                <li key={hint}>{hint}</li>
              ))}
            </ul>

            <div className="login-error-modal__actions">
              <button type="button" className="login-submit" onClick={retryLogin}>
                返回重新登录
              </button>
              <div className="login-error-modal__secondary">
                <Link to="/reset-password" className="login-link">
                  忘记密码？去重置
                </Link>
                <Link to="/register" className="login-link">
                  还没有账号？立即注册
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  )
}
