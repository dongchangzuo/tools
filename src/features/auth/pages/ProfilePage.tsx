import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getMe } from '../api/authApi'
import {
  clearAccessToken,
  clearUserInfo,
  getAccessToken,
  setUserInfo,
} from '../api/tokenStorage'
import { ApiError, type User } from '../../../shared/api/types'
import '../profile.css'

type LoadState = 'loading' | 'ready' | 'error'

export function ProfilePage() {
  const navigate = useNavigate()
  const [loadState, setLoadState] = useState<LoadState>('loading')
  const [user, setUser] = useState<User | null>(null)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!getAccessToken()) {
      navigate('/login', { replace: true })
      return
    }

    let cancelled = false

    const loadProfile = async () => {
      setLoadState('loading')
      setErrorMessage('')

      try {
        const response = await getMe()
        if (cancelled) return

        setUser(response.user)
        setUserInfo({
          username: response.user.username,
          email: response.user.email,
        })
        setLoadState('ready')
      } catch (error) {
        if (cancelled) return

        if (error instanceof ApiError && (error.status === 401 || error.code === 'UNAUTHORIZED')) {
          clearAccessToken()
          clearUserInfo()
          navigate('/login', { replace: true })
          return
        }

        setLoadState('error')
        setErrorMessage(
          error instanceof ApiError ? error.message : '加载个人资料失败，请稍后重试。',
        )
      }
    }

    void loadProfile()

    return () => {
      cancelled = true
    }
  }, [navigate])

  return (
    <main className="profile-page">
      <div className="profile-page__inner">
        {loadState === 'loading' && (
          <p className="profile-page__status" aria-live="polite">
            正在加载个人资料…
          </p>
        )}

        {loadState === 'error' && (
          <div className="profile-card profile-card--error" role="alert">
            <h1 className="profile-card__title">无法加载资料</h1>
            <p className="profile-card__message">{errorMessage}</p>
            <Link to="/" className="profile-card__link">
              返回首页
            </Link>
          </div>
        )}

        {loadState === 'ready' && user && (
          <section className="profile-card" aria-labelledby="profile-title">
            <header className="profile-card__header">
              <div className="profile-card__avatar" aria-hidden="true">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="profile-card__eyebrow">账户</p>
                <h1 id="profile-title" className="profile-card__title">
                  个人资料
                </h1>
              </div>
            </header>

            <dl className="profile-fields">
              <div className="profile-field">
                <dt>用户名</dt>
                <dd>{user.username}</dd>
              </div>
              <div className="profile-field">
                <dt>邮箱</dt>
                <dd>{user.email}</dd>
              </div>
              <div className="profile-field profile-field--muted">
                <dt>用户 ID</dt>
                <dd>{user.id}</dd>
              </div>
            </dl>
          </section>
        )}
      </div>
    </main>
  )
}
