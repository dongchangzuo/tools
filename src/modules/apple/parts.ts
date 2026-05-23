import { hash2D } from './noise'
import {
  ambientVignetteGradient,
  bodyRadialGradient,
  KEY_LIGHT,
  subsurfaceTintGradient,
} from './lighting'
import type { ApplePalette } from './types'

/** 苹果主体贝塞尔轮廓（局部坐标，原点在苹果中心） */
export function traceAppleBody(ctx: CanvasRenderingContext2D, r: number): void {
  const w = r * 1.04
  const top = -r * 0.84
  const bottom = r * 0.94
  const dip = -r * 0.58

  ctx.beginPath()
  ctx.moveTo(0, dip)
  ctx.bezierCurveTo(-w * 0.98, top + r * 0.12, -w * 0.93, bottom - r * 0.12, 0, bottom)
  ctx.bezierCurveTo(w * 0.93, bottom - r * 0.12, w * 0.98, top + r * 0.12, 0, dip)
  ctx.closePath()
}

export function clipAppleBody(ctx: CanvasRenderingContext2D, r: number): void {
  traceAppleBody(ctx, r)
  ctx.clip()
}

export function drawContactShadow(
  ctx: CanvasRenderingContext2D,
  r: number,
  palette: ApplePalette,
): void {
  ctx.save()
  ctx.translate(0, r * 0.9)
  ctx.scale(1, 0.26)
  ctx.beginPath()
  ctx.ellipse(0, 0, r * 0.78, r * 0.38, 0, 0, Math.PI * 2)
  ctx.fillStyle = palette.shadow
  ctx.fill()
  ctx.restore()

  ctx.save()
  clipAppleBody(ctx, r)
  const ao = ctx.createLinearGradient(0, r * 0.35, 0, r)
  ao.addColorStop(0, 'rgba(0, 0, 0, 0)')
  ao.addColorStop(1, 'rgba(40, 5, 10, 0.22)')
  ctx.fillStyle = ao
  ctx.fillRect(-r * 1.2, -r * 0.2, r * 2.4, r * 1.4)
  ctx.restore()
}

export function drawBodyVolume(
  ctx: CanvasRenderingContext2D,
  r: number,
  palette: ApplePalette,
): void {
  traceAppleBody(ctx, r)
  ctx.fillStyle = bodyRadialGradient(
    ctx,
    r,
    palette.bodyLight,
    palette.bodyMid,
    palette.bodyDark,
    palette.bodyDeep,
  )
  ctx.fill()

  ctx.save()
  clipAppleBody(ctx, r)
  ctx.globalCompositeOperation = 'multiply'
  ctx.fillStyle = ambientVignetteGradient(ctx, r)
  ctx.fillRect(-r * 1.2, -r * 1.2, r * 2.4, r * 2.4)
  ctx.restore()

  ctx.save()
  clipAppleBody(ctx, r)
  ctx.globalCompositeOperation = 'screen'
  ctx.fillStyle = subsurfaceTintGradient(ctx, r)
  ctx.fillRect(-r * 1.2, -r * 1.2, r * 2.4, r * 2.4)
  ctx.restore()
}

export function drawSpecular(
  ctx: CanvasRenderingContext2D,
  r: number,
  palette: ApplePalette,
): void {
  ctx.save()
  clipAppleBody(ctx, r)

  const primary = ctx.createRadialGradient(
    KEY_LIGHT.x * r,
    KEY_LIGHT.y * r,
    0,
    KEY_LIGHT.x * r * 0.5,
    KEY_LIGHT.y * r * 0.5,
    r * 0.85,
  )
  primary.addColorStop(0, palette.highlight)
  primary.addColorStop(0.25, 'rgba(255, 255, 255, 0.35)')
  primary.addColorStop(0.55, 'rgba(255, 255, 255, 0.08)')
  primary.addColorStop(1, 'rgba(255, 255, 255, 0)')
  ctx.globalCompositeOperation = 'screen'
  ctx.fillStyle = primary
  ctx.fillRect(-r * 1.2, -r * 1.2, r * 2.4, r * 2.4)

  const secondary = ctx.createRadialGradient(
    r * 0.45,
    r * 0.35,
    0,
    r * 0.5,
    r * 0.4,
    r * 0.55,
  )
  secondary.addColorStop(0, 'rgba(255, 255, 255, 0.18)')
  secondary.addColorStop(1, 'rgba(255, 255, 255, 0)')
  ctx.fillStyle = secondary
  ctx.fillRect(-r * 1.2, -r * 1.2, r * 2.4, r * 2.4)

  const wax = ctx.createLinearGradient(-r * 0.6, -r * 0.9, r * 0.5, r * 0.2)
  wax.addColorStop(0, palette.waxSheen)
  wax.addColorStop(0.4, 'rgba(255, 255, 255, 0)')
  wax.addColorStop(1, 'rgba(255, 255, 255, 0)')
  ctx.fillStyle = wax
  ctx.fillRect(-r * 1.2, -r * 1.2, r * 2.4, r * 2.4)

  ctx.restore()
}

export function drawCalyx(
  ctx: CanvasRenderingContext2D,
  r: number,
  palette: ApplePalette,
): void {
  const dipY = -r * 0.58
  const calyxR = r * 0.22

  ctx.save()
  clipAppleBody(ctx, r)

  const calyxGrad = ctx.createRadialGradient(0, dipY, 0, 0, dipY, calyxR * 1.8)
  calyxGrad.addColorStop(0, palette.calyxDark)
  calyxGrad.addColorStop(0.45, palette.calyxMid)
  calyxGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')
  ctx.fillStyle = calyxGrad
  ctx.beginPath()
  ctx.ellipse(0, dipY + r * 0.02, calyxR * 1.1, calyxR * 0.85, 0, 0, Math.PI * 2)
  ctx.fill()

  ctx.restore()
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  rad: number,
): void {
  const rr = Math.min(rad, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + rr, y)
  ctx.lineTo(x + w - rr, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + rr)
  ctx.lineTo(x + w, y + h - rr)
  ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h)
  ctx.lineTo(x + rr, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - rr)
  ctx.lineTo(x, y + rr)
  ctx.quadraticCurveTo(x, y, x + rr, y)
  ctx.closePath()
}

export function drawStem(ctx: CanvasRenderingContext2D, r: number, palette: ApplePalette): void {
  const stemW = r * 0.11
  const stemH = r * 0.34
  const top = -r * 0.82

  const grad = ctx.createLinearGradient(-stemW, top, stemW, top + stemH)
  grad.addColorStop(0, palette.stem)
  grad.addColorStop(0.5, palette.stemDark)
  grad.addColorStop(1, palette.stemDark)

  ctx.fillStyle = grad
  roundRect(ctx, -stemW / 2, top, stemW, stemH, stemW * 0.4)
  ctx.fill()

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)'
  ctx.lineWidth = Math.max(0.5, r * 0.012)
  for (let i = 0; i < 4; i++) {
    const t = 0.15 + i * 0.22
    const y0 = top + stemH * t
    ctx.beginPath()
    ctx.moveTo(-stemW * 0.25, y0)
    ctx.lineTo(stemW * 0.25, y0 + stemH * 0.06)
    ctx.stroke()
  }

  const cap = ctx.createRadialGradient(0, top, 0, 0, top, stemW * 0.8)
  cap.addColorStop(0, 'rgba(255, 255, 255, 0.2)')
  cap.addColorStop(1, 'rgba(255, 255, 255, 0)')
  ctx.fillStyle = cap
  ctx.beginPath()
  ctx.ellipse(0, top + stemW * 0.2, stemW * 0.55, stemW * 0.35, 0, 0, Math.PI * 2)
  ctx.fill()
}

export function drawLeaf(ctx: CanvasRenderingContext2D, r: number, palette: ApplePalette): void {
  const top = -r * 0.76

  ctx.save()
  ctx.translate(r * 0.14, top + r * 0.05)
  ctx.rotate(0.52)

  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.bezierCurveTo(r * 0.58, -r * 0.1, r * 0.65, r * 0.38, 0, r * 0.45)
  ctx.bezierCurveTo(-r * 0.38, r * 0.3, -r * 0.45, r * 0.04, 0, 0)
  ctx.closePath()

  const leafGrad = ctx.createLinearGradient(-r * 0.25, 0, r * 0.55, r * 0.35)
  leafGrad.addColorStop(0, palette.leafLight)
  leafGrad.addColorStop(0.55, palette.leafDark)
  leafGrad.addColorStop(1, '#1a3d22')

  ctx.fillStyle = leafGrad
  ctx.fill()

  ctx.strokeStyle = 'rgba(20, 50, 30, 0.5)'
  ctx.lineWidth = Math.max(0.75, r * 0.022)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(0, r * 0.04)
  ctx.quadraticCurveTo(r * 0.2, r * 0.22, r * 0.42, r * 0.36)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)'
  ctx.lineWidth = Math.max(0.5, r * 0.016)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(0, r * 0.08)
  ctx.lineTo(r * 0.35, r * 0.28)
  ctx.strokeStyle = 'rgba(30, 70, 40, 0.35)'
  ctx.lineWidth = Math.max(0.4, r * 0.012)
  ctx.stroke()

  ctx.restore()
}

/** 确定性果斑布局（16 个点） */
const FRECKLE_SEEDS: { nx: number; ny: number; size: number; seed: number }[] = [
  { nx: -0.35, ny: -0.15, size: 0.055, seed: 1 },
  { nx: -0.12, ny: -0.28, size: 0.04, seed: 2 },
  { nx: 0.18, ny: -0.22, size: 0.048, seed: 3 },
  { nx: 0.38, ny: -0.05, size: 0.035, seed: 4 },
  { nx: -0.42, ny: 0.12, size: 0.042, seed: 5 },
  { nx: -0.08, ny: 0.05, size: 0.038, seed: 6 },
  { nx: 0.25, ny: 0.08, size: 0.05, seed: 7 },
  { nx: 0.45, ny: 0.2, size: 0.032, seed: 8 },
  { nx: -0.28, ny: 0.28, size: 0.036, seed: 9 },
  { nx: 0.05, ny: 0.32, size: 0.044, seed: 10 },
  { nx: 0.32, ny: 0.35, size: 0.03, seed: 11 },
  { nx: -0.5, ny: -0.02, size: 0.028, seed: 12 },
  { nx: 0.1, ny: -0.38, size: 0.033, seed: 13 },
  { nx: -0.22, ny: -0.35, size: 0.037, seed: 14 },
  { nx: 0.42, ny: -0.32, size: 0.031, seed: 15 },
  { nx: -0.15, ny: 0.42, size: 0.034, seed: 16 },
]

export function drawFreckles(
  ctx: CanvasRenderingContext2D,
  r: number,
  palette: ApplePalette,
): void {
  ctx.save()
  clipAppleBody(ctx, r)

  for (const f of FRECKLE_SEEDS) {
    const jitter = hash2D(f.nx * 10, f.ny * 10, f.seed) * 0.02
    const x = (f.nx + jitter) * r
    const y = (f.ny + jitter * 0.5) * r
    const rx = r * f.size * (0.85 + hash2D(f.seed, f.nx, 1) * 0.3)
    const ry = rx * (0.7 + hash2D(f.seed, f.ny, 2) * 0.25)
    const rot = hash2D(f.seed, f.ny, 3) * Math.PI

    const spot = ctx.createRadialGradient(x, y, 0, x, y, rx * 1.4)
    const mix = hash2D(f.seed, f.nx + f.ny, 4)
    spot.addColorStop(0, mix > 0.5 ? palette.freckleLight : palette.freckleDark)
    spot.addColorStop(0.5, palette.freckleDark)
    spot.addColorStop(1, 'rgba(0, 0, 0, 0)')

    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(rot)
    ctx.globalAlpha = 0.35 + hash2D(f.seed, 5, 6) * 0.25
    ctx.fillStyle = spot
    ctx.beginPath()
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  ctx.restore()
}
