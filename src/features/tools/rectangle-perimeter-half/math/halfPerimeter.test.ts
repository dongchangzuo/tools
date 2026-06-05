import { describe, expect, it } from 'vitest'
import { halfPerimeter, LESSON_PERIMETER_CM, ropeLengthCm } from './halfPerimeter'

describe('halfPerimeter', () => {
  it('returns half of perimeter', () => {
    expect(halfPerimeter(16)).toBe(8)
    expect(halfPerimeter(20)).toBe(10)
  })

  it('matches lesson constants', () => {
    expect(ropeLengthCm(LESSON_PERIMETER_CM)).toBe(8)
  })
})
