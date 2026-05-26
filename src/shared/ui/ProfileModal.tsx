import { useEffect } from 'react'
import { ProfileView } from '../../features/auth/components/ProfileView'
import { useProfileData } from '../../features/auth/hooks/useProfileData'
import '../../features/auth/profile.css'

type ProfileModalProps = {
  open: boolean
  onClose: () => void
}

export function ProfileModal({ open, onClose }: ProfileModalProps) {
  const { loadState, user, errorMessage, reload } = useProfileData(open)

  useEffect(() => {
    if (!open) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [open, onClose])

  if (!open) {
    return null
  }

  return (
    <div className="profile-modal-backdrop" onClick={onClose}>
      <div
        className="profile-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="profile-modal__close"
          onClick={onClose}
          aria-label="关闭"
        >
          ×
        </button>
        <h2 id="profile-modal-title" className="sr-only">
          个人资料
        </h2>
        <ProfileView
          loadState={loadState}
          user={user}
          errorMessage={errorMessage}
          onRetry={reload}
        />
      </div>
    </div>
  )
}
