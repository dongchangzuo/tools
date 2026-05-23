import { failureMessage } from '../game/substitutionLogic'
import type { FailureReason } from '../types'

type NumericFailureScreenProps = {
  reason: FailureReason
  onRetry: () => void
  onReset: () => void
}

export function NumericFailureScreen({
  reason,
  onRetry,
  onReset,
}: NumericFailureScreenProps) {
  return (
    <div className="result-overlay result-overlay--failure" role="dialog" aria-modal="true">
      <div className="result-card result-card--failure">
        <div className="failure-icon" aria-hidden>
          !
        </div>
        <h2 className="result-card__title">再试一次</h2>
        <p className="result-card__message">
          {failureMessage(reason, 'numeric')}
        </p>
        <div className="result-card__actions">
          <button type="button" className="result-card__btn" onClick={onRetry}>
            再试一次
          </button>
          <button
            type="button"
            className="result-card__btn result-card__btn--ghost"
            onClick={onReset}
          >
            重新开始
          </button>
        </div>
      </div>
    </div>
  )
}
