type FormulaDisplayProps = {
  length: number
  verticalWidth: number
  half: number
  perimeter: number
}

export function FormulaDisplay({ length, verticalWidth, half, perimeter }: FormulaDisplayProps) {
  const lengthLabel = Number.isInteger(length) ? length : length.toFixed(1)
  const widthLabel = Number.isInteger(verticalWidth) ? verticalWidth : verticalWidth.toFixed(1)

  return (
    <div className="rp-formula" aria-live="polite">
      <p className="rp-formula__perimeter">
        周长 <strong>{perimeter}</strong>
        <span className="rp-formula__hint">（固定不变）</span>
      </p>
      <p className="rp-formula__equation">
        <span className="rp-formula__part rp-formula__part--length">
          长 <strong>{lengthLabel}</strong>
        </span>
        <span className="rp-formula__plus" aria-hidden="true">
          +
        </span>
        <span className="rp-formula__part rp-formula__part--width">
          宽 <strong>{widthLabel}</strong>
        </span>
        <span className="rp-formula__equals" aria-hidden="true">
          =
        </span>
        <span className="rp-formula__half">
          <strong>{half}</strong>
        </span>
      </p>
      <p className="rp-formula__note">水平边是长，竖直边是宽</p>
    </div>
  )
}
