type HalfPerimeterBarProps = {
  length: number
  verticalWidth: number
  half: number
}

export function HalfPerimeterBar({ length, verticalWidth, half }: HalfPerimeterBarProps) {
  if (half <= 0) return null

  const lengthPercent = (length / half) * 100
  const widthPercent = (verticalWidth / half) * 100

  return (
    <div className="rp-half-bar" aria-hidden="true">
      <div className="rp-half-bar__track">
        <div className="rp-half-bar__segment rp-half-bar__segment--length" style={{ width: `${lengthPercent}%` }} />
        <div className="rp-half-bar__segment rp-half-bar__segment--width" style={{ width: `${widthPercent}%` }} />
      </div>
      <div className="rp-half-bar__labels">
        <span>长 {Number.isInteger(length) ? length : length.toFixed(1)}</span>
        <span>宽 {Number.isInteger(verticalWidth) ? verticalWidth : verticalWidth.toFixed(1)}</span>
      </div>
      <p className="rp-half-bar__caption">长 + 宽 = {half}</p>
    </div>
  )
}
