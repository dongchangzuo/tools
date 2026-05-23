export type PaintSceneOptions = {
  width: number
  height: number
  background?: string
  draw: () => void
}

export function paintShapeScene(
  ctx: CanvasRenderingContext2D,
  options: PaintSceneOptions,
): void {
  const { width, height, background = '#ffffff', draw } = options
  ctx.clearRect(0, 0, width, height)
  if (background !== 'transparent') {
    ctx.fillStyle = background
    ctx.fillRect(0, 0, width, height)
  }
  draw()
}
