/** 主光来自左上方 */
export const KEY_LIGHT = { x: -0.55, y: -0.65 }

export function bodyRadialGradient(
  ctx: CanvasRenderingContext2D,
  r: number,
  bodyLight: string,
  bodyMid: string,
  bodyDark: string,
  bodyDeep: string,
): CanvasGradient {
  const grad = ctx.createRadialGradient(
    KEY_LIGHT.x * r * 0.9,
    KEY_LIGHT.y * r * 0.9,
    r * 0.08,
    r * 0.12,
    r * 0.15,
    r * 1.2,
  )
  grad.addColorStop(0, bodyLight)
  grad.addColorStop(0.35, bodyMid)
  grad.addColorStop(0.72, bodyDark)
  grad.addColorStop(1, bodyDeep)
  return grad
}

export function ambientVignetteGradient(
  ctx: CanvasRenderingContext2D,
  r: number,
): CanvasGradient {
  const grad = ctx.createLinearGradient(-r, -r, r * 1.1, r * 1.1)
  grad.addColorStop(0, 'rgba(0, 0, 0, 0)')
  grad.addColorStop(0.55, 'rgba(0, 0, 0, 0)')
  grad.addColorStop(1, 'rgba(30, 5, 5, 0.35)')
  return grad
}

export function subsurfaceTintGradient(
  ctx: CanvasRenderingContext2D,
  r: number,
): CanvasGradient {
  const grad = ctx.createRadialGradient(
    -r * 0.35,
    r * 0.55,
    0,
    -r * 0.2,
    r * 0.35,
    r * 0.75,
  )
  grad.addColorStop(0, 'rgba(255, 120, 80, 0.35)')
  grad.addColorStop(0.6, 'rgba(220, 60, 40, 0.12)')
  grad.addColorStop(1, 'rgba(180, 30, 20, 0)')
  return grad
}
