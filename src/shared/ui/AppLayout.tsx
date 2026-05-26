import { Outlet, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { SettingsDropdown } from './SettingsDropdown'
import { clearAccessToken, clearUserInfo, getAccessToken } from '../../features/auth/api/tokenStorage'

export function AppLayout() {
  const navigate = useNavigate()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const isLoggedIn = Boolean(getAccessToken())

  const handleLogout = () => {
    clearAccessToken()
    clearUserInfo()
    navigate('/')
  }

  return (
    <div className="site">
      <header className="site-header">
        <nav className="site-nav" aria-label="站点导航">
          <div className="site-nav__tools">
            <div className="site-nav__tools-group">
              <button
                type="button"
                className="site-nav__icon-btn"
                onClick={() => setSettingsOpen((o) => !o)}
                aria-label="设置"
                aria-expanded={settingsOpen}
                title="设置"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </button>
              <SettingsDropdown
                open={settingsOpen}
                onClose={() => setSettingsOpen(false)}
              />
            </div>

            {isLoggedIn && (
              <button
                type="button"
                className="site-nav__icon-btn"
                onClick={handleLogout}
                aria-label="退出登录"
                title="退出登录"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            )}
          </div>
        </nav>
      </header>
      <Outlet />
    </div>
  )
}
