import type { ShapePalette } from './types'

type Point2 = { x: number; y: number }

function edgeKey(a: Point2, b: Point2): string {
  const ax = Math.round(a.x * 10)
  const ay = Math.round(a.y * 10)
  const bx = Math.round(b.x * 10)
  const by = Math.round(b.y * 10)
  if (ax < bx || (ax === bx && ay < by)) {
    return `${ax},${ay}|${bx},${by}`
  }
  return `${bx},${by}|${ax},${ay}`
}

/** 仅描边出现一次的外轮廓（避免背面与共享边伪影） */
export function strokeSilhouetteEdges(
  ctx: CanvasRenderingContext2D,
  faces: { projected: Point2[] }[],
  palette: ShapePalette,
  originX: number,
  originY: number,
): void {
  const edgeCount = new Map<string, number>()

  for (const face of faces) {
    const pts = face.projected
    for (let i = 0; i < pts.length; i++) {
      const key = edgeKey(pts[i], pts[(i + 1) % pts.length])
      edgeCount.set(key, (edgeCount.get(key) ?? 0) + 1)
    }
  }

  ctx.strokeStyle = palette.edge
  ctx.lineWidth = 1.25
  ctx.lineJoin = 'round'

  for (const [key, count] of edgeCount) {
    if (count !== 1) continue
    const [p0s, p1s] = key.split('|')
    const [x0, y0] = p0s.split(',').map(Number)
    const [x1, y1] = p1s.split(',').map(Number)
    ctx.beginPath()
    ctx.moveTo(x0 / 10 - originX, y0 / 10 - originY)
    ctx.lineTo(x1 / 10 - originX, y1 / 10 - originY)
    ctx.stroke()
  }
}
