import { useEffect, useRef } from 'react'
import type { ShapeDrawOptions } from './types'

export function applyDevicePixelRatio(
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

export type ShapeCanvasPaintOptions = ShapeDrawOptions & {
  width: number
  height: number
  background?: string
}

export function createShapeCanvas(config: {
  defaultWidth: number
  defaultHeight: number
  defaultSize: number
  className: string
  defaultAriaLabel: string
  paintScene: (
    ctx: CanvasRenderingContext2D,
    options: ShapeCanvasPaintOptions,
  ) => void
}) {
  return function ShapeCanvas({
    width = config.defaultWidth,
    height = config.defaultHeight,
    size = config.defaultSize,
    rotationY = 0,
    palette,
    background = '#ffffff',
    className,
    'aria-label': ariaLabel = config.defaultAriaLabel,
  }: {
    width?: number
    height?: number
    size?: number
    rotationY?: number
    palette?: ShapeDrawOptions['palette']
    background?: string
    className?: string
    'aria-label'?: string
  }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      applyDevicePixelRatio(canvas, ctx, width, height)
      config.paintScene(ctx, {
        width,
        height,
        cx: width / 2,
        cy: height / 2,
        size,
        rotationY,
        palette,
        background,
      })
    }, [width, height, size, rotationY, palette, background])

    return (
      <canvas
        ref={canvasRef}
        className={className ?? config.className}
        width={width}
        height={height}
        role="img"
        aria-label={ariaLabel}
      />
    )
  }
}
