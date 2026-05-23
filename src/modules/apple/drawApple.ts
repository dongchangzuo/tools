import { APPLE_CENTER_OFFSET_Y, APPLE_CANVAS_HEIGHT, APPLE_CANVAS_WIDTH } from './geometry'
import { drawApple as drawAppleImpl } from './compose'
import type { DrawAppleOptions } from './types'

export { drawApple } from './compose'

/** 在默认尺寸画布中心绘制苹果（便捷方法） */
export function drawAppleCentered(
  ctx: CanvasRenderingContext2D,
  options: Omit<DrawAppleOptions, 'cx' | 'cy'> & {
    width?: number
    height?: number
  },
): void {
  const width = options.width ?? APPLE_CANVAS_WIDTH
  const height = options.height ?? APPLE_CANVAS_HEIGHT
  const radius = options.radius

  drawAppleImpl(ctx, {
    ...options,
    cx: width / 2,
    cy: height / 2 + APPLE_CENTER_OFFSET_Y,
    radius,
  })
}

/** 清空画布并绘制苹果（常用于组件内部） */
export function paintAppleScene(
  ctx: CanvasRenderingContext2D,
  options: Omit<DrawAppleOptions, 'cx' | 'cy'> & {
    width: number
    height: number
    background?: string
  },
): void {
  const { width, height, background = '#ffffff' } = options

  ctx.clearRect(0, 0, width, height)
  if (background !== 'transparent') {
    ctx.fillStyle = background
    ctx.fillRect(0, 0, width, height)
  }

  drawAppleCentered(ctx, options)
}
