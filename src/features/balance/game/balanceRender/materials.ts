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

  const imageData = o.getImageData(0, 0, size, size)
  const data = imageData.data
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const n = fbm(x * 0.05, y * 0.12, VISUAL_SEED, 3)
      const grain = (n - 0.5) * 0.3
      const idx = (y * size + x) * 4
      data[idx] = Math.max(0, Math.min(255, data[idx] + grain * 200 + 15))
      data[idx + 1] = Math.max(0, Math.min(255, data[idx + 1] + grain * 160 + 10))
      data[idx + 2] = Math.max(0, Math.min(255, data[idx + 2] + grain * 120 + 5))
    }
  }
  o.putImageData(imageData, 0, 0)

  c.wood = ctx.createPattern(off, 'repeat')!
  return c.wood
}

export function createBrushedMetalPattern(ctx: CanvasRenderingContext2D): CanvasPattern {
  const c = getCache(ctx)
  if (c.metal) return c.metal

  const size = 128
  const off = document.createElement('canvas')
  off.width = size
  off.height = size
  const o = off.getContext('2d')!

  o.fillStyle = '#a0a0a0'
  o.fillRect(0, 0, size, size)

  const imageData = o.getImageData(0, 0, size, size)
  const data = imageData.data
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const n = hash2D(x * 0.3, y * 0.8, VISUAL_SEED + 7)
      const streak = (n - 0.5) * 0.15
      const idx = (y * size + x) * 4
      data[idx] = Math.max(0, Math.min(255, data[idx] + streak * 200))
      data[idx + 1] = Math.max(0, Math.min(255, data[idx + 1] + streak * 200))
      data[idx + 2] = Math.max(0, Math.min(255, data[idx + 2] + streak * 200))
    }
  }
  o.putImageData(imageData, 0, 0)

  c.metal = ctx.createPattern(off, 'repeat')!
  return c.metal
}
