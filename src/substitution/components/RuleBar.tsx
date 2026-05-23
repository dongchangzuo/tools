import type { NumericSumRule, SubstitutionRule } from '../game/substitutionLogic'
import { ShapeIcon } from './ShapeIcon'

export type RuleBarRule = SubstitutionRule | NumericSumRule

type RuleBarProps = {
  rule: RuleBarRule
}

function ruleHint(rule: RuleBarRule): string {
  if (rule.kind === 'numericSum') {
    return '一个 △ 加一个 ○ 等于 15'
  }
  if (rule.kind === 'sum') {
    return '两个 △ 可以换成一个 ○'
  }
  return '一个 △ 可以换成一个 ○'
}

export function RuleBar({ rule }: RuleBarProps) {
  return (
    <section className="rule-bar" aria-label="等量代换规则">
      <p className="rule-bar__label">代换规则</p>
      <div className="rule-bar__equation">
        {rule.kind === 'numericSum' ? (
          <>
            {rule.terms.map((term, i) => (
              <span key={`${term}-${i}`} className="rule-bar__term">
                {i > 0 && <span className="rule-bar__plus">+</span>}
                <ShapeIcon kind={term} size={56} />
              </span>
            ))}
            <span className="rule-bar__equals">=</span>
            <span className="rule-bar__value">{rule.value}</span>
          </>
        ) : rule.kind === 'sum' ? (
          <>
            <ShapeIcon kind={rule.from} size={56} />
            <span className="rule-bar__plus">+</span>
            <ShapeIcon kind={rule.from} size={56} />
            <span className="rule-bar__equals">=</span>
            <ShapeIcon kind={rule.to} size={56} />
          </>
        ) : (
          <>
            <ShapeIcon kind={rule.from} size={56} />
            <span className="rule-bar__equals">=</span>
            <ShapeIcon kind={rule.to} size={56} />
          </>
        )}
      </div>
      <p className="rule-bar__hint">{ruleHint(rule)}</p>
    </section>
  )
}
