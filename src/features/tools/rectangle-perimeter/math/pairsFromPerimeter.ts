import { validatePerimeter } from './validatePerimeter'

export type RectanglePair = {
  length: number
  width: number
}

export function pairsFromPerimeter(perimeter: number): RectanglePair[] {
  const validation = validatePerimeter(perimeter)
  if (!validation.valid) return []

  const half = validation.half
  const pairs: RectanglePair[] = []
  for (let length = 1; length <= half - 1; length += 1) {
    pairs.push({ length, width: half - length })
  }
  return pairs
}
