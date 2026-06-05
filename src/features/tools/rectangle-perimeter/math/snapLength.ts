export function clampLength(length: number, half: number): number {
  if (half <= 1) return 1
  return Math.min(half - 1, Math.max(1, length))
}

export function snapLength(raw: number, half: number): number {
  return clampLength(Math.round(raw), half)
}

export function lengthFromPointerX(
  pointerX: number,
  originX: number,
  cellSize: number,
  half: number,
): number {
  if (cellSize <= 0) return 1
  return clampLength((pointerX - originX) / cellSize, half)
}
