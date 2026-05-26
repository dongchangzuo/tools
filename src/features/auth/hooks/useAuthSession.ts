import { useSyncExternalStore } from 'react'
import { getAuthSnapshot, getServerAuthSnapshot, subscribeAuth } from '../api/tokenStorage'

export function useAuthSession() {
  return useSyncExternalStore(subscribeAuth, getAuthSnapshot, getServerAuthSnapshot)
}
