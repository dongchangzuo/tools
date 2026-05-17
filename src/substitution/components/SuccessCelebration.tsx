type SuccessCelebrationProps = {
  onPlayAgain: () => void
}

export function SuccessCelebration({ onPlayAgain }: SuccessCelebrationProps) {
  return (
    <div className="result-overlay result-overlay--success" role="dialog" aria-modal="true">
      <div className="result-card result-card--success">
        <div className="success-check" aria-hidden>
          ✓
        </div>
        <div className="confetti" aria-hidden>
          {Array.from({ length: 12 }, (_, i) => (
            <span
              key={i}
              className="confetti__piece"
              style={{ '--i': i } as React.CSSProperties}
            />
          ))}
        </div>
        <h2 className="result-card__title">太棒了！</h2>
        <p className="result-card__message">你完成了等量代换，两边一样多！</p>
        <button type="button" className="result-card__btn" onClick={onPlayAgain}>
          再玩一次
        </button>
      </div>
    </div>
  )
}
