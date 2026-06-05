import { buildGreenPath, buildRectangleLayout, buildRedPath, computeUnit } from '../math/rectanglePaths'

type FormulaRectangleSvgProps = {
  lengthA: number
  widthB: number
  phase: number
  shapeGroupRef?: React.RefObject<SVGGElement | null>
  idleBottomRef?: React.RefObject<SVGLineElement | null>
  idleRightRef?: React.RefObject<SVGLineElement | null>
  redPathRef?: React.RefObject<SVGPathElement | null>
  greenPathRef?: React.RefObject<SVGPathElement | null>
}

export function FormulaRectangleSvg({
  lengthA,
  widthB,
  phase,
  shapeGroupRef,
  idleBottomRef,
  idleRightRef,
  redPathRef,
  greenPathRef,
}: FormulaRectangleSvgProps) {
  const unit = computeUnit(lengthA, widthB, 360)
  const layout = buildRectangleLayout(lengthA, widthB, unit, 64)
  const { ox, oy, aPx, bPx } = layout
  const svgWidth = ox + aPx + 64
  const svgHeight = oy + bPx + 64

  const showRed = phase >= 1
  const showGreen = phase >= 3

  return (
    <svg
      className="rpf-scene__svg"
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      width="100%"
      height={svgHeight}
      aria-hidden="true"
    >
      <defs>
        <pattern id="rpf-grid" width={unit} height={unit} patternUnits="userSpaceOnUse">
          <path
            d={`M ${unit} 0 L 0 0 0 ${unit}`}
            fill="none"
            stroke="var(--rpf-grid-stroke)"
            strokeWidth="1"
          />
        </pattern>
      </defs>

      <rect x="0" y="0" width={svgWidth} height={svgHeight} fill="url(#rpf-grid)" />

      <g ref={shapeGroupRef} className="rpf-scene__shape">
        <line
          className="rpf-scene__edge rpf-scene__edge--idle"
          x1={ox}
          y1={oy}
          x2={ox + aPx}
          y2={oy}
          opacity={showRed ? 0.25 : 1}
        />
        <line
          className="rpf-scene__edge rpf-scene__edge--idle"
          x1={ox}
          y1={oy}
          x2={ox}
          y2={oy + bPx}
          opacity={showRed ? 0.25 : 1}
        />
        <line
          ref={idleRightRef}
          className="rpf-scene__edge rpf-scene__edge--idle"
          x1={ox + aPx}
          y1={oy}
          x2={ox + aPx}
          y2={oy + bPx}
          opacity={showGreen ? 0.25 : 1}
        />
        <line
          ref={idleBottomRef}
          className="rpf-scene__edge rpf-scene__edge--idle"
          x1={ox}
          y1={oy + bPx}
          x2={ox + aPx}
          y2={oy + bPx}
          opacity={showGreen ? 0.25 : 1}
        />

        <path
          ref={redPathRef}
          className="rpf-scene__rope rpf-scene__rope--red"
          d={buildRedPath(layout)}
          fill="none"
          visibility={phase >= 1 ? 'visible' : 'hidden'}
        />

        <path
          ref={greenPathRef}
          className="rpf-scene__rope rpf-scene__rope--green"
          d={buildGreenPath(layout)}
          fill="none"
          visibility={phase >= 3 ? 'visible' : 'hidden'}
        />

        <text
          className="rpf-scene__label rpf-scene__label--horizontal"
          x={ox + aPx / 2}
          y={oy - 18}
          textAnchor="middle"
        >
          a
        </text>
        <text
          className="rpf-scene__label rpf-scene__label--vertical"
          x={ox - 20}
          y={oy + bPx / 2}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          b
        </text>
      </g>
    </svg>
  )
}
