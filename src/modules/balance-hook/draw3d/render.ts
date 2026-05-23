import { meanDepth, projectPoint } from './camera'
import type { Face, Vec3 } from './mesh'

export type Stroke3D = {
  a: Vec3
  b: Vec3
  color: string
  width: number
}

export function renderScene(
  ctx: CanvasRenderingContext2D,
  faces: Face[],
  strokes: Stroke3D[],
): void {
  const drawFaces = faces.map((f) => {
    const screen = f.verts.map((v) => projectPoint(v))
    return {
      screen,
      fill: f.fill,
      stroke: f.stroke,
      depth: meanDepth(screen),
    }
  })

  drawFaces.sort((a, b) => a.depth - b.depth)

  for (const f of drawFaces) {
    ctx.beginPath()
    f.screen.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y)
      else ctx.lineTo(p.x, p.y)
    })
    ctx.closePath()
    ctx.fillStyle = f.fill
    ctx.fill()
    if (f.stroke) {
      ctx.strokeStyle = f.stroke
      ctx.lineWidth = 1
      ctx.stroke()
    }
  }

  const strokeDepth = (s: Stroke3D) =>
    projectPoint(s.a).depth + projectPoint(s.b).depth
  const sorted = [...strokes].sort((a, b) => strokeDepth(a) - strokeDepth(b))

  for (const s of sorted) {
    const a = projectPoint(s.a)
    const b = projectPoint(s.b)
    ctx.strokeStyle = s.color
    ctx.lineWidth = s.width
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    ctx.moveTo(a.x, a.y)
    ctx.lineTo(b.x, b.y)
    ctx.stroke()
  }
}
