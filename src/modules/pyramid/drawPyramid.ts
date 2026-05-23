import {
  DEFAULT_SHAPE_PALETTE,
  drawGroundShadow,
  faceShade,
  paintShapeScene,
  strokeVisibleFaceEdges,
  type ShapeDrawOptions,
  type ShapePalette,
  type Vec3,
} from '../shape3d-core'

function resolvePalette(partial?: Partial<ShapePalette>): ShapePalette {
  return { ...DEFAULT_SHAPE_PALETTE, ...partial }
}

function subtract(a: Vec3, b: Vec3): Vec3 {
  return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z }
}

function cross(a: Vec3, b: Vec3): Vec3 {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  }
}

/** 正面观察（+z 方向），法线 z 分量须朝观察者 */
function frontFaceNormal(a: Vec3, b: Vec3, c: Vec3): Vec3 {
  const ab = subtract(b, a)
  const ac = subtract(c, a)
  let n = cross(ab, ac)
  if (n.z < 0) {
    n = { x: -n.x, y: -n.y, z: -n.z }
  }
  return n
}

/** 正面正交投影：screenX = x，screenY = -y（中间棱竖直、左右对称） */
function projectFront(v: Vec3, scale: number): { x: number; y: number } {
  return { x: v.x * scale, y: -v.y * scale }
}

function isFaceVisibleFront(normal: Vec3): boolean {
  return normal.z > 0.001
}

function faceDepthFront(verts: Vec3[]): number {
  let sum = 0
  for (const v of verts) sum += v.z
  return sum / verts.length
}

/**
 * 正面图三棱锥：
 * - 锥顶在正中上方，中棱竖直
 * - 前底边 v0–v1 水平；v2 在底边下方，使中棱与侧棱在底部呈锐角
 */
function pyramidVertices(size: number): { verts: Vec3[]; faces: { indices: number[]; normal: Vec3 }[] } {
  const half = size / 2
  const apexY = half * 0.95
  const baseY = -half * 0.78
  const halfBase = size * 0.44
  const backZ = -size * 0.28
  const baseDrop = size * 0.24

  const apex: Vec3 = { x: 0, y: apexY, z: 0 }
  const v0: Vec3 = { x: -halfBase, y: baseY, z: 0 }
  const v1: Vec3 = { x: halfBase, y: baseY, z: 0 }
  const v2: Vec3 = { x: 0, y: baseY - baseDrop, z: backZ }

  const verts = [v0, v1, v2, apex]

  return {
    verts,
    faces: [
      { indices: [3, 0, 2], normal: frontFaceNormal(apex, v0, v2) },
      { indices: [3, 2, 1], normal: frontFaceNormal(apex, v2, v1) },
      { indices: [0, 1, 2], normal: frontFaceNormal(v0, v1, v2) },
    ],
  }
}

function triangleFaceGradient(
  ctx: CanvasRenderingContext2D,
  points: { x: number; y: number }[],
  shade: number,
  palette: ShapePalette,
): CanvasGradient {
  const xs = points.map((p) => p.x)
  const ys = points.map((p) => p.y)
  const gx = (Math.min(...xs) + Math.max(...xs)) / 2
  const gy0 = Math.min(...ys)
  const gy1 = Math.max(...ys)

  const grad = ctx.createLinearGradient(gx, gy0, gx, gy1)

  if (shade >= 0.62) {
    grad.addColorStop(0, palette.faceLight)
    grad.addColorStop(0.5, palette.faceMid)
    grad.addColorStop(1, palette.faceMid)
  } else if (shade >= 0.42) {
    grad.addColorStop(0, palette.faceMid)
    grad.addColorStop(1, palette.faceDark)
  } else {
    grad.addColorStop(0, palette.faceMid)
    grad.addColorStop(1, palette.faceDeep)
  }

  return grad
}

function drawTriangleFace(
  ctx: CanvasRenderingContext2D,
  points: { x: number; y: number }[],
  normal: Vec3,
  palette: ShapePalette,
): void {
  const shade = faceShade(normal)

  ctx.beginPath()
  ctx.moveTo(points[0].x, points[0].y)
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y)
  }
  ctx.closePath()

  ctx.fillStyle = triangleFaceGradient(ctx, points, shade, palette)
  ctx.fill()
}

export function drawPyramid(
  ctx: CanvasRenderingContext2D,
  options: ShapeDrawOptions,
): void {
  const { cx, cy, size, palette: partial } = options
  const palette = resolvePalette(partial)
  const scale = 1
  const { verts, faces } = pyramidVertices(size)

  const sorted = faces
    .filter((face) => isFaceVisibleFront(face.normal))
    .map((face) => {
      const v3 = face.indices.map((i) => verts[i])
      const projected = v3.map((v) => {
        const p = projectFront(v, scale)
        return { x: cx + p.x, y: cy + p.y }
      })
      return {
        projected,
        normal: face.normal,
        depth: faceDepthFront(v3),
      }
    })
    .sort((a, b) => a.depth - b.depth)

  const baseProj = verts.slice(0, 3).map((v) => projectFront(v, scale))
  const footY = Math.max(...baseProj.map((p) => p.y))
  const footX = baseProj.reduce((s, p) => s + p.x, 0) / baseProj.length

  drawGroundShadow(ctx, cx + footX, cy + footY + 3, size * 0.42, size * 0.11, palette)

  ctx.save()
  ctx.translate(cx, cy)
  for (const face of sorted) {
    const pts = face.projected.map((p) => ({ x: p.x - cx, y: p.y - cy }))
    drawTriangleFace(ctx, pts, face.normal, palette)
  }
  strokeVisibleFaceEdges(ctx, sorted, palette, cx, cy)
  ctx.restore()
}

export function paintPyramidScene(
  ctx: CanvasRenderingContext2D,
  options: ShapeDrawOptions & {
    width: number
    height: number
    background?: string
  },
): void {
  const { width, height, background, size, ...rest } = options
  paintShapeScene(ctx, {
    width,
    height,
    background,
    draw: () =>
      drawPyramid(ctx, {
        ...rest,
        size,
        cx: width / 2,
        cy: height / 2 + size * 0.06,
      }),
  })
}
