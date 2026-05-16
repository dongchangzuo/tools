import { PIVOT_X, PIVOT_Y } from './balanceGeometry.ts'

export const EQUALS_CX = PIVOT_X
export const EQUALS_CY = PIVOT_Y - 36
export const CRACK_DURATION = 0.85

const BAR_W = 28
const BAR_H = 6
const TOP_BAR_Y = -10
const BOTTOM_BAR_Y = 4

type ShardDef = {
  points: [number, number][]
  driftX: number
  driftY: number
  rotate: number
}

function buildBarShards(barCenterY: number): ShardDef[] {
  const hw = BAR_W / 2
  const hh = BAR_H / 2
  const y0 = barCenterY - hh
  const y1 = barCenterY + hh
  const splits = [-6, 0, 6]

  const shards: ShardDef[] = []
  const edges = [-hw, ...splits, hw]

  const drifts: [number, number, number][] = [
    [-7, -3, -0.12],
    [-2, -1, 0.06],
    [2, 1, -0.05],
    [7, 3, 0.11],
  ]

  for (let i = 0; i < 4; i++) {
    const x0 = edges[i]!
    const x1 = edges[i + 1]!
    const [dx, dy, rot] = drifts[i]!
    shards.push({
      points: [
        [x0, y0],
        [x1, y0],
        [x1, y1],
        [x0, y1],
      ],
      driftX: dx,
      driftY: dy,
      rotate: rot,
    })
  }

  return shards
}

const TOP_SHARDS = buildBarShards(TOP_BAR_Y)
const BOTTOM_SHARDS = buildBarShards(BOTTOM_BAR_Y)

export function getCrackProgress(flashPhase: number): number {
  const t = Math.min(Math.max(flashPhase / CRACK_DURATION, 0), 1)
  return 1 - (1 - t) ** 3
}

function getMoveAmount(progress: number): number {
  if (progress < 0.15) return 0
  if (progress >= 0.75) return 1
  return (progress - 0.15) / 0.6
}

function getCrackLineOpacity(progress: number): number {
  if (progress >= 0.15) return Math.max(0, 1 - (progress - 0.15) / 0.2)
  return progress / 0.15
}

function drawPolygon(
  ctx: CanvasRenderingContext2D,
  points: [number, number][],
): void {
  if (points.length === 0) return
  ctx.beginPath()
  const [fx, fy] = points[0]!
  ctx.moveTo(fx, fy)
  for (let i = 1; i < points.length; i++) {
    const [x, y] = points[i]!
    ctx.lineTo(x, y)
  }
  ctx.closePath()
}

function drawShard(
  ctx: CanvasRenderingContext2D,
  shard: ShardDef,
  moveT: number,
  tiltRad: number,
  fill: string,
  stroke: string,
): void {
  const offset = moveT
  const x = EQUALS_CX + shard.driftX * offset
  const y = EQUALS_CY + shard.driftY * offset
  const rot = shard.rotate * offset + tiltRad * 0.35 * offset

  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rot)
  drawPolygon(ctx, shard.points)
  ctx.fillStyle = fill
  ctx.fill()
  ctx.strokeStyle = stroke
  ctx.lineWidth = 1
  ctx.stroke()
  ctx.restore()
}

function drawIntactBars(
  ctx: CanvasRenderingContext2D,
  fill: string,
  stroke: string,
): void {
  const bars = [TOP_BAR_Y, BOTTOM_BAR_Y]
  const hw = BAR_W / 2
  const hh = BAR_H / 2

  for (const cy of bars) {
    ctx.save()
    ctx.translate(EQUALS_CX, EQUALS_CY + cy)
    ctx.beginPath()
    ctx.roundRect(-hw, -hh, BAR_W, BAR_H, 2)
    ctx.fillStyle = fill
    ctx.fill()
    ctx.strokeStyle = stroke
    ctx.lineWidth = 1
    ctx.stroke()
    ctx.restore()
  }
}

function drawCrackLines(ctx: CanvasRenderingContext2D, opacity: number): void {
  if (opacity <= 0) return

  ctx.save()
  ctx.strokeStyle = `rgba(80, 20, 20, ${0.85 * opacity})`
  ctx.lineWidth = 1.5
  ctx.lineCap = 'round'

  const cracks: [number, number, number, number][] = [
    [EQUALS_CX - 8, EQUALS_CY + TOP_BAR_Y - 2, EQUALS_CX + 2, EQUALS_CY + TOP_BAR_Y + 3],
    [EQUALS_CX + 4, EQUALS_CY + TOP_BAR_Y - 3, EQUALS_CX + 10, EQUALS_CY + TOP_BAR_Y + 2],
    [EQUALS_CX - 6, EQUALS_CY + BOTTOM_BAR_Y - 1, EQUALS_CX + 3, EQUALS_CY + BOTTOM_BAR_Y + 2],
    [EQUALS_CX + 1, EQUALS_CY + BOTTOM_BAR_Y - 2, EQUALS_CX + 9, EQUALS_CY + BOTTOM_BAR_Y + 1],
  ]

  for (const [x1, y1, x2, y2] of cracks) {
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
  }

  ctx.restore()
}

export function drawCrackedEquals(
  ctx: CanvasRenderingContext2D,
  flashPhase: number,
  tiltRad: number,
  color: string,
  alpha: number,
): void {
  const progress = getCrackProgress(flashPhase)
  const moveT = getMoveAmount(progress)
  const crackOpacity = getCrackLineOpacity(progress)
  const stroke = '#7f1d1d'

  ctx.save()
  ctx.globalAlpha = alpha

  if (moveT < 0.02) {
    drawIntactBars(ctx, color, stroke)
    drawCrackLines(ctx, crackOpacity)
  } else {
    for (const shard of TOP_SHARDS) {
      drawShard(ctx, shard, moveT, tiltRad, color, stroke)
    }
    for (const shard of BOTTOM_SHARDS) {
      drawShard(ctx, shard, moveT, -tiltRad, color, stroke)
    }
    if (crackOpacity > 0 && moveT < 1) {
      drawCrackLines(ctx, crackOpacity * (1 - moveT))
    }
  }

  ctx.restore()
}
