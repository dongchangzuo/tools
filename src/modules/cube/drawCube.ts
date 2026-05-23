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

type FaceDef = {
  indices: number[]
  normal: Vec3
}

function cubeVertices(half: number): Vec3[] {
  return [
    { x: -half, y: -half, z: -half },
    { x: half, y: -half, z: -half },
    { x: half, y: -half, z: half },
    { x: -half, y: -half, z: half },
    { x: -half, y: half, z: -half },
    { x: half, y: half, z: -half },
    { x: half, y: half, z: half },
    { x: -half, y: half, z: half },
  ]
}

const CUBE_FACES: FaceDef[] = [
  { indices: [0, 1, 2, 3], normal: { x: 0, y: -1, z: 0 } },
  { indices: [7, 6, 5, 4], normal: { x: 0, y: 1, z: 0 } },
  { indices: [3, 2, 6, 7], normal: { x: 0, y: 0, z: 1 } },
  { indices: [1, 0, 4, 5], normal: { x: 0, y: 0, z: -1 } },
  { indices: [2, 1, 5, 6], normal: { x: 1, y: 0, z: 0 } },
  { indices: [0, 3, 7, 4], normal: { x: -1, y: 0, z: 0 } },
]

function drawFace(
  ctx: CanvasRenderingContext2D,
  points: { x: number; y: number }[],
  normal: Vec3,
  palette: ShapePalette,
): void {
  const shade = faceShade(normal)
  const p0 = points[0]
  const p1 = points[2] ?? points[1]

  ctx.beginPath()
  ctx.moveTo(points[0].x, points[0].y)
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y)
  }
  ctx.closePath()

  ctx.fillStyle = linearGradientForFace(ctx, p0, p1, shade, palette)
  ctx.fill()
}

export function drawCube(
  ctx: CanvasRenderingContext2D,
  options: ShapeDrawOptions,
): void {
  const { cx, cy, size, rotationY = 0, palette: partial } = options
  const palette = resolvePalette(partial)
  const half = size / 2
  const verts = cubeVertices(half)
  const scale = 1

  const faces = CUBE_FACES.filter((face) =>
    isFaceVisible(face.normal, rotationY),
  )
    .map((face) => {
      const v3 = face.indices.map((i) => verts[i])
      const projected = v3.map((v) => {
        const p = projectVec3(v, scale, rotationY)
        return { x: cx + p.x, y: cy + p.y }
      })
      return {
        projected,
        normal: face.normal,
        depth: faceDepth(v3, rotationY),
      }
    })
    .sort((a, b) => a.depth - b.depth)

  drawGroundShadow(ctx, cx, cy + size * 0.52, size * 0.42, size * 0.14, palette)

  ctx.save()
  ctx.translate(cx, cy)
  for (const face of faces) {
    const pts = face.projected.map((p) => ({
      x: p.x - cx,
      y: p.y - cy,
    }))
    drawFace(ctx, pts, face.normal, palette)
  }
  strokeSilhouetteEdges(ctx, faces, palette, cx, cy)
  ctx.restore()
}

export function paintCubeScene(
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
      drawCube(ctx, {
        ...drawOpts,
        cx: width / 2,
        cy: height / 2 + drawOpts.size * 0.06,
      }),
  })
}
