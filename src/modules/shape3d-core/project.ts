export type Vec3 = { x: number; y: number; z: number }

const ISO_COS = Math.cos(Math.PI / 6)
const ISO_SIN = Math.sin(Math.PI / 6)

export function rotateY(v: Vec3, angle: number): Vec3 {
  if (angle === 0) return v
  const c = Math.cos(angle)
  const s = Math.sin(angle)
  return {
    x: v.x * c - v.z * s,
    y: v.y,
    z: v.x * s + v.z * c,
  }
}

/** 等轴测投影（3D y 轴向上，屏幕 y 向下） */
export function projectIso(v: Vec3, scale: number): { x: number; y: number } {
  return {
    x: (v.x - v.z) * ISO_COS * scale,
    y: -v.y * scale + (v.x + v.z) * ISO_SIN * scale,
  }
}

export function projectVec3(
  v: Vec3,
  scale: number,
  rotationY = 0,
): { x: number; y: number } {
  return projectIso(rotateY(v, rotationY), scale)
}

export type Vec2 = { x: number; y: number }

export function faceDepth(verts: Vec3[], rotationY = 0): number {
  let sum = 0
  for (const v of verts) {
    const r = rotateY(v, rotationY)
    sum += r.z
  }
  return sum / verts.length
}

/** 等轴测默认视角：从右前上方看向原点（与 y 轴向上的顶面可见） */
export const ISOMETRIC_VIEW_DIR: Vec3 = { x: 1, y: 1, z: 1 }

export function isFaceVisible(normal: Vec3, rotationY = 0): boolean {
  const n = rotateY(normal, rotationY)
  const dot =
    n.x * ISOMETRIC_VIEW_DIR.x +
    n.y * ISOMETRIC_VIEW_DIR.y +
    n.z * ISOMETRIC_VIEW_DIR.z
  return dot > 0.001
}
