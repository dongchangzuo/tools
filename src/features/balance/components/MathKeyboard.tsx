type MathKeyboardProps = {
  onKeyPress: (key: string) => void
  onDelete: () => void
}

const ROWS: { keys: { label: string; value: string }[] }[] = [
  {
    keys: [
      { label: '1', value: '1' },
      { label: '2', value: '2' },
      { label: '3', value: '3' },
      { label: '+', value: '+' },
    ],
  },
  {
    keys: [
      { label: '4', value: '4' },
      { label: '5', value: '5' },
      { label: '6', value: '6' },
      { label: '−', value: '-' },
    ],
  },
  {
    keys: [
      { label: '7', value: '7' },
      { label: '8', value: '8' },
      { label: '9', value: '9' },
      { label: '×', value: '×' },
    ],
  },
  {
    keys: [
      { label: '0', value: '0' },
      { label: '(', value: '(' },
      { label: ')', value: ')' },
      { label: '÷', value: '÷' },
    ],
  },
  {
    keys: [
      { label: '[', value: '[' },
      { label: ']', value: ']' },
      { label: '{', value: '{' },
      { label: '}', value: '}' },
    ],
  },
]

export function MathKeyboard({ onKeyPress, onDelete }: MathKeyboardProps) {
  return (
    <div className="math-keyboard" role="group" aria-label="数学输入键盘">
      {ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="math-keyboard__row">
          {row.keys.map((key) => (
            <button
              key={key.value + key.label}
              type="button"
              className="math-key"
              onClick={() => onKeyPress(key.value)}
              aria-label={`输入 ${key.label}`}
            >
              {key.label}
            </button>
          ))}
        </div>
      ))}
      <div className="math-keyboard__row">
        <button
          type="button"
          className="math-key math-key--delete"
          onClick={onDelete}
          aria-label="删除最后一个字符"
        >
          删除
        </button>
      </div>
    </div>
  )
}
