import type { SlotsProblem } from '../game/substitutionLogic'
import type { ShapeKind } from '../types'
import { DropSlot } from './DropSlot.tsx'
import { ShapeIcon } from './ShapeIcon.tsx'

type EquationBoardProps = {
  problem: SlotsProblem
  slots: (ShapeKind | null)[]
  disabled?: boolean
  shapeSize?: number
  onDrop: (index: number, shape: ShapeKind) => void
  onClear: (index: number) => void
}

export function EquationBoard({
  problem,
  slots,
  disabled,
  shapeSize = 52,
  onDrop,
  onClear,
}: EquationBoardProps) {
  return (
    <section className="equation-board" aria-label="题目">
      <p className="equation-board__label">请完成等式</p>
      <div className="equation-board__row">
        {problem.left.map((shape, i) => (
          <span key={`l-${i}`} className="equation-board__term">
            {i > 0 && <span className="equation-board__op">+</span>}
            <ShapeIcon kind={shape} size={shapeSize} />
          </span>
        ))}
        <span className="equation-board__eq">=</span>
        {slots.map((slot, i) => (
          <span key={`r-${i}`} className="equation-board__term">
            {i > 0 && <span className="equation-board__op">+</span>}
            <DropSlot
              index={i}
              value={slot}
              disabled={disabled}
              onDrop={onDrop}
              onClear={onClear}
            />
          </span>
        ))}
      </div>
    </section>
  )
}
