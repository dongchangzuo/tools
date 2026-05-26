import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from './ThemeContext'
import {
  clearAccessToken,
  clearUserInfo,
  getAccessToken,
  getUserInfo,
} from '../../features/auth/api/tokenStorage'

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

type SettingsDropdownProps = {
  open: boolean
  onClose: () => void
}

export function SettingsDropdown({ open, onClose }: SettingsDropdownProps) {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
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

      <button
        type="button"
        className="settings-dropdown__item"
        onClick={() => { toggleTheme(); onClose() }}
      >
        <span className="settings-dropdown__icon">
          {theme === 'cosmic' ? <SunIcon /> : <MoonIcon />}
        </span>
        <span>{theme === 'cosmic' ? '暖色主题' : '深色主题'}</span>
      </button>

      {isLoggedIn && (
        <>
          <div className="settings-dropdown__divider" />
          <button
            type="button"
            className="settings-dropdown__item settings-dropdown__logout"
            onClick={handleLogout}
          >
            <span className="settings-dropdown__icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
