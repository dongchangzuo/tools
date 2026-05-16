type GameActionsProps = {
  onCheck: () => void
  onReset: () => void
}

export function GameActions({ onCheck, onReset }: GameActionsProps) {
  return (
    <div className="game-actions">
      <button type="button" className="btn btn--primary" onClick={onCheck}>
        校验答案
      </button>
      <button type="button" className="btn btn--secondary" onClick={onReset}>
        重置清空
      </button>
    </div>
  )
}
