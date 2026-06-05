export type RectangleLayout = {
  ox: number
  oy: number
  aPx: number
  bPx: number
}

export function buildRectangleLayout(lengthA: number, widthB: number, unit: number, padding = 56): RectangleLayout {
  const ox = padding
  const oy = padding
  return {
    ox,
    oy,
    aPx: lengthA * unit,
    bPx: widthB * unit,
  }
}

export function buildRedPath({ ox, oy, aPx, bPx }: RectangleLayout): string {
  return `M ${ox} ${oy + bPx} L ${ox} ${oy} L ${ox + aPx} ${oy}`
}

export function buildGreenPath({ ox, oy, aPx, bPx }: RectangleLayout): string {
  return `M ${ox + aPx} ${oy} L ${ox + aPx} ${oy + bPx} L ${ox} ${oy + bPx}`
}

export function computeUnit(lengthA: number, widthB: number, maxPixels = 320): number {
  const maxDim = Math.max(lengthA, widthB, 1)
  return Math.min(32, Math.floor(maxPixels / maxDim))
}
