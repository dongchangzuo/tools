type SubmitBarProps = {
  disabled?: boolean
  onSubmit: () => void
  onReset: () => void
}

export function SubmitBar({ disabled, onSubmit, onReset }: SubmitBarProps) {
  return (
    <div className="submit-bar">
      <button
        type="button"
        className="submit-bar__primary"
        onClick={onSubmit}
        disabled={disabled}
      >
        提交
      </button>
      <button
        type="button"
        className="submit-bar__secondary"
        onClick={onReset}
        disabled={disabled}
      >
        重新开始
      </button>
    </div>
  )
}
