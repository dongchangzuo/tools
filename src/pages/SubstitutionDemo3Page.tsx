import { DEMO3_PROBLEM } from '../substitution/game/substitutionLogic'
import { NumericSubstitutionGameView } from '../substitution/components/NumericSubstitutionGameView'
import '../substitution/substitution.css'

export function SubstitutionDemo3Page() {
  return (
    <NumericSubstitutionGameView
      problem={DEMO3_PROBLEM}
      title="等量代换 · 演示 3"
      subtitle="△ + ○ = 15，算算 △ + △ + ○ + ○ 等于几"
    />
  )
}
