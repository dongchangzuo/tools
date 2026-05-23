import {
  BEAM_HALF,
  getHookAttachY,
  HOOK_DROP,
  LUG_HEIGHT,
  PAN_CHAIN,
  PIVOT_X,
  PIVOT_Y,
} from '../geometry'
import type { HookSide } from '../types'
import { rotateZ, type Vec3 } from './mesh'

const PAN_DEPTH = 14

export function pivotWorld(local: Vec3, tiltRad: number): Vec3 {
  return rotateZ(
    { x: PIVOT_X + local.x, y: PIVOT_Y + local.y, z: local.z },
    tiltRad,
    { x: PIVOT_X, y: PIVOT_Y, z: 0 },
  )
}

export function getPanCenter3D(side: HookSide, tiltRad: number, animTime = 0): Vec3 {
  const sign = side === 'left' ? -1 : 1
  const wobble = Math.sin(animTime * 2.8 + (side === 'left' ? 0 : Math.PI)) * 0.4
  const panX = sign * BEAM_HALF + wobble
  const panZ = wobble * 0.2
  const rimY = getHookAttachY() + LUG_HEIGHT + HOOK_DROP + PAN_CHAIN
  return pivotWorld({ x: panX, y: rimY + PAN_DEPTH * 0.55, z: panZ }, tiltRad)
}
