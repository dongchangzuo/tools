import type { Vec3 } from './mesh'
import { VIEW_COS, VIEW_SIN } from '../perspective'

export type ScreenPt = { x: number; y: number; depth: number }

export function projectPoint(v: Vec3): ScreenPt {
  return {
    x: v.x,
    y: v.y + v.z * VIEW_SIN,
    depth: v.y * VIEW_COS + v.z,
  }
}

export function meanDepth(pts: ScreenPt[]): number {
  let s = 0
  for (const p of pts) s += p.depth
  return s / pts.length
}
