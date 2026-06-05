export function perimeter(lengthA: number, widthB: number): number {
  return (lengthA + widthB) * 2
}

export function clampDimension(value: number, min = 2, max = 12): number {
  return Math.min(max, Math.max(min, Math.round(value)))
}

export const DEFAULT_LENGTH_A = 5
export const DEFAULT_WIDTH_B = 3
