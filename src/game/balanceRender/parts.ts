import { drawCrackedEquals } from '../balanceEqualsCrack.ts'
import type { CheckStatus } from '../balanceLogic.ts'
import {
  BASE_HEIGHT,
  BASE_TOP_Y,
  BASE_WIDTH,
  BEAM_HALF,
  BEAM_HEIGHT,
  BEAM_Y,
  BALANCE_HEIGHT,
  BALANCE_WIDTH,
  getBeamEndX,
  getHookAttachY,
  getHookRodTopWorld,
  getPanWorldCenter,
  LUG_HEIGHT,
  PAN_HEIGHT,
  PAN_WIDTH,
  PILLAR_TOP_Y,
  PILLAR_WIDTH,
  PIVOT_X,
  PIVOT_Y,
  type PanSide,
} from '../balanceGeometry.ts'
import { createBrushedMetalPattern } from './materials.ts'
import {
  BASE_LIGHT_ANGLE,
  fakeBevelStroke,
  lightVector,
  linearMetalGradient,
  radialHighlight,
  roundRect,
} from './lighting.ts'
export function drawEnvironment(ctx: CanvasRenderingContext2D): void {
  const g = ctx.createLinearGradient(0, 0, 0, BALANCE_HEIGHT)
  g.addColorStop(0, '#e4eaf2')
  g.addColorStop(0.55, '#d8dee8')
  g.addColorStop(1, '#c8ced8')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, BALANCE_WIDTH, BALANCE_HEIGHT)

  const vg = ctx.createRadialGradient(
    BALANCE_WIDTH / 2,
    BALANCE_HEIGHT * 0.45,
    40,
    BALANCE_WIDTH / 2,
    BALANCE_HEIGHT * 0.5,
    BALANCE_WIDTH * 0.65,
  )
  vg.addColorStop(0, 'rgba(0,0,0,0)')
  vg.addColorStop(1, 'rgba(30,40,55,0.12)')
  ctx.fillStyle = vg
  ctx.fillRect(0, 0, BALANCE_WIDTH, BALANCE_HEIGHT)
}

export function drawPillarAndBase(ctx: CanvasRenderingContext2D): void {
  const bx = PIVOT_X
  const baseY = BASE_TOP_Y
  const { lx } = lightVector()

  ctx.save()
  ctx.translate(bx, baseY)

  const baseGrad = linearMetalGradient(
    ctx,
    -BASE_WIDTH / 2,
    0,
    BASE_WIDTH / 2,
    BASE_HEIGHT,
    '#a8b2bc',
    '#6a737c',
    '#3e454c',
  )
  ctx.beginPath()
  ctx.moveTo(-BASE_WIDTH / 2 - 6, BASE_HEIGHT)
  ctx.lineTo(BASE_WIDTH / 2 + 6, BASE_HEIGHT)
  ctx.lineTo(BASE_WIDTH / 2 - 4, 0)
  ctx.lineTo(-BASE_WIDTH / 2 + 4, 0)
  ctx.closePath()
  ctx.fillStyle = baseGrad
  ctx.fill()
  ctx.strokeStyle = 'rgba(30,35,42,0.5)'
  ctx.lineWidth = 1
  ctx.stroke()

  const pillarH = baseY - PILLAR_TOP_Y
  const pw = PILLAR_WIDTH
  const pg = linearMetalGradient(
    ctx,
    -pw / 2 - lx * 8,
    -pillarH,
    pw / 2 + lx * 8,
    0,
    '#d0d6de',
    '#8a939d',
    '#4a525a',
  )
  roundRect(ctx, -pw / 2, -pillarH, pw, pillarH, 3)
  ctx.fillStyle = pg
  ctx.fill()
  fakeBevelStroke(ctx, lx)

  const scaleTop = -pillarH + 12
  const scaleBottom = -8
  const majorEvery = 28
  for (let y = scaleTop; y <= scaleBottom; y += 6) {
    const major = Math.round((y - scaleTop) / 6) % Math.round(majorEvery / 6) === 0
    const tickW = major ? 7 : 4
    ctx.strokeStyle = major ? 'rgba(30,35,42,0.75)' : 'rgba(50,55,62,0.45)'
    ctx.lineWidth = major ? 1.2 : 0.8
    ctx.beginPath()
    ctx.moveTo(pw / 2 + 1, y)
    ctx.lineTo(pw / 2 + 1 + tickW, y)
    ctx.stroke()
    if (major) {
      for (let d = 0; d < 3; d++) {
        const dx = pw / 2 + 9 + d * 2
        ctx.fillStyle = 'rgba(40,45,52,0.6)'
        ctx.fillRect(dx, y - 1, 1.5, 2)
      }
    }
  }

  ctx.restore()
}

export function drawPivotAssembly(ctx: CanvasRenderingContext2D): void {
  const capG = radialHighlight(
    ctx,
    PIVOT_X - 2,
    PIVOT_Y - 3,
    14,
    '#f2f5f9',
    '#4a525a',
  )
  ctx.fillStyle = capG
  ctx.beginPath()
  ctx.arc(PIVOT_X, PIVOT_Y, 13, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#353b42'
  ctx.lineWidth = 1.5
  ctx.stroke()

  ctx.fillStyle = '#2a3038'
  ctx.beginPath()
  ctx.moveTo(PIVOT_X, PIVOT_Y + 2)
  ctx.lineTo(PIVOT_X - 5, PIVOT_Y + 10)
  ctx.lineTo(PIVOT_X + 5, PIVOT_Y + 10)
  ctx.closePath()
  ctx.fill()

  const postG = linearMetalGradient(
    ctx,
    PIVOT_X - 5,
    PIVOT_Y,
    PIVOT_X + 5,
    PIVOT_Y + 20,
    '#8a939d',
    '#5a626a',
    '#353b42',
  )
  ctx.fillStyle = postG
  ctx.fillRect(PIVOT_X - 4, PIVOT_Y + 4, 8, 18)

  for (let i = 0; i < 4; i++) {
    const sx = PIVOT_X + (i % 2 === 0 ? -9 : 7)
    const sy = PIVOT_Y + 8 + Math.floor(i / 2) * 6
    ctx.fillStyle = '#5a626a'
    ctx.beginPath()
    ctx.arc(sx, sy, 2.2, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.25)'
    ctx.lineWidth = 0.6
    ctx.beginPath()
    ctx.moveTo(sx - 1.2, sy)
    ctx.lineTo(sx + 1.2, sy)
    ctx.moveTo(sx, sy - 1.2)
    ctx.lineTo(sx, sy + 1.2)
    ctx.stroke()
  }
}

export function drawBeam(ctx: CanvasRenderingContext2D, tiltRad: number): void {
  const { lx, ly } = lightVector(tiltRad)
  const gx = lx * BEAM_HALF
  const gy = ly * BEAM_HALF
  const g = linearMetalGradient(
    ctx,
    -gx,
    -gy,
    gx,
    gy,
    '#eceff4',
    '#9aa3ad',
    '#4e565e',
  )

  roundRect(ctx, -BEAM_HALF, BEAM_Y - BEAM_HEIGHT / 2, BEAM_HALF * 2, BEAM_HEIGHT, 6)
  ctx.fillStyle = g
  ctx.fill()

  const spec = ctx.createLinearGradient(-BEAM_HALF, BEAM_Y - 4, BEAM_HALF, BEAM_Y - 2)
  spec.addColorStop(0, 'rgba(255,255,255,0)')
  spec.addColorStop(0.5, 'rgba(255,255,255,0.45)')
  spec.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = spec
  ctx.fillRect(-BEAM_HALF + 8, BEAM_Y - BEAM_HEIGHT / 2 + 1, BEAM_HALF * 2 - 16, 3)

  ctx.strokeStyle = '#3a4249'
  ctx.lineWidth = 1.2
  ctx.stroke()
  fakeBevelStroke(ctx, lx)

  const metalPat = createBrushedMetalPattern(ctx)
  ctx.save()
  ctx.globalAlpha = 0.12
  ctx.fillStyle = metalPat
  roundRect(ctx, -BEAM_HALF, BEAM_Y - BEAM_HEIGHT / 2, BEAM_HALF * 2, BEAM_HEIGHT, 6)
  ctx.fill()
  ctx.restore()

  for (const side of [-1, 1] as const) {
    const ex = side * BEAM_HALF
    ctx.fillStyle = '#5a626a'
    ctx.beginPath()
    ctx.arc(ex, BEAM_Y, 5, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.2)'
    ctx.lineWidth = 1
    ctx.stroke()
  }
}

function drawScrew(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  ctx.fillStyle = '#6a737c'
  ctx.beginPath()
  ctx.arc(x, y, 2.5, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = 'rgba(255,255,255,0.3)'
  ctx.lineWidth = 0.6
  ctx.beginPath()
  ctx.moveTo(x - 1.5, y)
  ctx.lineTo(x + 1.5, y)
  ctx.moveTo(x, y - 1.5)
  ctx.lineTo(x, y + 1.5)
  ctx.stroke()
}

export function drawBeamLug(
  ctx: CanvasRenderingContext2D,
  side: PanSide,
  tiltRad: number,
): void {
  const beamX = getBeamEndX(side)
  const attachY = getHookAttachY()
  const { lx, ly } = lightVector(tiltRad)
  const lugW = 9

  const lugGrad = ctx.createLinearGradient(
    beamX - lx * 5,
    attachY - ly * 5,
    beamX + lx * 5,
    attachY + LUG_HEIGHT + ly * 5,
  )
  lugGrad.addColorStop(0, '#c4ccd4')
  lugGrad.addColorStop(1, '#525a62')
  ctx.fillStyle = lugGrad
  roundRect(ctx, beamX - lugW / 2, attachY, lugW, LUG_HEIGHT, 2)
  ctx.fill()
  ctx.strokeStyle = '#454c54'
  ctx.lineWidth = 1
  ctx.stroke()
  drawScrew(ctx, beamX, attachY + LUG_HEIGHT / 2)
}

export function drawHookWorld(
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
  rodGrad.addColorStop(0, '#aeb6c0')
  rodGrad.addColorStop(0.5, '#6e7882')
  rodGrad.addColorStop(1, '#454c54')

  ctx.strokeStyle = rodGrad
  ctx.lineWidth = 3.2
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.beginPath()
  ctx.moveTo(rodTop.x, rodTop.y)
  ctx.lineTo(rodTop.x, panTopY - 6)

  const hookDir = side === 'left' ? 1 : -1
  ctx.quadraticCurveTo(
    rodTop.x + hookDir * 7,
    panTopY - 2,
    center.x,
    panTopY,
  )
  ctx.stroke()

  ctx.fillStyle = '#6a737c'
  ctx.beginPath()
  ctx.arc(center.x, panTopY, 3.5, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = 'rgba(255,255,255,0.35)'
  ctx.lineWidth = 1
  ctx.stroke()
}

export function drawPanWorld(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  side: PanSide,
  tiltRad: number,
  expression: string,
  active: boolean,
  woodPattern: CanvasPattern,
  textYOffset: number,
): void {
  const hw = PAN_WIDTH / 2
  const hh = PAN_HEIGHT / 2
  const { lx } = lightVector(tiltRad)
  const sideFactor = side === 'left' ? 1 : -1
  const faceLight = 0.55 + 0.25 * Math.cos(BASE_LIGHT_ANGLE) * sideFactor

  ctx.save()
  ctx.translate(cx, cy)

  const topLightX = Math.cos(BASE_LIGHT_ANGLE) * hw
  const topLightY = Math.sin(BASE_LIGHT_ANGLE) * hh
  const topGrad = ctx.createLinearGradient(-topLightX, -topLightY, topLightX, topLightY)
  topGrad.addColorStop(0, `rgba(255, 248, 235, ${0.55 + 0.3 * faceLight})`)
  topGrad.addColorStop(0.35, '#d8bc8e')
  topGrad.addColorStop(1, `rgba(95, 65, 40, ${0.88})`)

  roundRect(ctx, -hw, -hh, PAN_WIDTH, PAN_HEIGHT, 9)
  ctx.fillStyle = topGrad
  ctx.fill()

  ctx.fillStyle = woodPattern
  ctx.globalAlpha = 0.5
  roundRect(ctx, -hw, -hh, PAN_WIDTH, PAN_HEIGHT, 9)
  ctx.fill()
  ctx.globalAlpha = 1

  ctx.strokeStyle = `rgba(255, 252, 245, ${0.4 + 0.2 * faceLight})`
  ctx.lineWidth = 1.5
  roundRect(ctx, -hw, -hh, PAN_WIDTH, PAN_HEIGHT, 9)
  ctx.stroke()

  ctx.strokeStyle = `rgba(70, 48, 30, ${0.55 * faceLight})`
  ctx.lineWidth = 1
  roundRect(ctx, -hw, -hh + 1, PAN_WIDTH, PAN_HEIGHT - 1, 9)
  ctx.stroke()

  fakeBevelStroke(ctx, lx)

  if (active) {
    ctx.strokeStyle = 'rgba(91, 155, 213, 0.9)'
    ctx.lineWidth = 3
    roundRect(ctx, -hw - 2, -hh - 2, PAN_WIDTH + 4, PAN_HEIGHT + 4, 11)
    ctx.stroke()
  }

  const text = expression || '点击输入'
  ctx.fillStyle = expression ? '#2a2018' : '#7a6a58'
  ctx.font = expression
    ? '600 14px system-ui, sans-serif'
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
  ctx.fillText(display, 0, textYOffset)

  ctx.restore()
}

export function drawEqualsSign(
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
