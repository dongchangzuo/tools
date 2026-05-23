import { BALANCE_HEIGHT, BALANCE_WIDTH, getHookAnchors } from '../geometry'
import { drawHookBalance3d } from '../draw3d/drawBalance3d'
import {
  DEFAULT_HOOK_BALANCE_PALETTE,
  type DrawHookBalanceOptions,
  type HookAnchor,
  type HookBalancePalette,
} from '../types'

function resolvePalette(partial?: Partial<HookBalancePalette>): HookBalancePalette {
  return { ...DEFAULT_HOOK_BALANCE_PALETTE, ...partial }
}

export function drawHookBalance(
  ctx: CanvasRenderingContext2D,
  options: DrawHookBalanceOptions & { palette?: Partial<HookBalancePalette> },
): void {
  drawHookBalance3d(ctx, {
    ...options,
    palette: resolvePalette(options.palette),
  })
}

export function paintHookBalanceScene(
  ctx: CanvasRenderingContext2D,
  options: DrawHookBalanceOptions & {
    width?: number
    height?: number
    background?: string
    palette?: Partial<HookBalancePalette>
  },
): HookAnchor[] {
  const width = options.width ?? BALANCE_WIDTH
  const height = options.height ?? BALANCE_HEIGHT
  const background = options.background ?? '#e8ecf2'

  if (background !== 'transparent') {
    ctx.fillStyle = background
    ctx.fillRect(0, 0, width, height)
  }

  const scaleX = width / BALANCE_WIDTH
  const scaleY = height / BALANCE_HEIGHT

  ctx.save()
  ctx.scale(scaleX, scaleY)
  drawHookBalance(ctx, options)
  ctx.restore()

  const tiltRad = options.tiltRad ?? 0
  const anchors = getHookAnchors(tiltRad)
  return [
    { ...anchors.left, x: anchors.left.x * scaleX, y: anchors.left.y * scaleY, side: 'left' },
    { ...anchors.right, x: anchors.right.x * scaleX, y: anchors.right.y * scaleY, side: 'right' },
  ]
}

export { BALANCE_WIDTH, BALANCE_HEIGHT }
