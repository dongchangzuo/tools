type NumericKeyboardProps = {
  onDigit: (digit: string) => void
  onDelete: () => void
  disabled?: boolean
}

const DIGITS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'] as const

export function NumericKeyboard({
  onDigit,
  onDelete,
  disabled,
}: NumericKeyboardProps) {
  return (
    <div
      className="numeric-keyboard"
      role="group"
      aria-label="数字键盘"
    >
      <div className="numeric-keyboard__grid">
        {DIGITS.map((digit) => (
          <button
            key={digit}
            type="button"
            className="numeric-key"
            disabled={disabled}
            onClick={() => onDigit(digit)}
            aria-label={`输入 ${digit}`}
          >
            {digit}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="numeric-key numeric-key--delete"
        disabled={disabled}
        onClick={onDelete}
        aria-label="删除最后一个数字"
      >
        删除
      </button>
    </div>
  )
}
