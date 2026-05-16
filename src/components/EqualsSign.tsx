import type { CheckStatus } from '../game/balanceLogic.ts'

type EqualsSignProps = {
  checkStatus: CheckStatus
  tiltRad: number
}

export function EqualsSign({ checkStatus, tiltRad }: EqualsSignProps) {
  const classNames = ['equals-sign']
  if (checkStatus === 'success') classNames.push('equals-sign--success')
  if (checkStatus === 'imbalance') classNames.push('equals-sign--alert')

  return (
    <span
      className={classNames.join(' ')}
      style={{ transform: `rotate(${tiltRad}rad)` }}
      aria-hidden
    >
      =
    </span>
  )
}
