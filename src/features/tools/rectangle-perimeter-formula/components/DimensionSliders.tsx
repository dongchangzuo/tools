type DimensionSlidersProps = {
  lengthA: number
  widthB: number
  disabled?: boolean
  onLengthChange: (value: number) => void
  onWidthChange: (value: number) => void
}

export function DimensionSliders({
  lengthA,
  widthB,
  disabled = false,
  onLengthChange,
  onWidthChange,
}: DimensionSlidersProps) {
  return (
    <section className="rpf-sliders" aria-label="调整 a 和 b">
      <label className="rpf-sliders__field">
        <span className="rpf-sliders__label">a</span>
        <input
          type="range"
          min={2}
          max={12}
          value={lengthA}
          disabled={disabled}
          onChange={(event) => onLengthChange(Number(event.target.value))}
        />
      </label>

      <label className="rpf-sliders__field">
        <span className="rpf-sliders__label">b</span>
        <input
          type="range"
          min={2}
          max={12}
          value={widthB}
          disabled={disabled}
          onChange={(event) => onWidthChange(Number(event.target.value))}
        />
      </label>

      <p className="rpf-sliders__result">周长 = (a + b) × 2</p>
    </section>
  )
}
