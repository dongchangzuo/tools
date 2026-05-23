import type { NumericProblem } from '../game/substitutionLogic'
import { ShapeIcon } from './ShapeIcon'

type NumericEquationBoardProps = {
  problem: NumericProblem
  answer: string
  shapeSize?: number
}

export function NumericEquationBoard({
  problem,
  answer,
  shapeSize = 48,
}: NumericEquationBoardProps) {
  return (
    <section className="equation-board" aria-label="题目">
      <p className="equation-board__label">请算出答案</p>
      <div className="equation-board__row">
        {problem.left.map((shape, i) => (
          <span key={`l-${i}`} className="equation-board__term">
            {i > 0 && <span className="equation-board__op">+</span>}
            <ShapeIcon kind={shape} size={shapeSize} />
          </span>
        ))}
        <span className="equation-board__eq">=</span>
        <span className="numeric-answer">
          <span className="numeric-answer__value" aria-live="polite">
            {answer || '?'}
          </span>
        </span>
      </div>
    </section>
  )
}
