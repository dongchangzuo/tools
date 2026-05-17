import type { SubstitutionRule } from '../game/substitutionLogic'
import { ShapeIcon } from './ShapeIcon.tsx'

type RuleBarProps = {
  rule: SubstitutionRule
}

export function RuleBar({ rule }: RuleBarProps) {
  return (
    <section className="rule-bar" aria-label="等量代换规则">
      <p className="rule-bar__label">代换规则</p>
      <div className="rule-bar__equation">
        <ShapeIcon kind={rule.from} size={56} />
        <span className="rule-bar__equals">=</span>
        <ShapeIcon kind={rule.to} size={56} />
      </div>
      <p className="rule-bar__hint">一个 △ 可以换成一个 ○</p>
    </section>
  )
}
