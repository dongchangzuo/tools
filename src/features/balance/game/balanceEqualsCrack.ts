import { PIVOT_X, PIVOT_Y } from './balanceGeometry.ts'

export const CRACK_DURATION = 1.8

export function getCrackProgress(elapsed: number): number {
  return Math.min(elapsed / CRACK_DURATION, 1)
}

export function drawCrackedEquals(
  ctx: CanvasRenderingContext2D,
  progress: number,
) {
  ctx.save()

  const ex = PIVOT_X
  const ey = PIVOT_Y - 22
  const gap = 6

  ctx.strokeStyle = '#d4d4d4'
  ctx.lineWidth = 4
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  ctx.beginPath()
  ctx.moveTo(ex - 30, ey - gap - 2)
  ctx.lineTo(ex + 30, ey - gap - 2)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(ex - 30, ey + gap + 2)
  ctx.lineTo(ex + 30, ey + gap + 2)
  ctx.stroke()

  const crackLen = 28 * progress
  if (crackLen > 0) {
    ctx.strokeStyle = '#ef4444'
    ctx.lineWidth = 2.5

    ctx.beginPath()
    ctx.moveTo(ex - 8, ey - gap)
    ctx.lineTo(ex - 8 - crackLen * 0.5, ey - gap + crackLen * 0.6)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(ex + 2, ey + gap)
    ctx.lineTo(ex + 2 + crackLen * 0.35, ey + gap + crackLen * 0.7)
    ctx.stroke()
  }

  ctx.restore()
}
