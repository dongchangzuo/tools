import type { Vec3 } from './project'
import type { ShapePalette } from './types'

const KEY_LIGHT = { x: -0.5, y: 0.6, z: -0.4 }

export function normalize(v: Vec3): Vec3 {
  const len = Math.hypot(v.x, v.y, v.z) || 1
  return { x: v.x / len, y: v.y / len, z: v.z / len }
}

export function faceShade(normal: Vec3): number {
  const n = normalize(normal)
  const dot =
    n.x * KEY_LIGHT.x + n.y * KEY_LIGHT.y + n.z * KEY_LIGHT.z
  return Math.max(0.22, Math.min(1, 0.45 + dot * 0.55))
}

export function shadeToColors(
  shade: number,
  palette: ShapePalette,
): { fill: string; stroke: string } {
  if (shade > 0.78) {
    return { fill: palette.faceLight, stroke: palette.edge }
  }
  if (shade > 0.52) {
    return { fill: palette.faceMid, stroke: palette.edge }
  }
  if (shade > 0.35) {
    return { fill: palette.faceDark, stroke: palette.edge }
  }
  return { fill: palette.faceDeep, stroke: palette.edge }
}

export function linearGradientForFace(
  ctx: CanvasRenderingContext2D,
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  shade: number,
  palette: ShapePalette,
): CanvasGradient {
  const grad = ctx.createLinearGradient(p0.x, p0.y, p1.x, p1.y)
  const base = shade
  grad.addColorStop(0, mixShade(palette.faceLight, base * 1.08))
  grad.addColorStop(0.5, mixShade(palette.faceMid, base))
  grad.addColorStop(1, mixShade(palette.faceDark, base * 0.88))
  return grad
}

function mixShade(hex: string, factor: number): string {
  if (hex.startsWith('rgba')) return hex
  const f = Math.max(0.35, Math.min(1.15, factor))
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const clamp = (c: number) => Math.round(Math.min(255, c * f))
  return `rgb(${clamp(r)}, ${clamp(g)}, ${clamp(b)})`
}

export function drawGroundShadow(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  palette: ShapePalette,
): void {
  ctx.save()
  ctx.translate(cx, cy)
  ctx.scale(1, 0.28)
  ctx.beginPath()
  ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2)
  ctx.fillStyle = palette.shadow
  ctx.fill()
  ctx.restore()
}
