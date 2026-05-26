import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMe } from '../api/authApi'
import { clearAccessToken, clearUserInfo, getAccessToken, setUserInfo } from '../api/tokenStorage'
import { ApiError, type User } from '../../../shared/api/types'

export type ProfileLoadState = 'idle' | 'loading' | 'ready' | 'error'

export function useProfileData(enabled: boolean) {
  const navigate = useNavigate()
  const [loadState, setLoadState] = useState<ProfileLoadState>('idle')
  const [user, setUser] = useState<User | null>(null)
  const [errorMessage, setErrorMessage] = useState('')

  const loadProfile = useCallback(async () => {
    if (!getAccessToken()) {
      setLoadState('error')
      setErrorMessage('请先登录后查看个人资料。')
      return
    }

    setLoadState('loading')
    setErrorMessage('')

    try {
      const response = await getMe()
      setUser(response.user)
      setUserInfo({
        username: response.user.username,
        email: response.user.email,
      })
      setLoadState('ready')
    } catch (error) {
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
  }, [navigate])

  useEffect(() => {
    if (!enabled) {
      return
    }

    void loadProfile()
  }, [enabled, loadProfile])

  return { loadState, user, errorMessage, reload: loadProfile }
}
