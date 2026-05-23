/** Seeded 2D hash noise for procedural apple skin (deterministic). */
export function hash2D(x: number, y: number, seed: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7 + seed * 17.13) * 43758.5453
  return n - Math.floor(n)
}

export function smoothNoise(x: number, y: number, seed: number): number {
  const ix = Math.floor(x)
  const iy = Math.floor(y)
  const fx = x - ix
  const fy = y - iy
  const ux = fx * fx * (3 - 2 * fx)
  const uy = fy * fy * (3 - 2 * fy)

  const a = hash2D(ix, iy, seed)
  const b = hash2D(ix + 1, iy, seed)
  const c = hash2D(ix, iy + 1, seed)
  const d = hash2D(ix + 1, iy + 1, seed)

  return a * (1 - ux) * (1 - uy) + b * ux * (1 - uy) + c * (1 - ux) * uy + d * ux * uy
}

export function fbm(x: number, y: number, seed: number, octaves = 4): number {
  let sum = 0
  let amp = 0.5
  let freq = 1
  for (let i = 0; i < octaves; i++) {
    sum += amp * smoothNoise(x * freq, y * freq, seed + i * 19.7)
    amp *= 0.5
    freq *= 2.1
  }
  return sum
}
