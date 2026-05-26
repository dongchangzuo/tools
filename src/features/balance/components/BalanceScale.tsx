import type { ActiveTray } from '../hooks/useBalanceGame.ts'
import type { CheckStatus } from '../game/balanceLogic.ts'
import { BalanceCanvas } from './BalanceCanvas.tsx'

type BalanceScaleProps = {
  leftExpression: string
  rightExpression: string
  activeTray: ActiveTray
  onSelectTray: (tray: ActiveTray) => void
  checkStatus: CheckStatus
  currentTiltRad: number
  animTime: number
  imbalanceEpoch: number
}

export function BalanceScale({
  leftExpression,
  rightExpression,
  activeTray,
  onSelectTray,
  checkStatus,
  currentTiltRad,
  animTime,
  imbalanceEpoch,
}: BalanceScaleProps) {
  return (
    <div className="balance-stage">
      <BalanceCanvas
        tiltRad={currentTiltRad}
        checkStatus={checkStatus}
        leftExpression={leftExpression}
        rightExpression={rightExpression}
        activeTray={activeTray}
        animTime={animTime}
        imbalanceEpoch={imbalanceEpoch}
        onSelectTray={onSelectTray}
      />
      <p className="balance-hint">
        {activeTray === 'left' ? '← 左盘选中，输入算式' : '→ 右盘选中，输入算式'}
      </p>
    </div>
  )
}
