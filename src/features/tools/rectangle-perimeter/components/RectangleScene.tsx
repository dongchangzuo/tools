import { useCallback, useEffect, useRef, useState } from 'react'
import { computeCellSize } from '../hooks/usePerimeterExplorer'

const SCENE_PADDING = 48
const HANDLE_RADIUS = 22

type RectangleSceneProps = {
  length: number
  verticalWidth: number
  half: number
  isDragging: boolean
  disabled?: boolean
  onBeginDrag: () => void
  onDrag: (pointerX: number, originX: number, cellSize: number) => void
  onEndDrag: () => void
  onNudge: (delta: number) => void
}

export function RectangleScene({
  length,
  verticalWidth,
  half,
  isDragging,
  disabled = false,
  onBeginDrag,
  onDrag,
  onEndDrag,
  onNudge,
}: RectangleSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [containerWidth, setContainerWidth] = useState(360)

  useEffect(() => {
    const node = containerRef.current
    if (!node) return

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) setContainerWidth(entry.contentRect.width)
    })

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const cellSize = computeCellSize(half, containerWidth, SCENE_PADDING)
  const originX = SCENE_PADDING
  const originY = SCENE_PADDING
  const rectWidth = length * cellSize
  const rectHeight = verticalWidth * cellSize
  const svgWidth = Math.max(containerWidth, rectWidth + SCENE_PADDING * 2)
  const svgHeight = rectHeight + SCENE_PADDING * 2 + 56
  const handleX = originX + rectWidth
  const handleY = originY + rectHeight
  const maxLength = Math.max(half - 1, 1)

  const clientXToSvg = useCallback(
    (clientX: number) => {
      const svg = svgRef.current
      if (!svg) return originX
      const point = svg.createSVGPoint()
      point.x = clientX
      point.y = 0
      const matrix = svg.getScreenCTM()
      if (!matrix) return originX
      return point.matrixTransform(matrix.inverse()).x
    },
    [originX],
  )

  const handlePointerDown = (event: React.PointerEvent<SVGCircleElement>) => {
    if (disabled) return
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    onBeginDrag()
  }

  const handlePointerMove = (event: React.PointerEvent<SVGCircleElement>) => {
    if (!isDragging || disabled) return
    onDrag(clientXToSvg(event.clientX), originX, cellSize)
  }

  const handlePointerUp = (event: React.PointerEvent<SVGCircleElement>) => {
    if (!isDragging) return
    event.currentTarget.releasePointerCapture(event.pointerId)
    onEndDrag()
  }

  const handleKeyDown = (event: React.KeyboardEvent<SVGCircleElement>) => {
    if (disabled) return
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      event.preventDefault()
      onNudge(1)
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      event.preventDefault()
      onNudge(-1)
    }
  }

  return (
    <div ref={containerRef} className="rp-scene">
      <svg
        ref={svgRef}
        className="rp-scene__svg"
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        width="100%"
        height={svgHeight}
        aria-hidden="true"
      >
        <defs>
          <pattern id="rp-grid" width={cellSize} height={cellSize} patternUnits="userSpaceOnUse">
            <path
              d={`M ${cellSize} 0 L 0 0 0 ${cellSize}`}
              fill="none"
              stroke="var(--rp-grid-stroke)"
              strokeWidth="1"
            />
          </pattern>
        </defs>

        <rect x="0" y="0" width={svgWidth} height={svgHeight} fill="url(#rp-grid)" />

        <rect
          className="rp-scene__fill"
          x={originX}
          y={originY}
          width={Math.max(rectWidth, 1)}
          height={Math.max(rectHeight, 1)}
          rx="4"
        />

        <line
          className="rp-scene__edge rp-scene__edge--length"
          x1={originX}
          y1={originY}
          x2={originX + rectWidth}
          y2={originY}
        />
        <line
          className="rp-scene__edge rp-scene__edge--length"
          x1={originX}
          y1={originY + rectHeight}
          x2={originX + rectWidth}
          y2={originY + rectHeight}
        />
        <line
          className="rp-scene__edge rp-scene__edge--width"
          x1={originX}
          y1={originY}
          x2={originX}
          y2={originY + rectHeight}
        />
        <line
          className="rp-scene__edge rp-scene__edge--width"
          x1={originX + rectWidth}
          y1={originY}
          x2={originX + rectWidth}
          y2={originY + rectHeight}
        />

        <circle className="rp-scene__anchor" cx={originX} cy={originY} r="8" />

        <text className="rp-scene__label rp-scene__label--length" x={originX + rectWidth / 2} y={originY - 14}>
          长 {Number.isInteger(length) ? length : length.toFixed(1)}
        </text>
        <text
          className="rp-scene__label rp-scene__label--width"
          x={originX - 14}
          y={originY + rectHeight / 2}
          transform={`rotate(-90 ${originX - 14} ${originY + rectHeight / 2})`}
        >
          宽 {Number.isInteger(verticalWidth) ? verticalWidth : verticalWidth.toFixed(1)}
        </text>

        <circle
          className={`rp-scene__handle${isDragging ? ' rp-scene__handle--dragging' : ''}`}
          cx={handleX}
          cy={handleY}
          r={HANDLE_RADIUS}
          tabIndex={disabled ? -1 : 0}
          role="slider"
          aria-label="拖动改变长，宽会相应变化"
          aria-valuemin={1}
          aria-valuemax={maxLength}
          aria-valuenow={Math.round(length)}
          aria-valuetext={`长 ${Math.round(length)}，宽 ${Math.round(verticalWidth)}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onKeyDown={handleKeyDown}
        />
        <circle className="rp-scene__handle-dot" cx={handleX} cy={handleY} r="8" pointerEvents="none" />
      </svg>

      <p className="rp-scene__hint">拖右下角：长变长，宽就变短</p>
    </div>
  )
}
