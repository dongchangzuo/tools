import { DEMO2_PROBLEM } from '../../../substitution/game/substitutionLogic'
import { SubstitutionGameView } from '../../../substitution/components/SubstitutionGameView'
import '../../../substitution/substitution.css'

export function SubstitutionDemo2Page() {
  return (
    <SubstitutionGameView
      problem={DEMO2_PROBLEM}
      title="等量代换 · 演示 2"
      subtitle="两个三角形等于一个圆，补全右边的等式"
    />
  )
}
