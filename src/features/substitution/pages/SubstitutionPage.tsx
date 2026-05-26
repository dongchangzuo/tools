import { DEFAULT_PROBLEM } from '../../../substitution/game/substitutionLogic'
import { SubstitutionGameView } from '../../../substitution/components/SubstitutionGameView'
import '../../../substitution/substitution.css'

export function SubstitutionPage() {
  return (
    <SubstitutionGameView
      problem={DEFAULT_PROBLEM}
      title="等量代换"
      subtitle="根据规则拖动图形，让等式两边一样多"
    />
  )
}
