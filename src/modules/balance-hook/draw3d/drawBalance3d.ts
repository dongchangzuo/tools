import { BASE_TOP_Y, PILLAR_TOP_Y, PILLAR_WIDTH, PIVOT_X } from '../geometry'
import type { DrawHookBalanceOptions, HookBalancePalette } from '../types'
import { DEFAULT_HOOK_BALANCE_PALETTE } from '../types'
import { drawEnvironment, drawEqualsSign } from '../draw/parts'
import { buildBalanceScene } from './buildScene'
import { projectPoint } from './camera'
import { renderScene } from './render'
import type { Vec3 } from './mesh'

function resolvePalette(partial?: Partial<HookBalancePalette>): HookBalancePalette {
  return { ...DEFAULT_HOOK_BALANCE_PALETTE, ...partial }
}

export function drawHookBalance3d(
  ctx: CanvasRenderingContext2D,
  options: DrawHookBalanceOptions & { palette?: Partial<HookBalancePalette> },
): { left: Vec3; right: Vec3 } {
  const palette = resolvePalette(options.palette)
  const tiltRad = options.tiltRad ?? 0
  const animTime = options.animTime ?? 0

  drawEnvironment(ctx, palette)

  const { faces, strokes, panCenters } = buildBalanceScene(tiltRad, animTime, palette)
  renderScene(ctx, faces, strokes)

  ctx.save()
  ctx.fillStyle = 'rgba(30, 40, 55, 0.08)'
  ctx.beginPath()
  ctx.ellipse(PIVOT_X, 318, 88, 10, 0, 0, Math.PI * 2)
  ctx.fill()

  const tickX = PIVOT_X + PILLAR_WIDTH / 2 + 2
  for (let y = PILLAR_TOP_Y + 14; y <= BASE_TOP_Y - 10; y += 7) {
    const major = Math.round((y - PILLAR_TOP_Y) / 7) % 4 === 0
    ctx.strokeStyle = major ? 'rgba(40,48,55,0.55)' : 'rgba(60,68,75,0.35)'
    ctx.lineWidth = major ? 1.1 : 0.7
    ctx.beginPath()
    ctx.moveTo(tickX, y)
    ctx.lineTo(tickX + (major ? 7 : 4), y)
    ctx.stroke()
  }
  ctx.restore()

  if (options.onPaintSide) {
    const left = projectPoint(panCenters.left)
    const right = projectPoint(panCenters.right)
    options.onPaintSide(ctx, 'left', { x: left.x, y: left.y, side: 'left' })
    options.onPaintSide(ctx, 'right', { x: right.x, y: right.y, side: 'right' })
  }

  drawEqualsSign(
    ctx,
    options.equalsVariant ?? 'hidden',
    options.flashPhase ?? 0,
    tiltRad,
    palette,
  )

  return { left: panCenters.left, right: panCenters.right }
}

export function worldPanToScreen(pan: Vec3): { x: number; y: number } {
  return projectPoint(pan)
}
