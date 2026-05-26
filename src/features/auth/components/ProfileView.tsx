import type { User } from '../../../shared/api/types'
import type { ProfileLoadState } from '../hooks/useProfileData'
import '../profile.css'

type ProfileViewProps = {
  loadState: ProfileLoadState
  user: User | null
  errorMessage: string
  onRetry?: () => void
}

export function ProfileView({ loadState, user, errorMessage, onRetry }: ProfileViewProps) {
  if (loadState === 'idle' || loadState === 'loading') {
    return (
      <p className="profile-view__status" aria-live="polite">
        正在加载个人资料…
      </p>
    )
  }

  if (loadState === 'error') {
    return (
      <div className="profile-card profile-card--error" role="alert">
        <h2 className="profile-card__title">无法加载资料</h2>
        <p className="profile-card__message">{errorMessage}</p>
        {onRetry ? (
          <button type="button" className="profile-card__link" onClick={onRetry}>
            重试
          </button>
        ) : null}
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <section className="profile-card" aria-labelledby="profile-title">
      <header className="profile-card__header">
        <div className="profile-card__avatar" aria-hidden="true">
          {user.username.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="profile-card__eyebrow">账户</p>
          <h2 id="profile-title" className="profile-card__title">
            个人资料
          </h2>
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
  )
}
