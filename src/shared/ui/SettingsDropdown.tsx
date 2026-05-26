import { useCallback, useEffect, useRef, useState, type ReactElement } from 'react'
import { useNavigate } from 'react-router-dom'
import { THEMES, useTheme, type ThemeName } from './ThemeContext'
import {
  clearAccessToken,
  clearUserInfo,
  getAccessToken,
  getUserInfo,
} from '../../features/auth/api/tokenStorage'

function ThemeRealEstateIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 21h18" />
      <path d="M6 21V9l6-4 6 4v12" />
      <path d="M10 21v-6h4v6" />
    </svg>
  )
}

function ThemeWarmIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
    </svg>
  )
}

function ThemeTechIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <line x1="9" y1="1" x2="9" y2="4" />
      <line x1="15" y1="1" x2="15" y2="4" />
      <line x1="9" y1="20" x2="9" y2="23" />
      <line x1="15" y1="20" x2="15" y2="23" />
      <line x1="20" y1="9" x2="23" y2="9" />
      <line x1="20" y1="14" x2="23" y2="14" />
      <line x1="1" y1="9" x2="4" y2="9" />
      <line x1="1" y1="14" x2="4" y2="14" />
    </svg>
  )
}

const THEME_ICONS: Record<ThemeName, () => ReactElement> = {
  'real-estate': ThemeRealEstateIcon,
  warm: ThemeWarmIcon,
  tech: ThemeTechIcon,
}

type SettingsDropdownProps = {
  open: boolean
  onClose: () => void
}

export function SettingsDropdown({ open, onClose }: SettingsDropdownProps) {
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()
  const ref = useRef<HTMLDivElement>(null)
  const [userInfo] = useState(() => getUserInfo())
  const isLoggedIn = Boolean(getAccessToken())

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose()
      }
    },
    [onClose],
  )

  useEffect(() => {
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open, handleClickOutside])

  const handleLogout = () => {
    clearAccessToken()
    clearUserInfo()
    onClose()
    navigate('/')
  }

  if (!open) return null

  return (
    <div className="settings-dropdown" ref={ref}>
      {isLoggedIn && userInfo && (
        <>
          <div className="settings-dropdown__profile">
            <div className="settings-dropdown__avatar">
              {userInfo.username.charAt(0).toUpperCase()}
            </div>
            <div className="settings-dropdown__info">
              <span className="settings-dropdown__name">{userInfo.username}</span>
              <span className="settings-dropdown__email">{userInfo.email}</span>
            </div>
          </div>
          <div className="settings-dropdown__divider" />
        </>
      )}

      <p className="settings-dropdown__section-label">主题</p>
      {THEMES.map(({ id, label }) => {
        const Icon = THEME_ICONS[id]
        const isActive = theme === id
        return (
          <button
            key={id}
            type="button"
            className={`settings-dropdown__item${isActive ? ' settings-dropdown__item--active' : ''}`}
            aria-pressed={isActive}
            onClick={() => { setTheme(id); onClose() }}
          >
            <span className="settings-dropdown__icon">
              <Icon />
            </span>
            <span>{label}</span>
          </button>
        )
      })}

      {isLoggedIn && (
        <>
          <div className="settings-dropdown__divider" />
          <button
            type="button"
            className="settings-dropdown__item settings-dropdown__logout"
            onClick={handleLogout}
          >
            <span className="settings-dropdown__icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </span>
            <span>退出登录</span>
          </button>
        </>
      )}
    </div>
  )
}
