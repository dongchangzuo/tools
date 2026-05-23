import {
  DEFAULT_SHAPE_PALETTE,
  drawGroundShadow,
  paintShapeScene,
  projectVec3,
  rotateY,
  type ShapeDrawOptions,
  type ShapePalette,
} from '../shape3d-core'

function resolvePalette(partial?: Partial<ShapePalette>): ShapePalette {
  return { ...DEFAULT_SHAPE_PALETTE, ...partial }
}

const SEGMENTS = 64

type ScreenPt = { x: number; y: number; depth: number }

function projectRing(
  cx: number,
  cy: number,
  y: number,
  radius: number,
  rotationY: number,
): ScreenPt[] {
  const pts: ScreenPt[] = []
  for (let i = 0; i < SEGMENTS; i++) {
    const t = (i / SEGMENTS) * Math.PI * 2
    const x = Math.cos(t) * radius
    const z = Math.sin(t) * radius
    const rotated = rotateY({ x, y, z }, rotationY)
    const p = projectVec3({ x, y, z }, 1, rotationY)
    pts.push({
      x: cx + p.x,
      y: cy + p.y,
      depth: rotated.x + rotated.z,
    })
  }
  return pts
}

function traceEllipse(ctx: CanvasRenderingContext2D, pts: ScreenPt[]): void {
  ctx.beginPath()
  pts.forEach((p, i) => {
    if (i === 0) ctx.moveTo(p.x, p.y)
    else ctx.lineTo(p.x, p.y)
  })
  ctx.closePath()
}

function extremumIndices(pts: ScreenPt[]): { left: number; right: number } {
  let left = 0
  let right = 0
  for (let i = 1; i < pts.length; i++) {
    if (pts[i].x < pts[left].x) left = i
    if (pts[i].x > pts[right].x) right = i
  }
  return { left, right }
}

function arcIndices(from: number, to: number, count: number, forward: boolean): number[] {
  const out: number[] = []
  let i = from
  while (i !== to) {
    out.push(i)
    i = forward ? (i + 1) % count : (i - 1 + count) % count
  }
  out.push(to)
  return out
}

function meanDepth(pts: ScreenPt[], indices: number[]): number {
  let sum = 0
  for (const idx of indices) sum += pts[idx].depth
  return sum / indices.length
}

function frontArc(pts: ScreenPt[], left: number, right: number): number[] {
  const fwd = arcIndices(left, right, pts.length, true)
  const bwd = arcIndices(left, right, pts.length, false)
  return meanDepth(pts, fwd) >= meanDepth(pts, bwd) ? fwd : bwd
}

function traceArc(ctx: CanvasRenderingContext2D, pts: ScreenPt[], indices: number[]): void {
  const first = pts[indices[0]]
  ctx.moveTo(first.x, first.y)
  for (let k = 1; k < indices.length; k++) {
    const p = pts[indices[k]]
    ctx.lineTo(p.x, p.y)
  }
}

function ringYRange(pts: ScreenPt[]): { minY: number; maxY: number } {
  let minY = pts[0].y
  let maxY = pts[0].y
  for (let i = 1; i < pts.length; i++) {
    if (pts[i].y < minY) minY = pts[i].y
    if (pts[i].y > maxY) maxY = pts[i].y
  }
  return { minY, maxY }
}

/** 顶/底盖统一线性渐变（与底面一致） */
function fillCap(
  ctx: CanvasRenderingContext2D,
  pts: ScreenPt[],
  palette: ShapePalette,
): void {
  const cx = pts.reduce((s, p) => s + p.x, 0) / pts.length
  const { minY, maxY } = ringYRange(pts)
  traceEllipse(ctx, pts)
  const grad = ctx.createLinearGradient(cx, minY, cx, maxY)
  grad.addColorStop(0, palette.faceMid)
  grad.addColorStop(1, palette.faceDeep)
  ctx.fillStyle = grad
  ctx.fill()
}

export function drawCylinder(
  ctx: CanvasRenderingContext2D,
  options: ShapeDrawOptions,
): void {
  const { cx, cy, size, rotationY = 0, palette: partial } = options
  const palette = resolvePalette(partial)
  const r = size * 0.38
  const h = size * 0.95
  const topY = -h / 2
  const bottomY = h / 2

  const top = projectRing(cx, cy, topY, r, rotationY)
  const bottom = projectRing(cx, cy, bottomY, r, rotationY)

  const topExt = extremumIndices(top)
  const bottomExt = extremumIndices(bottom)

  const lb = bottom[bottomExt.left]
  const rb = bottom[bottomExt.right]
  const lt = top[topExt.left]
  const rt = top[topExt.right]

  const bottomFront = frontArc(bottom, bottomExt.left, bottomExt.right)

  drawGroundShadow(ctx, cx, cy + h * 0.55, r * 0.95, r * 0.28, palette)

  ctx.save()

  // 1. 底面
  fillCap(ctx, bottom, palette)

  // 2. 侧面（梯形，稳定填充）
  ctx.beginPath()
  ctx.moveTo(lb.x, lb.y)
  ctx.lineTo(lt.x, lt.y)
  ctx.lineTo(rt.x, rt.y)
  ctx.lineTo(rb.x, rb.y)
  ctx.closePath()
  const sideGrad = ctx.createLinearGradient(lt.x, lt.y, rt.x, rt.y)
  sideGrad.addColorStop(0, palette.faceDark)
  sideGrad.addColorStop(0.45, palette.faceMid)
  sideGrad.addColorStop(0.55, palette.faceLight)
  sideGrad.addColorStop(1, palette.faceDark)
  ctx.fillStyle = sideGrad
  ctx.fill()

  // 3. 顶面（与底面同款渐变，最后绘制盖住侧面）
  fillCap(ctx, top, palette)

  ctx.strokeStyle = palette.edge
  ctx.lineWidth = 1.1
  ctx.lineJoin = 'round'

  // 不描顶面弧线（会在顶盖上形成横切线）
  ctx.beginPath()
  traceArc(ctx, bottom, bottomFront)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(lb.x, lb.y)
  ctx.lineTo(lt.x, lt.y)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(rb.x, rb.y)
  ctx.lineTo(rt.x, rt.y)
  ctx.stroke()

  ctx.restore()
}

export function paintCylinderScene(
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
      drawCylinder(ctx, {
        ...drawOpts,
        cx: width / 2,
        cy: height / 2,
      }),
  })
}
