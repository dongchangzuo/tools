import type { ShapeKind } from '../types'

type ShapeIconProps = {
  kind: ShapeKind | 'slot'
  size?: number
  className?: string
}

export function ShapeIcon({ kind, size = 48, className }: ShapeIconProps) {
  const s = size
  const half = s / 2

  if (kind === 'triangle') {
    return (
      <svg
        width={s}
        height={s}
        viewBox="0 0 48 48"
        className={className}
        aria-hidden
      >
        <polygon
          points={`${half},8 40,40 8,40`}
          fill="#f59e0b"
          stroke="#b45309"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  if (kind === 'circle') {
    return (
      <svg
        width={s}
        height={s}
        viewBox="0 0 48 48"
        className={className}
        aria-hidden
      >
        <circle
          cx={half}
          cy={half}
          r={16}
          fill="#3b82f6"
          stroke="#1d4ed8"
          strokeWidth="2"
        />
      </svg>
    )
  }

  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 48 48"
      className={className}
      aria-hidden
    >
      <rect
        x="10"
        y="14"
        width="28"
        height="28"
        rx="4"
        fill="none"
        stroke="#94a3b8"
        strokeWidth="2"
        strokeDasharray="6 4"
      />
    </svg>
  )
}
