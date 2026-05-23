import {
  DEFAULT_SHAPE_PALETTE,
  drawGroundShadow,
  faceDepth,
  faceShade,
  isFaceVisible,
  linearGradientForFace,
  paintShapeScene,
  projectVec3,
  strokeSilhouetteEdges,
  type ShapeDrawOptions,
  type ShapePalette,
  type Vec3,
} from '../shape3d-core'

function resolvePalette(partial?: Partial<ShapePalette>): ShapePalette {
  return { ...DEFAULT_SHAPE_PALETTE, ...partial }
}

function pyramidVertices(size: number): { verts: Vec3[]; faces: { indices: number[]; normal: Vec3 }[] } {
  const half = size / 2
  const apexY = half * 1.15
  const baseY = -half * 0.85
  const r = size * 0.55

  const v0: Vec3 = { x: 0, y: baseY, z: -r }
  const v1: Vec3 = { x: r * 0.866, y: baseY, z: r * 0.5 }
  const v2: Vec3 = { x: -r * 0.866, y: baseY, z: r * 0.5 }
  const apex: Vec3 = { x: 0, y: apexY, z: 0 }

  const verts = [v0, v1, v2, apex]

  const sideNormal = (a: Vec3, b: Vec3, c: Vec3): Vec3 => {
    const ux = b.x - a.x
    const uy = b.y - a.y
    const uz = b.z - a.z
    const vx = c.x - a.x
    const vy = c.y - a.y
    const vz = c.z - a.z
    return {
      x: uy * vz - uz * vy,
      y: uz * vx - ux * vz,
      z: ux * vy - uy * vx,
    }
  }

  return {
    verts,
    faces: [
      { indices: [0, 1, 3], normal: sideNormal(v0, v1, apex) },
      { indices: [1, 2, 3], normal: sideNormal(v1, v2, apex) },
      { indices: [2, 0, 3], normal: sideNormal(v2, v0, apex) },
      { indices: [0, 2, 1], normal: { x: 0, y: -1, z: 0 } },
    ],
  }
}

function drawTriangleFace(
  ctx: CanvasRenderingContext2D,
  points: { x: number; y: number }[],
  normal: Vec3,
  palette: ShapePalette,
): void {
  const shade = faceShade(normal)
  const p0 = points[0]
  const p1 = points[1]

  ctx.beginPath()
  ctx.moveTo(points[0].x, points[0].y)
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y)
  }
  ctx.closePath()

  ctx.fillStyle = linearGradientForFace(ctx, p0, p1, shade, palette)
  ctx.fill()
}

export function drawPyramid(
  ctx: CanvasRenderingContext2D,
  options: ShapeDrawOptions,
): void {
  const { cx, cy, size, rotationY = 0, palette: partial } = options
  const palette = resolvePalette(partial)
  const { verts, faces } = pyramidVertices(size)

  const sorted = faces
    .filter((face) => isFaceVisible(face.normal, rotationY))
    .map((face) => {
      const v3 = face.indices.map((i) => verts[i])
      const projected = v3.map((v) => {
        const p = projectVec3(v, 1, rotationY)
        return { x: cx + p.x, y: cy + p.y }
      })
      return {
        projected,
        normal: face.normal,
        depth: faceDepth(v3, rotationY),
      }
    })
    .sort((a, b) => a.depth - b.depth)

  drawGroundShadow(ctx, cx, cy + size * 0.48, size * 0.38, size * 0.12, palette)

  ctx.save()
  ctx.translate(cx, cy)
  for (const face of sorted) {
    const pts = face.projected.map((p) => ({ x: p.x - cx, y: p.y - cy }))
    drawTriangleFace(ctx, pts, face.normal, palette)
  }
  strokeSilhouetteEdges(ctx, sorted, palette, cx, cy)
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
        cy: height / 2 + size * 0.05,
      }),
  })
}
