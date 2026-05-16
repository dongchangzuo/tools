import type { CheckStatus } from '../game/balanceLogic.ts'

type TrayInputProps = {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  checkStatus: CheckStatus
  offsetY: number
  placeholder?: string
}

function trayClass(checkStatus: CheckStatus): string {
  if (checkStatus === 'success') return 'tray tray--success'
  if (checkStatus === 'imbalance' || checkStatus === 'error') return 'tray tray--danger'
  return 'tray'
}

export function TrayInput({
  id,
  label,
  value,
  onChange,
  checkStatus,
  offsetY,
  placeholder = '输入算式',
}: TrayInputProps) {
  return (
    <div
      className={trayClass(checkStatus)}
      style={{ transform: `translateY(${offsetY}px)` }}
    >
      <span className="sr-only">{label}</span>
      <input
        id={id}
        type="text"
        className="tray__input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck={false}
        aria-label={label}
      />
    </div>
  )
}
