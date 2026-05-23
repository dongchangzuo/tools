import { useCallback, useEffect, useRef } from 'react'
import { applyDevicePixelRatio } from '../shape3d-core'
import { paintHookBalanceScene } from './draw/compose'
import { BALANCE_HEIGHT, BALANCE_WIDTH, hitTestHook } from './geometry'
import type {
  DrawHookBalanceOptions,
  HookBalanceLayout,
  HookBalancePalette,
  HookSide,
  PaintSideCallback,
} from './types'
import './balance-hook.css'

export type HookBalanceCanvasProps = DrawHookBalanceOptions & {
  width?: number
  height?: number
  background?: string
  palette?: Partial<HookBalancePalette>
  className?: string
  'aria-label'?: string
  onLayout?: (layout: HookBalanceLayout) => void
  onSelectSide?: (side: HookSide) => void
  onPaintSide?: PaintSideCallback
}

export function HookBalanceCanvas({
  width = BALANCE_WIDTH,
  height = BALANCE_HEIGHT,
  background = '#e8ecf2',
  palette,
  className,
  'aria-label': ariaLabel = '挂钩天平',
  tiltRad = 0,
  equalsVariant = 'hidden',
  flashPhase = 0,
  animTime = 0,
  onLayout,
  onSelectSide,
  onPaintSide,
}: HookBalanceCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const propsRef = useRef({
    width,
    height,
    background,
    palette,
    tiltRad,
    equalsVariant,
    flashPhase,
    animTime,
    onPaintSide,
  })

  propsRef.current = {
    width,
    height,
    background,
    palette,
    tiltRad,
    equalsVariant,
    flashPhase,
    animTime,
    onPaintSide,
  }

  const paint = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const p = propsRef.current
    applyDevicePixelRatio(canvas, ctx, p.width, p.height)

    const anchors = paintHookBalanceScene(ctx, {
      width: p.width,
      height: p.height,
      background: p.background,
      palette: p.palette,
      tiltRad: p.tiltRad,
      equalsVariant: p.equalsVariant,
      flashPhase: p.flashPhase,
      animTime: p.animTime,
      onPaintSide: p.onPaintSide,
    })

    onLayout?.({
      width: p.width,
      height: p.height,
      left: anchors[0]!,
      right: anchors[1]!,
    })
  }, [onLayout])

  useEffect(() => {
    paint()
  }, [
    paint,
    width,
    height,
    background,
    palette,
    tiltRad,
    equalsVariant,
    flashPhase,
    animTime,
    onPaintSide,
  ])

  const handlePointer = (clientX: number, clientY: number) => {
    if (!onSelectSide) return
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const scaleX = BALANCE_WIDTH / (rect.width || 1)
    const scaleY = BALANCE_HEIGHT / (rect.height || 1)
    const x = (clientX - rect.left) * scaleX
    const y = (clientY - rect.top) * scaleY
    const side = hitTestHook(x, y, propsRef.current.tiltRad)
    if (side) onSelectSide(side)
  }

  return (
    <canvas
      ref={canvasRef}
      className={className ?? 'hook-balance-canvas'}
      width={width}
      height={height}
      role="img"
      aria-label={ariaLabel}
      onPointerDown={(e) => handlePointer(e.clientX, e.clientY)}
    />
  )
}
