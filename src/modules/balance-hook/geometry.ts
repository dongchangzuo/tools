export const BALANCE_WIDTH = 520
export const BALANCE_HEIGHT = 420

export const PIVOT_X = BALANCE_WIDTH / 2
export const PIVOT_Y = 122

export const BASE_WIDTH = 76
export const BASE_HEIGHT = 16
export const BASE_TOP_Y = 310
export const PILLAR_WIDTH = 14
export const PILLAR_TOP_Y = 36
export const BEAM_HALF = 168
export const BEAM_HEIGHT = 14
export const BEAM_Y = -6

export const HOOK_DROP = 62
export const LUG_HEIGHT = 5
export const PAN_CHAIN = 12
export const PAN_WIDTH = 118
export const PAN_BOWL_HEIGHT = 26
export const HOOK_HIT_RADIUS = 24

import { projectPoint } from './draw3d/camera'
import { getPanCenter3D } from './draw3d/transform'
import type { HookSide } from './types'

export type Point = { x: number; y: number }

export function getBeamEndX(side: HookSide): number {
  return side === 'left' ? -BEAM_HALF : BEAM_HALF
}

export function getHookAttachY(): number {
  return BEAM_Y + BEAM_HEIGHT / 2
}

export function localToWorld(lx: number, ly: number, tiltRad: number): Point {
  const cos = Math.cos(tiltRad)
  const sin = Math.sin(tiltRad)
  return {
    x: PIVOT_X + lx * cos - ly * sin,
    y: PIVOT_Y + lx * sin + ly * cos,
  }
}

export function getHookTipWorld(side: HookSide, tiltRad: number): Point {
  const tip = {
    x: getBeamEndX(side),
    y: getHookAttachY() + LUG_HEIGHT + HOOK_DROP,
  }
  return localToWorld(tip.x, tip.y, tiltRad)
}

export function getPanTopWorld(side: HookSide, tiltRad: number): Point {
  const tip = getHookTipWorld(side, tiltRad)
  return { x: tip.x, y: tip.y + PAN_CHAIN }
}

export function getPanCenterWorld(side: HookSide, tiltRad: number): Point {
  return projectPoint(getPanCenter3D(side, tiltRad, 0))
}

export function getHookAnchors(tiltRad: number): { left: Point; right: Point } {
  return {
    left: getPanCenterWorld('left', tiltRad),
    right: getPanCenterWorld('right', tiltRad),
  }
}

export function hitTestHook(x: number, y: number, tiltRad: number): HookSide | null {
  const halfW = PAN_WIDTH / 2 + 8
  const halfH = PAN_BOWL_HEIGHT / 2 + 12
  for (const side of ['left', 'right'] as const) {
    const c = getPanCenterWorld(side, tiltRad)
    if (Math.abs(x - c.x) <= halfW && Math.abs(y - c.y) <= halfH) {
      return side
    }
  }
  return null
}
