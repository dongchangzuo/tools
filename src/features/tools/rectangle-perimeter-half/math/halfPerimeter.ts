export const LESSON_PERIMETER_CM = 16

export const DEFAULT_LENGTH_A = 5
export const DEFAULT_WIDTH_B = 3

export function halfPerimeter(perimeterCm: number): number {
  return perimeterCm / 2
}

export function ropeLengthCm(perimeterCm: number): number {
  return halfPerimeter(perimeterCm)
}
