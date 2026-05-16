import type { CheckStatus } from '../game/balanceLogic.ts'

type StatusBannerProps = {
  checkStatus: CheckStatus
  message: string
}

export function StatusBanner({ checkStatus, message }: StatusBannerProps) {
  if (checkStatus === 'idle' || !message) return null

  const className =
    checkStatus === 'success'
      ? 'status-banner status-banner--success'
      : checkStatus === 'imbalance'
        ? 'status-banner status-banner--imbalance'
        : 'status-banner status-banner--error'

  return (
    <div role="status" className={className}>
      {message}
    </div>
  )
}
