import { validatePerimeter } from '../math/validatePerimeter'

const PRESETS = [12, 16, 20, 24] as const

type PerimeterControlsProps = {
  perimeter: number
  onChange: (perimeter: number) => void
  disabled?: boolean
}

export function PerimeterControls({ perimeter, onChange, disabled = false }: PerimeterControlsProps) {
  const handleCustomChange = (value: string) => {
    const parsed = Number.parseInt(value, 10)
    if (Number.isNaN(parsed)) return
    onChange(parsed)
  }

  const validation = validatePerimeter(perimeter)

  return (
    <div className="rp-controls">
      <fieldset className="rp-controls__presets" disabled={disabled}>
        <legend className="rp-controls__legend">选择周长</legend>
        <div className="rp-controls__chips">
          {PRESETS.map((value) => (
            <button
              key={value}
              type="button"
              className={`rp-chip${perimeter === value ? ' rp-chip--active' : ''}`}
              onClick={() => onChange(value)}
              aria-pressed={perimeter === value}
            >
              {value}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="rp-controls__custom">
        <span className="rp-controls__custom-label">自定义偶数周长</span>
        <input
          type="number"
          min={4}
          step={2}
          value={perimeter}
          disabled={disabled}
          onChange={(event) => handleCustomChange(event.target.value)}
          aria-invalid={!validation.valid}
        />
      </label>

      {!validation.valid && (
        <p className="rp-controls__error" role="alert">
          {validation.error}
        </p>
      )}
    </div>
  )
}
