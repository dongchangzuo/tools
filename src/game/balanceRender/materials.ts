import { fbm, hash2D } from './noise.ts'

const VISUAL_SEED = 4242

type PatternCache = {
  ctx: CanvasRenderingContext2D
  wood: CanvasPattern | null
  metal: CanvasPattern | null
}

let cache: PatternCache | null = null

function getCache(ctx: CanvasRenderingContext2D): PatternCache {
  if (cache && cache.ctx === ctx) return cache
  cache = { ctx, wood: null, metal: null }
  return cache
}

export function createWoodGrainPattern(ctx: CanvasRenderingContext2D): CanvasPattern {
  const c = getCache(ctx)
  if (c.wood) return c.wood

  const size = 128
  const off = document.createElement('canvas')
  off.width = size
  off.height = size
  const o = off.getContext('2d')!

  o.fillStyle = '#c9a06a'
  o.fillRect(0, 0, size, size)

  for (let y = 0; y < size; y++) {
    const t = y / size
    const wave = Math.sin(y * 0.22 + fbm(0, y * 0.04, VISUAL_SEED) * 3) * 2
    o.strokeStyle = `rgba(70, 45, 28, ${0.06 + t * 0.05})`
    o.lineWidth = 1
    o.beginPath()
    o.moveTo(0, y + wave)
    o.lineTo(size, y + wave * 0.7 + fbm(size * 0.01, y * 0.02, VISUAL_SEED + 1) * 1.5)
    o.stroke()
  }

  for (let i = 0; i < 600; i++) {
    const px = hash2D(i, 0, VISUAL_SEED) * size
    const py = hash2D(0, i, VISUAL_SEED + 2) * size
    const bright = hash2D(i, i, VISUAL_SEED + 3) > 0.5
    o.fillStyle = bright
      ? `rgba(255,240,210,${0.02 + hash2D(i, i + 1, VISUAL_SEED) * 0.04})`
      : `rgba(50,30,18,${0.02 + hash2D(i + 1, i, VISUAL_SEED) * 0.03})`
    o.fillRect(px, py, 1, 1)
  }

  c.wood = ctx.createPattern(off, 'repeat')!
  return c.wood
}

export function createBrushedMetalPattern(ctx: CanvasRenderingContext2D): CanvasPattern {
  const c = getCache(ctx)
  if (c.metal) return c.metal

  const size = 64
  const off = document.createElement('canvas')
  off.width = size
  off.height = size
  const o = off.getContext('2d')!

  o.fillStyle = '#8a929c'
  o.fillRect(0, 0, size, size)

  for (let x = 0; x < size; x += 1) {
    const n = fbm(x * 0.15, 0, VISUAL_SEED + 10, 2)
    o.strokeStyle = `rgba(255,255,255,${0.03 + n * 0.04})`
    o.lineWidth = 1
    o.beginPath()
    o.moveTo(x, 0)
    o.lineTo(x + (hash2D(x, 1, VISUAL_SEED) - 0.5) * 0.5, size)
    o.stroke()
  }

  c.metal = ctx.createPattern(off, 'repeat')!
  return c.metal
}

export function drawFrostedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  const g = ctx.createLinearGradient(x, y, x + w, y + h)
  g.addColorStop(0, 'rgba(200,205,212,0.95)')
  g.addColorStop(0.5, 'rgba(140,148,158,0.92)')
  g.addColorStop(1, 'rgba(90,98,108,0.95)')
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, r)
  ctx.fill()

  for (let i = 0; i < 80; i++) {
    const px = x + hash2D(i, 2, VISUAL_SEED + 20) * w
    const py = y + hash2D(2, i, VISUAL_SEED + 21) * h
    ctx.fillStyle = `rgba(255,255,255,${0.02 + hash2D(i, i, VISUAL_SEED + 22) * 0.05})`
    ctx.fillRect(px, py, 1, 1)
  }
}
