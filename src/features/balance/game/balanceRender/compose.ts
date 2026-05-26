import type { CheckStatus } from '../balanceLogic.ts'
import {
  BALANCE_HEIGHT,
  BALANCE_WIDTH,
  getPanWorldCenter,
  PIVOT_X,
  PIVOT_Y,
  type PanSide,
} from '../balanceGeometry.ts'
import { createWoodGrainPattern } from './materials.ts'
import {
  drawBeam,
  drawBeamLug,
  drawEnvironment,
  drawEqualsSign,
  drawHookWorld,
  drawPanWorld,
  drawPillarAndBase,
  drawPivotAssembly,
} from './parts.ts'

export type DrawBalanceOptions = {
  tiltRad: number
  checkStatus: CheckStatus
  leftExpression: string
  rightExpression: string
  activeTray: PanSide
  flashPhase: number
  animTime: number
}

function drawPanAndHook(
  ctx: CanvasRenderingContext2D,
  side: PanSide,
  tiltRad: number,
  expression: string,
  active: boolean,
  woodPattern: CanvasPattern,
  animTime: number,
): void {
  drawHookWorld(ctx, side, tiltRad)
  const center = getPanWorldCenter(side, tiltRad)
  const wobbleY = Math.sin(animTime * 2.8) * 1.2
  drawPanWorld(
    ctx,
    center.x,
    center.y,
    side,
    tiltRad,
    expression,
    active,
    woodPattern,
    wobbleY,
  )
}

export function drawRealisticBalance(
  ctx: CanvasRenderingContext2D,
  options: DrawBalanceOptions,
): void {
  const {
    tiltRad,
    checkStatus,
    leftExpression,
    rightExpression,
    activeTray,
    flashPhase,
    animTime,
  } = options

  drawEnvironment(ctx)
  drawPillarAndBase(ctx)
  drawPivotAssembly(ctx)

  const woodPattern = createWoodGrainPattern(ctx)

  ctx.save()
  ctx.translate(PIVOT_X, PIVOT_Y)
  ctx.rotate(tiltRad)
  drawBeam(ctx, tiltRad)
  drawBeamLug(ctx, 'left', tiltRad)
  drawBeamLug(ctx, 'right', tiltRad)
  ctx.restore()

  drawPanAndHook(
    ctx,
    'left',
    tiltRad,
    leftExpression,
    activeTray === 'left',
    woodPattern,
    animTime,
  )
  drawPanAndHook(
    ctx,
    'right',
    tiltRad,
    rightExpression,
    activeTray === 'right',
    woodPattern,
    animTime,
  )

  drawEqualsSign(ctx, checkStatus, flashPhase, tiltRad)
}

export { BALANCE_WIDTH, BALANCE_HEIGHT }
