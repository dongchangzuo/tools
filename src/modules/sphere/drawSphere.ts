import {
  DEFAULT_SHAPE_PALETTE,
  drawGroundShadow,
  paintShapeScene,
  type ShapeDrawOptions,
  type ShapePalette,
} from '../shape3d-core'

function resolvePalette(partial?: Partial<ShapePalette>): ShapePalette {
  return { ...DEFAULT_SHAPE_PALETTE, ...partial }
}

export function drawSphere(
  ctx: CanvasRenderingContext2D,
  options: ShapeDrawOptions,
): void {
  const { cx, cy, size, palette: partial } = options
  const palette = resolvePalette(partial)
  const r = size / 2

  drawGroundShadow(ctx, cx, cy + r * 0.92, r * 0.72, r * 0.22, palette)

  ctx.save()
  ctx.translate(cx, cy)

  const bodyGrad = ctx.createRadialGradient(
    -r * 0.35,
    -r * 0.4,
    r * 0.1,
    r * 0.08,
    r * 0.12,
    r * 1.08,
  )
  bodyGrad.addColorStop(0, palette.faceLight)
  bodyGrad.addColorStop(0.4, palette.faceMid)
  bodyGrad.addColorStop(0.78, palette.faceDark)
  bodyGrad.addColorStop(1, palette.faceDeep)

  ctx.beginPath()
  ctx.arc(0, 0, r, 0, Math.PI * 2)
  ctx.fillStyle = bodyGrad
  ctx.fill()

  ctx.save()
  ctx.beginPath()
  ctx.arc(0, 0, r, 0, Math.PI * 2)
  ctx.clip()

  const hl = ctx.createRadialGradient(
    -r * 0.42,
    -r * 0.48,
    0,
    -r * 0.15,
    -r * 0.2,
    r * 0.75,
  )
  hl.addColorStop(0, palette.highlight)
  hl.addColorStop(0.4, 'rgba(255, 255, 255, 0.15)')
  hl.addColorStop(1, 'rgba(255, 255, 255, 0)')
  ctx.fillStyle = hl
  ctx.fillRect(-r * 1.2, -r * 1.2, r * 2.4, r * 2.4)

  const rim = ctx.createRadialGradient(
    r * 0.35,
    r * 0.3,
    0,
    0,
    0,
    r * 1.05,
  )
  rim.addColorStop(0.7, 'rgba(0, 0, 0, 0)')
  rim.addColorStop(1, 'rgba(20, 30, 50, 0.35)')
  ctx.fillStyle = rim
  ctx.fillRect(-r * 1.2, -r * 1.2, r * 2.4, r * 2.4)

  ctx.restore()

  ctx.strokeStyle = palette.edge
  ctx.lineWidth = 1.1
  ctx.beginPath()
  ctx.arc(0, 0, r, 0, Math.PI * 2)
  ctx.stroke()

  ctx.restore()
}

export function paintSphereScene(
  ctx: CanvasRenderingContext2D,
  options: ShapeDrawOptions & {
    width: number
    height: number
    background?: string
  },
): void {
  const { width, height, background, ...drawOpts } = options
  paintShapeScene(ctx, {
    width,
    height,
    background,
    draw: () =>
      drawSphere(ctx, {
        ...drawOpts,
        cx: width / 2,
        cy: height / 2,
      }),
  })
}
