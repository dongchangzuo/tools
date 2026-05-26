import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ProfileView } from '../components/ProfileView'
import { useProfileData } from '../hooks/useProfileData'
import { getAccessToken } from '../api/tokenStorage'
import '../profile.css'

export function ProfilePage() {
  const navigate = useNavigate()
  const { loadState, user, errorMessage, reload } = useProfileData(true)

  useEffect(() => {
    if (!getAccessToken()) {
      navigate('/login', { replace: true })
    }
  }, [navigate])

  return (
    <main className="profile-page">
      <div className="profile-page__inner">
        <ProfileView
          loadState={loadState}
          user={user}
          errorMessage={errorMessage}
          onRetry={reload}
        />
        <p className="profile-page__back">
          <Link to="/" className="profile-card__link profile-page__back-link">
            返回首页
          </Link>
        </p>
      </div>
    </main>
  )
}
