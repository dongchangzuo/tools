import {
  BASE_HEIGHT,
  BASE_TOP_Y,
  BASE_WIDTH,
  BEAM_HALF,
  BEAM_HEIGHT,
  BEAM_Y,
  getHookAttachY,
  HOOK_DROP,
  LUG_HEIGHT,
  PAN_CHAIN,
  PAN_WIDTH,
  PILLAR_TOP_Y,
  PILLAR_WIDTH,
  PIVOT_Y,
} from '../geometry'
import type { HookBalancePalette, HookSide } from '../types'
import {
  boxFaces,
  cylinderFaces,
  lathePanFaces,
  transformVerts,
  type Face,
  type Vec3,
} from './mesh'
import type { Stroke3D } from './render'
import { getPanCenter3D, pivotWorld } from './transform'

const PAN_RIM_R = PAN_WIDTH * 0.48
const PAN_DEPTH = 14
const METAL = '#9aa5b0'
const METAL_DARK = '#5c6670'
const BRASS = '#d4c48c'

function pushFaces(faces: Face[], localFaces: Face[], tiltRad: number): void {
  for (const f of localFaces) {
    faces.push({
      ...f,
      verts: transformVerts(f.verts, (v) => pivotWorld(v, tiltRad)),
    })
  }
}

function pushStroke(
  strokes: Stroke3D[],
  a: Vec3,
  b: Vec3,
  tiltRad: number,
  color: string,
  width: number,
): void {
  strokes.push({ a: pivotWorld(a, tiltRad), b: pivotWorld(b, tiltRad), color, width })
}

function buildPanSide(
  side: HookSide,
  tiltRad: number,
  animTime: number,
  faces: Face[],
  strokes: Stroke3D[],
): Vec3 {
  const sign = side === 'left' ? -1 : 1
  const beamX = sign * BEAM_HALF
  const wobble = Math.sin(animTime * 2.8 + (side === 'left' ? 0 : Math.PI)) * 0.4

  const attachY = getHookAttachY() + LUG_HEIGHT
  const hookTipY = attachY + HOOK_DROP
  const rimY = hookTipY + PAN_CHAIN
  const panX = beamX + wobble
  const panZ = wobble * 0.2

  const hookTip: Vec3 = { x: panX, y: hookTipY, z: panZ }

  pushFaces(faces, lathePanFaces(panX, rimY, panZ, PAN_RIM_R, PAN_DEPTH, 40, BRASS), tiltRad)
  pushFaces(
    faces,
    boxFaces(panX, attachY - LUG_HEIGHT / 2, panZ, 4, LUG_HEIGHT / 2, 3, METAL_DARK),
    tiltRad,
  )
  pushFaces(
    faces,
    cylinderFaces(panX, attachY, panZ, panX, hookTipY - 3, panZ, 2.2, 10, METAL),
    tiltRad,
  )

  const hookMid: Vec3 = { x: panX + sign * 5, y: hookTipY - 2, z: panZ }
  pushStroke(strokes, { x: panX, y: hookTipY - 3, z: panZ }, hookMid, tiltRad, METAL_DARK, 3.2)
  pushStroke(strokes, hookMid, hookTip, tiltRad, METAL_DARK, 3.2)

  const chainAngles = [Math.PI * 0.5, Math.PI * 1.17, Math.PI * 1.83]
  for (const ang of chainAngles) {
    const rimPt: Vec3 = {
      x: panX + Math.sin(ang) * PAN_RIM_R * 0.94,
      y: rimY,
      z: panZ + Math.cos(ang) * PAN_RIM_R * 0.94,
    }
    pushStroke(strokes, hookTip, rimPt, tiltRad, '#707a86', 2.4)
  }

  return getPanCenter3D(side, tiltRad, animTime)
}

export function buildBalanceScene(
  tiltRad: number,
  animTime: number,
  _palette: HookBalancePalette,
): { faces: Face[]; strokes: Stroke3D[]; panCenters: { left: Vec3; right: Vec3 } } {
  const faces: Face[] = []
  const strokes: Stroke3D[] = []

  const pillarH = BASE_TOP_Y - PILLAR_TOP_Y
  const pillarCy = (PILLAR_TOP_Y + BASE_TOP_Y) / 2 - PIVOT_Y

  pushFaces(faces, boxFaces(0, pillarCy, 0, PILLAR_WIDTH / 2, pillarH / 2, 5, METAL), 0)
  pushFaces(
    faces,
    boxFaces(0, BASE_TOP_Y - PIVOT_Y, 0, BASE_WIDTH / 2 + 4, BASE_HEIGHT / 2, 8, METAL_DARK),
    0,
  )
  pushFaces(faces, boxFaces(0, 0, 0, 12, 12, 6, '#b0bac4'), 0)
  pushFaces(faces, boxFaces(0, BEAM_Y, 0, BEAM_HALF, BEAM_HEIGHT / 2, 5, METAL), tiltRad)

  const leftCenter = buildPanSide('left', tiltRad, animTime, faces, strokes)
  const rightCenter = buildPanSide('right', tiltRad, animTime, faces, strokes)

  return { faces, strokes, panCenters: { left: leftCenter, right: rightCenter } }
}
