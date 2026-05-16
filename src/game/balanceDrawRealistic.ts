import { drawCrackedEquals } from './balanceEqualsCrack.ts'
import type { CheckStatus } from './balanceLogic.ts'
import {
  BALANCE_HEIGHT,
  BALANCE_WIDTH,
  BEAM_HALF,
  BEAM_HEIGHT,
  BEAM_Y,
  getBeamEndX,
  getHookAttachY,
  getHookRodTopWorld,
  getPanWorldCenter,
  LUG_HEIGHT,
  PAN_DEPTH,
  PAN_HEIGHT,
  PAN_WIDTH,
  PIVOT_X,
  PIVOT_Y,
  type PanSide,
} from './balanceGeometry.ts'

export type DrawBalanceOptions = {
  tiltRad: number
  checkStatus: CheckStatus
  leftExpression: string
  rightExpression: string
  activeTray: PanSide
  flashPhase: number
}

let woodPattern: CanvasPattern | null = null
let woodPatternCtx: CanvasRenderingContext2D | null = null

const BASE_LIGHT_ANGLE = -Math.PI * 0.72

function ensureWoodPattern(ctx: CanvasRenderingContext2D): CanvasPattern {
  if (woodPattern && woodPatternCtx === ctx) return woodPattern

  const size = 64
  const off = document.createElement('canvas')
  off.width = size
  off.height = size
  const octx = off.getContext('2d')!
  octx.fillStyle = '#c4a574'
  octx.fillRect(0, 0, size, size)

  for (let i = 0; i < size; i += 2) {
    const t = i / size
    octx.strokeStyle = `rgba(90, 60, 35, ${0.08 + t * 0.06})`
    octx.lineWidth = 1
    octx.beginPath()
    octx.moveTo(0, i + Math.sin(i * 0.3) * 0.5)
    octx.lineTo(size, i + Math.cos(i * 0.2) * 0.5)
    octx.stroke()
  }

  for (let n = 0; n < 400; n++) {
    const px = Math.random() * size
    const py = Math.random() * size
    const a = 0.02 + Math.random() * 0.04
    octx.fillStyle =
      Math.random() > 0.5 ? `rgba(255,248,230,${a})` : `rgba(70,45,25,${a})`
    octx.fillRect(px, py, 1, 1)
  }

  woodPattern = ctx.createPattern(off, 'repeat')!
  woodPatternCtx = ctx
  return woodPattern
}

function drawBackground(ctx: CanvasRenderingContext2D): void {
  const g = ctx.createLinearGradient(0, 0, 0, BALANCE_HEIGHT)
  g.addColorStop(0, '#e8eef4')
  g.addColorStop(1, '#d8dce3')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, BALANCE_WIDTH, BALANCE_HEIGHT)
}

function drawPivot(ctx: CanvasRenderingContext2D): void {
  const g = ctx.createRadialGradient(PIVOT_X - 3, PIVOT_Y - 3, 2, PIVOT_X, PIVOT_Y, 14)
  g.addColorStop(0, '#f0f4f8')
  g.addColorStop(0.4, '#9aa3ad')
  g.addColorStop(1, '#4a525a')
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.arc(PIVOT_X, PIVOT_Y, 12, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#353b42'
  ctx.lineWidth = 2
  ctx.stroke()

  const g2 = ctx.createLinearGradient(PIVOT_X - 4, PIVOT_Y, PIVOT_X + 4, PIVOT_Y + 18)
  g2.addColorStop(0, '#7a848e')
  g2.addColorStop(1, '#3a4249')
  ctx.fillStyle = g2
  ctx.fillRect(PIVOT_X - 4, PIVOT_Y + 2, 8, 16)
}

function drawBeam(ctx: CanvasRenderingContext2D, tiltRad: number): void {
  const lightAngle = BASE_LIGHT_ANGLE - tiltRad
  const gx = Math.cos(lightAngle) * BEAM_HALF
  const gy = Math.sin(lightAngle) * BEAM_HALF
  const g = ctx.createLinearGradient(-gx, -gy, gx, gy)
  g.addColorStop(0, '#e8ecf0')
  g.addColorStop(0.45, '#a8b0b8')
  g.addColorStop(1, '#5a626a')

  ctx.fillStyle = g
  roundRect(ctx, -BEAM_HALF, BEAM_Y - BEAM_HEIGHT / 2, BEAM_HALF * 2, BEAM_HEIGHT, 6)
  ctx.fill()
  ctx.strokeStyle = '#454c54'
  ctx.lineWidth = 1.5
  ctx.stroke()
}

function drawBeamLug(
  ctx: CanvasRenderingContext2D,
  side: PanSide,
  tiltRad: number,
): void {
  const beamX = getBeamEndX(side)
  const attachY = getHookAttachY()
  const lightAngle = BASE_LIGHT_ANGLE - tiltRad
  const lx = Math.cos(lightAngle)
  const ly = Math.sin(lightAngle)

  const lugW = 8
  const lugGrad = ctx.createLinearGradient(
    beamX - lx * 4,
    attachY - ly * 4,
    beamX + lx * 4,
    attachY + LUG_HEIGHT + ly * 4,
  )
  lugGrad.addColorStop(0, '#b8c0c8')
  lugGrad.addColorStop(1, '#5a626a')
  ctx.fillStyle = lugGrad
  roundRect(ctx, beamX - lugW / 2, attachY, lugW, LUG_HEIGHT, 2)
  ctx.fill()
  ctx.strokeStyle = '#454c54'
  ctx.lineWidth = 1
  ctx.stroke()
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

function drawHookWorld(
  ctx: CanvasRenderingContext2D,
  side: PanSide,
  tiltRad: number,
): void {
  const rodTop = getHookRodTopWorld(side, tiltRad)
  const center = getPanWorldCenter(side, tiltRad)
  const panTopY = center.y - PAN_HEIGHT / 2

  const lx = Math.cos(BASE_LIGHT_ANGLE)

  const rodGrad = ctx.createLinearGradient(
    rodTop.x - lx * 6,
    rodTop.y,
    rodTop.x + lx * 6,
    panTopY,
  )
  rodGrad.addColorStop(0, '#9aa3ad')
  rodGrad.addColorStop(0.5, '#6a737c')
  rodGrad.addColorStop(1, '#4a525a')

  ctx.strokeStyle = rodGrad
  ctx.lineWidth = 3
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.beginPath()
  ctx.moveTo(rodTop.x, rodTop.y)
  ctx.lineTo(rodTop.x, panTopY - 6)

  const hookDir = side === 'left' ? 1 : -1
  ctx.quadraticCurveTo(
    rodTop.x + hookDir * 6,
    panTopY - 2,
    center.x,
    panTopY,
  )
  ctx.stroke()

  ctx.fillStyle = '#6a737c'
  ctx.beginPath()
  ctx.arc(center.x, panTopY, 3, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#8a929c'
  ctx.lineWidth = 1.5
  ctx.stroke()
}

function drawPanWorld(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  side: PanSide,
  tiltRad: number,
  expression: string,
  active: boolean,
  pattern: CanvasPattern,
): void {
  const hw = PAN_WIDTH / 2
  const hh = PAN_HEIGHT / 2

  const lightAngle = BASE_LIGHT_ANGLE - tiltRad * 0.35
  const sideFactor = side === 'left' ? 1 : -1
  const faceLight = 0.55 + 0.25 * Math.cos(lightAngle) * sideFactor

  ctx.save()
  ctx.translate(cx, cy)

  ctx.save()
  ctx.translate(2, PAN_DEPTH + 6)
  ctx.fillStyle = 'rgba(30, 25, 20, 0.2)'
  ctx.beginPath()
  ctx.ellipse(0, 0, hw + 4, hh * 0.45, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  const frontGrad = ctx.createLinearGradient(0, hh, 0, hh + PAN_DEPTH)
  frontGrad.addColorStop(0, `rgba(60, 40, 25, ${0.85 * faceLight})`)
  frontGrad.addColorStop(1, `rgba(35, 22, 14, ${0.95})`)
  ctx.fillStyle = frontGrad
  ctx.beginPath()
  ctx.moveTo(-hw, hh)
  ctx.lineTo(hw, hh)
  ctx.lineTo(hw - 4, hh + PAN_DEPTH)
  ctx.lineTo(-hw + 4, hh + PAN_DEPTH)
  ctx.closePath()
  ctx.fill()

  const sideGrad = ctx.createLinearGradient(-hw - 6, 0, -hw, 0)
  sideGrad.addColorStop(0, `rgba(45, 30, 18, 0.9)`)
  sideGrad.addColorStop(1, `rgba(75, 50, 32, ${0.7 * faceLight})`)
  ctx.fillStyle = sideGrad
  ctx.beginPath()
  ctx.moveTo(-hw, -hh)
  ctx.lineTo(-hw - 5, -hh + 3)
  ctx.lineTo(-hw - 5, hh + PAN_DEPTH - 2)
  ctx.lineTo(-hw, hh)
  ctx.closePath()
  ctx.fill()

  const topLightX = Math.cos(BASE_LIGHT_ANGLE) * hw
  const topLightY = Math.sin(BASE_LIGHT_ANGLE) * hh
  const topGrad = ctx.createLinearGradient(-topLightX, -topLightY, topLightX, topLightY)
  topGrad.addColorStop(0, `rgba(255, 245, 225, ${0.5 + 0.3 * faceLight})`)
  topGrad.addColorStop(0.35, '#d4b88a')
  topGrad.addColorStop(1, `rgba(100, 70, 45, ${0.85})`)

  ctx.fillStyle = topGrad
  roundRect(ctx, -hw, -hh, PAN_WIDTH, PAN_HEIGHT, 8)
  ctx.fill()

  ctx.fillStyle = pattern
  ctx.globalAlpha = 0.55
  roundRect(ctx, -hw, -hh, PAN_WIDTH, PAN_HEIGHT, 8)
  ctx.fill()
  ctx.globalAlpha = 1

  ctx.strokeStyle = `rgba(255, 250, 240, ${0.35 + 0.2 * faceLight})`
  ctx.lineWidth = 1.5
  roundRect(ctx, -hw, -hh, PAN_WIDTH, PAN_HEIGHT, 8)
  ctx.stroke()

  if (active) {
    ctx.strokeStyle = 'rgba(91, 155, 213, 0.85)'
    ctx.lineWidth = 3
    roundRect(ctx, -hw - 2, -hh - 2, PAN_WIDTH + 4, PAN_HEIGHT + 4, 10)
    ctx.stroke()
  }

  const text = expression || '点击输入'
  ctx.fillStyle = expression ? '#2a2018' : '#7a6a58'
  ctx.font = expression
    ? '600 15px system-ui, sans-serif'
    : '500 13px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const maxW = PAN_WIDTH - 16
  let display = text
  if (ctx.measureText(display).width > maxW) {
    while (display.length > 1 && ctx.measureText(`${display}…`).width > maxW) {
      display = display.slice(0, -1)
    }
    display += '…'
  }
  ctx.fillText(display, 0, 0)

  ctx.restore()
}

function drawEqualsSign(
  ctx: CanvasRenderingContext2D,
  checkStatus: CheckStatus,
  flashPhase: number,
  tiltRad: number,
): void {
  let color = '#c9a227'
  let alpha = 1
  if (checkStatus === 'success') color = '#22c55e'
  if (checkStatus === 'imbalance') {
    color = '#ef4444'
    alpha = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(flashPhase * Math.PI * 2))
    drawCrackedEquals(ctx, flashPhase, tiltRad, color, alpha)
    return
  }

  ctx.save()
  ctx.globalAlpha = alpha
  ctx.fillStyle = color
  ctx.font = '800 36px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('=', PIVOT_X, PIVOT_Y - 36)
  ctx.restore()
}

function drawPanAndHook(
  ctx: CanvasRenderingContext2D,
  side: PanSide,
  tiltRad: number,
  expression: string,
  active: boolean,
  pattern: CanvasPattern,
): void {
  drawHookWorld(ctx, side, tiltRad)
  const center = getPanWorldCenter(side, tiltRad)
  drawPanWorld(ctx, center.x, center.y, side, tiltRad, expression, active, pattern)
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
  } = options

  drawBackground(ctx)
  drawPivot(ctx)

  const pattern = ensureWoodPattern(ctx)

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
    pattern,
  )
  drawPanAndHook(
    ctx,
    'right',
    tiltRad,
    rightExpression,
    activeTray === 'right',
    pattern,
  )

  drawEqualsSign(ctx, checkStatus, flashPhase, tiltRad)
}

export { BALANCE_WIDTH, BALANCE_HEIGHT }
