import { describe, expect, it } from 'vitest'
import { clampDimension, perimeter } from './perimeterFormula'

describe('perimeterFormula', () => {
  it('computes perimeter as (a+b)*2', () => {
    expect(perimeter(5, 3)).toBe(16)
    expect(perimeter(4, 4)).toBe(16)
  })

  it('clamps dimensions', () => {
    expect(clampDimension(1)).toBe(2)
    expect(clampDimension(99)).toBe(12)
    expect(clampDimension(5)).toBe(5)
  })
})
