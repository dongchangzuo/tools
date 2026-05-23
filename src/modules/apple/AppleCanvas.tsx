import { useEffect, useRef } from 'react'
import './apple.css'
import {
  APPLE_CANVAS_HEIGHT,
  APPLE_CANVAS_WIDTH,
  APPLE_DEFAULT_RADIUS,
} from './geometry'
import { paintAppleScene } from './drawApple'
import type { DrawAppleOptions } from './types'

export type AppleCanvasProps = {
  /** 画布逻辑宽度 */
  width?: number
  /** 画布逻辑高度 */
  height?: number
  /** 苹果半径 */
  radius?: number
  rotation?: number
  palette?: DrawAppleOptions['palette']
  /** 画布背景色，默认透明 */
  background?: string
  className?: string
  'aria-label'?: string
}

function applyDevicePixelRatio(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
): void {
  const dpr = Math.min(window.devicePixelRatio || 1, 3)
  canvas.width = Math.round(width * dpr)
  canvas.height = Math.round(height * dpr)
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
}

export function AppleCanvas({
  width = APPLE_CANVAS_WIDTH,
  height = APPLE_CANVAS_HEIGHT,
  radius = APPLE_DEFAULT_RADIUS,
  rotation = 0,
  palette,
  background = '#ffffff',
  className,
  'aria-label': ariaLabel = '苹果',
}: AppleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    applyDevicePixelRatio(canvas, ctx, width, height)
    paintAppleScene(ctx, {
      width,
      height,
      radius,
      rotation,
      palette,
      background,
    })
  }, [width, height, radius, rotation, palette, background])

  return (
    <canvas
      ref={canvasRef}
      className={className ?? 'apple-canvas'}
      width={width}
      height={height}
      role="img"
      aria-label={ariaLabel}
    />
  )
}
