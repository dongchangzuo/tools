import {
  drawBodyVolume,
  drawCalyx,
  drawContactShadow,
  drawFreckles,
  drawLeaf,
  drawSpecular,
  drawStem,
} from './parts'
import { drawSkinTexture } from './texture'
import { DEFAULT_APPLE_PALETTE, type ApplePalette, type DrawAppleOptions } from './types'

function resolvePalette(partial?: Partial<ApplePalette>): ApplePalette {
  return { ...DEFAULT_APPLE_PALETTE, ...partial }
}

/**
 * 在 Canvas 2D 上下文上绘制超写实红苹果。
 * 调用方负责清空画布或绘制背景；本函数仅绘制苹果本身。
 */
export function drawApple(
  ctx: CanvasRenderingContext2D,
  options: DrawAppleOptions,
): void {
  const {
    cx,
    cy,
    radius,
    rotation = 0,
    palette: palettePartial,
  } = options
  const palette = resolvePalette(palettePartial)

  ctx.save()
  ctx.translate(cx, cy)
  if (rotation !== 0) {
    ctx.rotate(rotation)
  }

  drawContactShadow(ctx, radius, palette)
  drawBodyVolume(ctx, radius, palette)
  drawSkinTexture(ctx, radius, palette)
  drawFreckles(ctx, radius, palette)
  drawSpecular(ctx, radius, palette)
  drawCalyx(ctx, radius, palette)
  drawStem(ctx, radius, palette)
  drawLeaf(ctx, radius, palette)

  ctx.restore()
}
