export type Vec3 = { x: number; y: number; z: number }

export type Face = {
  verts: Vec3[]
  fill: string
  stroke?: string
}

export function transformVerts(verts: Vec3[], fn: (v: Vec3) => Vec3): Vec3[] {
  return verts.map(fn)
}

export function rotateZ(v: Vec3, angle: number, origin: Vec3): Vec3 {
  if (angle === 0) return v
  const dx = v.x - origin.x
  const dy = v.y - origin.y
  const c = Math.cos(angle)
  const s = Math.sin(angle)
  return {
    x: origin.x + dx * c - dy * s,
    y: origin.y + dx * s + dy * c,
    z: v.z,
  }
}

export function shade(base: string, factor: number): string {
  const n = (h: string) => parseInt(h, 16)
  const r = Math.round(n(base.slice(1, 3)) * factor)
  const g = Math.round(n(base.slice(3, 5)) * factor)
  const b = Math.round(n(base.slice(5, 7)) * factor)
  const c = (v: number) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0')
  return `#${c(r)}${c(g)}${c(b)}`
}

export function boxFaces(
  cx: number,
  cy: number,
  cz: number,
  hw: number,
  hh: number,
  hd: number,
  base: string,
): Face[] {
  const x0 = cx - hw
  const x1 = cx + hw
  const y0 = cy - hh
  const y1 = cy + hh
  const z0 = cz - hd
  const z1 = cz + hd
  const corners: Vec3[] = [
    { x: x0, y: y0, z: z0 },
    { x: x1, y: y0, z: z0 },
    { x: x1, y: y1, z: z0 },
    { x: x0, y: y1, z: z0 },
    { x: x0, y: y0, z: z1 },
    { x: x1, y: y0, z: z1 },
    { x: x1, y: y1, z: z1 },
    { x: x0, y: y1, z: z1 },
  ]
  const quads: [number, number, number, number, number][] = [
    [0, 1, 2, 3, 0.88],
    [4, 5, 6, 7, 1.05],
    [0, 1, 5, 4, 0.95],
    [2, 3, 7, 6, 1.02],
    [0, 3, 7, 4, 0.82],
    [1, 2, 6, 5, 0.92],
  ]
  return quads.map(([a, b, c, d, f]) => ({
    verts: [corners[a]!, corners[b]!, corners[c]!, corners[d]!],
    fill: shade(base, f),
    stroke: 'rgba(35, 40, 48, 0.32)',
  }))
}

function ringPoint(cx: number, rimY: number, cz: number, r: number, yOff: number, t: number): Vec3 {
  return {
    x: cx + Math.sin(t) * r,
    y: rimY + yOff,
    z: cz + Math.cos(t) * r,
  }
}

/**
 * 浅碟：口沿在上（靠钩），盆底在下；绘制内腔朝观者，避免「倒扣罩子」感。
 */
export function lathePanFaces(
  cx: number,
  rimY: number,
  cz: number,
  rimR: number,
  depth: number,
  segments: number,
  base: string,
): Face[] {
  const profile = [
    { r: rimR, y: 0 },
    { r: rimR * 0.9, y: depth * 0.4 },
    { r: rimR * 0.68, y: depth },
  ]
  const faces: Face[] = []

  for (let ring = 0; ring < profile.length - 1; ring++) {
    const p0 = profile[ring]!
    const p1 = profile[ring + 1]!
    for (let i = 0; i < segments; i++) {
      const t0 = (i / segments) * Math.PI * 2
      const t1 = ((i + 1) / segments) * Math.PI * 2
      const v00 = ringPoint(cx, rimY, cz, p0.r, p0.y, t0)
      const v01 = ringPoint(cx, rimY, cz, p0.r, p0.y, t1)
      const v11 = ringPoint(cx, rimY, cz, p1.r, p1.y, t1)
      const v10 = ringPoint(cx, rimY, cz, p1.r, p1.y, t0)
      const f = 0.72 + ring * 0.1 + (Math.cos(t0) + 1) * 0.04
      faces.push({
        verts: [v00, v10, v11, v01],
        fill: shade(base, f),
        stroke: 'rgba(48, 38, 20, 0.15)',
      })
    }
  }

  const bottomR = profile[profile.length - 1]!.r
  const bottomY = profile[profile.length - 1]!.y
  const bottomCenter: Vec3 = { x: cx, y: rimY + bottomY, z: cz }
  for (let i = 0; i < segments; i++) {
    const t0 = (i / segments) * Math.PI * 2
    const t1 = ((i + 1) / segments) * Math.PI * 2
    const a = ringPoint(cx, rimY, cz, bottomR, bottomY, t0)
    const b = ringPoint(cx, rimY, cz, bottomR, bottomY, t1)
    faces.push({
      verts: [bottomCenter, b, a],
      fill: shade(base, 0.62),
    })
  }

  const lip = [
    { r: rimR * 1.03, y: -2.5 },
    { r: rimR, y: 0 },
  ]
  for (let ring = 0; ring < lip.length - 1; ring++) {
    const p0 = lip[ring]!
    const p1 = lip[ring + 1]!
    for (let i = 0; i < segments; i++) {
      const t0 = (i / segments) * Math.PI * 2
      const t1 = ((i + 1) / segments) * Math.PI * 2
      const v00 = ringPoint(cx, rimY, cz, p0.r, p0.y, t0)
      const v01 = ringPoint(cx, rimY, cz, p0.r, p0.y, t1)
      const v11 = ringPoint(cx, rimY, cz, p1.r, p1.y, t1)
      const v10 = ringPoint(cx, rimY, cz, p1.r, p1.y, t0)
      faces.push({
        verts: [v00, v01, v11, v10],
        fill: shade(base, 1.08),
        stroke: 'rgba(255, 248, 220, 0.25)',
      })
    }
  }

  return faces
}

export function cylinderFaces(
  x0: number,
  y0: number,
  z0: number,
  x1: number,
  y1: number,
  z1: number,
  radius: number,
  segments: number,
  base: string,
): Face[] {
  const faces: Face[] = []
  const dx = x1 - x0
  const dy = y1 - y0
  const dz = z1 - z0
  const len = Math.hypot(dx, dy, dz) || 1
  const ux = dx / len
  const uy = dy / len
  const uz = dz / len
  let ax = 0
  let ay = 1
  let az = 0
  if (Math.abs(uy) > 0.95) {
    ax = 1
    ay = 0
  }
  const px = uy * az - uz * ay
  const py = uz * ax - ux * az
  const pz = ux * ay - uy * ax
  const pl = Math.hypot(px, py, pz) || 1
  const nx = px / pl
  const ny = py / pl
  const nz = pz / pl
  const qx = uy * nz - uz * ny
  const qy = uz * nx - ux * nz
  const qz = ux * ny - uy * nx

  const ring = (yOff: number) => {
    const pts: Vec3[] = []
    for (let i = 0; i < segments; i++) {
      const a = (i / segments) * Math.PI * 2
      const c = Math.cos(a)
      const s = Math.sin(a)
      pts.push({
        x: x0 + ux * yOff + (nx * c + qx * s) * radius,
        y: y0 + uy * yOff + (ny * c + qy * s) * radius,
        z: z0 + uz * yOff + (nz * c + qz * s) * radius,
      })
    }
    return pts
  }

  const bottom = ring(0)
  const top = ring(len)
  for (let i = 0; i < segments; i++) {
    const j = (i + 1) % segments
    faces.push({
      verts: [bottom[i]!, bottom[j]!, top[j]!, top[i]!],
      fill: shade(base, 0.9 + (i / segments) * 0.12),
      stroke: 'rgba(40, 45, 52, 0.28)',
    })
  }
  return faces
}
