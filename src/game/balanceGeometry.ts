export const BALANCE_WIDTH = 520
export const BALANCE_HEIGHT = 360

export const PIVOT_X = BALANCE_WIDTH / 2
export const PIVOT_Y = 148
export const BEAM_HALF = 168
export const BEAM_HEIGHT = 14
export const BEAM_Y = -6

export const PAN_WIDTH = 112
export const PAN_HEIGHT = 28
export const PAN_DEPTH = 16
export const HOOK_DROP = 32
export const LUG_HEIGHT = 5
export const PAN_Y_ON_BEAM = 10 + HOOK_DROP

export type PanSide = 'left' | 'right'

export type Point = { x: number; y: number }

export function getBeamEndX(side: PanSide): number {
  return side === 'left' ? -BEAM_HALF : BEAM_HALF
}

export function getHookAttachY(): number {
  return BEAM_Y + BEAM_HEIGHT / 2
}

export function localToWorld(
  lx: number,
  ly: number,
  tiltRad: number,
): Point {
  const cos = Math.cos(tiltRad)
  const sin = Math.sin(tiltRad)
  return {
    x: PIVOT_X + lx * cos - ly * sin,
    y: PIVOT_Y + lx * sin + ly * cos,
  }
}

export function getBeamAttachWorld(side: PanSide, tiltRad: number): Point {
  return localToWorld(getBeamEndX(side), getHookAttachY(), tiltRad)
}

export function getHookRodTopWorld(side: PanSide, tiltRad: number): Point {
  return localToWorld(
    getBeamEndX(side),
    getHookAttachY() + LUG_HEIGHT,
    tiltRad,
  )
}

export function getPanWorldCenter(side: PanSide, tiltRad: number): Point {
  const rodTop = getHookRodTopWorld(side, tiltRad)
  return {
    x: rodTop.x,
    y: rodTop.y + HOOK_DROP + PAN_HEIGHT / 2,
  }
}

export function worldToLocal(
  wx: number,
  wy: number,
  pivotX: number,
  pivotY: number,
  tiltRad: number,
): Point {
  const dx = wx - pivotX
  const dy = wy - pivotY
  const cos = Math.cos(-tiltRad)
  const sin = Math.sin(-tiltRad)
  return {
    x: dx * cos - dy * sin,
    y: dx * sin + dy * cos,
  }
}

export function getPanCenters(tiltRad: number): { left: Point; right: Point } {
  return {
    left: getPanWorldCenter('left', tiltRad),
    right: getPanWorldCenter('right', tiltRad),
  }
}

export function hitTestPan(
  x: number,
  y: number,
  tiltRad: number,
): PanSide | null {
  const halfW = PAN_WIDTH / 2 + 8
  const halfH = PAN_HEIGHT / 2 + PAN_DEPTH + 8

  for (const side of ['left', 'right'] as const) {
    const c = getPanWorldCenter(side, tiltRad)
    if (
      Math.abs(x - c.x) <= halfW &&
      Math.abs(y - c.y) <= halfH
    ) {
      return side
    }
  }
  return null
}
