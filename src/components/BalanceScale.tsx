import type { ActiveTray } from '../hooks/useBalanceGame.ts'
import type { CheckStatus } from '../game/balanceLogic.ts'
import { BalanceCanvas } from './BalanceCanvas.tsx'

type BalanceScaleProps = {
  leftExpression: string
  rightExpression: string
  activeTray: ActiveTray
  onSelectTray: (side: ActiveTray) => void
  checkStatus: CheckStatus
  currentTiltRad: number
  imbalanceEpoch: number
}

export function BalanceScale({
  leftExpression,
  rightExpression,
  activeTray,
  onSelectTray,
  checkStatus,
  currentTiltRad,
  imbalanceEpoch,
}: BalanceScaleProps) {
  return (
    <div className="balance-stage">
      <BalanceCanvas
        tiltRad={currentTiltRad}
        checkStatus={checkStatus}
        imbalanceEpoch={imbalanceEpoch}
        leftExpression={leftExpression}
        rightExpression={rightExpression}
        activeTray={activeTray}
        onSelectTray={onSelectTray}
      />
      <p className="balance-hint">点击左/右托盘选择输入侧，使用下方键盘输入算式</p>
    </div>
  )
}
