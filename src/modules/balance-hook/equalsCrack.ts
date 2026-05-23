import { PIVOT_X, PIVOT_Y } from './geometry'

export const CRACK_DURATION = 0.55
export const EQUALS_CY = PIVOT_Y - 36

export function getCrackProgress(flashPhase: number): number {
  return Math.min(1, flashPhase / CRACK_DURATION)
}

export function drawCrackedEquals(
  ctx: CanvasRenderingContext2D,
  flashPhase: number,
  _tiltRad: number,
  color: string,
  alpha: number,
): void {
  const t = getCrackProgress(flashPhase)
  ctx.save()
  ctx.globalAlpha = alpha
  ctx.strokeStyle = color
  ctx.lineWidth = 3.5
  ctx.lineCap = 'round'
  const cx = PIVOT_X
  const cy = EQUALS_CY
  const gap = 4 + t * 6
  ctx.beginPath()
  ctx.moveTo(cx - 18, cy - gap / 2)
  ctx.lineTo(cx - 6, cy - gap / 2 - 2)
  ctx.lineTo(cx + 6, cy - gap / 2 + 1)
  ctx.lineTo(cx + 18, cy - gap / 2)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(cx - 16, cy + gap / 2)
  ctx.lineTo(cx + 18, cy + gap / 2)
  ctx.stroke()
  ctx.restore()
}
