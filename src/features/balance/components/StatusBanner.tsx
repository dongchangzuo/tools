import type { CheckStatus } from '../game/balanceLogic.ts'

type StatusBannerProps = {
  checkStatus: CheckStatus
  message: string
}

function statusClass(checkStatus: CheckStatus): string {
  switch (checkStatus) {
    case 'success':
      return 'status-banner--success'
    case 'imbalance':
      return 'status-banner--imbalance'
    case 'error':
      return 'status-banner--error'
    default:
      return ''
  }
}

export function StatusBanner({ checkStatus, message }: StatusBannerProps) {
  if (checkStatus === 'idle') return null

  return (
    <div className={`status-banner ${statusClass(checkStatus)}`} role="status" aria-live="polite">
      {message}
    </div>
  )
}
