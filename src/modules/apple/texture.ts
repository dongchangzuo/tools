import { fbm } from './noise'
import { clipAppleBody } from './parts'
import type { ApplePalette } from './types'

/** 蜡质果皮微纹理（在果身 clip 内叠乘） */
export function drawSkinTexture(
  ctx: CanvasRenderingContext2D,
  r: number,
  _palette: ApplePalette,
): void {
  const step = Math.max(2, Math.floor(r / 26))
  const bounds = Math.ceil(r * 1.05)

  ctx.save()
  clipAppleBody(ctx, r)
  ctx.globalCompositeOperation = 'multiply'

  for (let py = -bounds; py <= bounds; py += step) {
    for (let px = -bounds; px <= bounds; px += step) {
      const nx = px / r
      const ny = py / r
      const n = fbm(nx * 4.5 + 2.1, ny * 5.2 + 1.3, 42, 4)
      const streak = fbm(nx * 1.2, ny * 8, 17, 3)
      const combined = n * 0.65 + streak * 0.35
      const alpha = 0.04 + combined * 0.06

      ctx.fillStyle = `rgba(60, 10, 10, ${alpha})`
      ctx.fillRect(px, py, step, step)
    }
  }

  ctx.restore()

  ctx.save()
  clipAppleBody(ctx, r)
  ctx.globalCompositeOperation = 'soft-light'

  const sheen = ctx.createLinearGradient(-r * 0.5, -r, r * 0.3, r * 0.5)
  sheen.addColorStop(0, 'rgba(255, 240, 230, 0.12)')
  sheen.addColorStop(0.35, 'rgba(255, 255, 255, 0)')
  sheen.addColorStop(1, 'rgba(0, 0, 0, 0.05)')
  ctx.fillStyle = sheen
  ctx.fillRect(-r * 1.2, -r * 1.2, r * 2.4, r * 2.4)

  ctx.restore()
}
