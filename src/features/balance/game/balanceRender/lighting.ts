export const BASE_LIGHT_ANGLE = -Math.PI * 0.72

export function lightVector(tiltRad = 0): { lx: number; ly: number } {
  const a = BASE_LIGHT_ANGLE - tiltRad * 0.35
  return { lx: Math.cos(a), ly: Math.sin(a) }
}

export function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  const rad = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + rad, y)
  ctx.lineTo(x + w - rad, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + rad)
  ctx.lineTo(x + w, y + h - rad)
  ctx.quadraticCurveTo(x + w, y + h, x + w - rad, y + h)
  ctx.lineTo(x + rad, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - rad)
  ctx.lineTo(x, y + rad)
  ctx.quadraticCurveTo(x, y, x + rad, y)
  ctx.closePath()
}

export function linearMetalGradient(
  ctx: CanvasRenderingContext2D,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  highlight: string,
  mid: string,
  shadow: string,
): CanvasGradient {
  const g = ctx.createLinearGradient(x0, y0, x1, y1)
  g.addColorStop(0, highlight)
  g.addColorStop(0.45, mid)
  g.addColorStop(1, shadow)
  return g
}

export function radialHighlight(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  inner: string,
  outer: string,
): CanvasGradient {
  const g = ctx.createRadialGradient(cx - r * 0.25, cy - r * 0.25, 0, cx, cy, r)
  g.addColorStop(0, inner)
  g.addColorStop(1, outer)
  return g
}

export function fakeBevelStroke(
  ctx: CanvasRenderingContext2D,
  lightSide: number,
): void {
  ctx.strokeStyle =
    lightSide > 0 ? 'rgba(255,255,255,0.35)' : 'rgba(20,20,25,0.45)'
  ctx.lineWidth = 1
  ctx.stroke()
}
