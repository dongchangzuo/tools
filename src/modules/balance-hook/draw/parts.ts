import { drawCrackedEquals } from '../equalsCrack'
import { BALANCE_HEIGHT, BALANCE_WIDTH, PIVOT_X, PIVOT_Y } from '../geometry'
import type { EqualsVariant, HookBalancePalette } from '../types'

export function drawEnvironment(
  ctx: CanvasRenderingContext2D,
  palette: HookBalancePalette,
): void {
  const g = ctx.createLinearGradient(0, 0, 0, BALANCE_HEIGHT)
  g.addColorStop(0, palette.envTop)
  g.addColorStop(0.55, palette.envMid)
  g.addColorStop(1, palette.envBottom)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, BALANCE_WIDTH, BALANCE_HEIGHT)

  const vg = ctx.createRadialGradient(
    BALANCE_WIDTH / 2,
    BALANCE_HEIGHT * 0.42,
    30,
    BALANCE_WIDTH / 2,
    BALANCE_HEIGHT * 0.5,
    BALANCE_WIDTH * 0.62,
  )
  vg.addColorStop(0, 'rgba(0,0,0,0)')
  vg.addColorStop(1, 'rgba(30,40,55,0.1)')
  ctx.fillStyle = vg
  ctx.fillRect(0, 0, BALANCE_WIDTH, BALANCE_HEIGHT)
}

export function drawEqualsSign(
  ctx: CanvasRenderingContext2D,
  variant: EqualsVariant,
  flashPhase: number,
  tiltRad: number,
  palette: HookBalancePalette,
): void {
  if (variant === 'hidden') return

  let color = palette.equalsIdle
  let alpha = 1
  if (variant === 'success') color = palette.equalsSuccess
  if (variant === 'imbalance') {
    color = palette.equalsImbalance
    alpha = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(flashPhase * Math.PI * 2))
    drawCrackedEquals(ctx, flashPhase, tiltRad, color, alpha)
    return
  }

  ctx.save()
  ctx.globalAlpha = alpha
  ctx.fillStyle = color
  ctx.font = '800 36px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('=', PIVOT_X, PIVOT_Y - 36)
  ctx.restore()
}
