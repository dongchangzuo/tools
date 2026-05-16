import type { CheckStatus, PanOffsets } from '../game/balanceLogic.ts'
import { EqualsSign } from './EqualsSign.tsx'
import { TrayInput } from './TrayInput.tsx'

type BalanceScaleProps = {
  leftExpression: string
  rightExpression: string
  onLeftChange: (value: string) => void
  onRightChange: (value: string) => void
  checkStatus: CheckStatus
  currentTiltRad: number
  currentPanOffsets: PanOffsets
}

export function BalanceScale({
  leftExpression,
  rightExpression,
  onLeftChange,
  onRightChange,
  checkStatus,
  currentTiltRad,
  currentPanOffsets,
}: BalanceScaleProps) {
  return (
    <div className="balance-scale">
      <TrayInput
        id="expr-left"
        label="左边算式"
        value={leftExpression}
        onChange={onLeftChange}
        checkStatus={checkStatus}
        offsetY={currentPanOffsets.left}
      />
      <EqualsSign checkStatus={checkStatus} tiltRad={currentTiltRad} />
      <TrayInput
        id="expr-right"
        label="右边算式"
        value={rightExpression}
        onChange={onRightChange}
        checkStatus={checkStatus}
        offsetY={currentPanOffsets.right}
      />
    </div>
  )
}
