import { describe, expect, it } from 'vitest'
import { pairsFromPerimeter } from './pairsFromPerimeter'
import { clampLength, snapLength } from './snapLength'
import { validatePerimeter } from './validatePerimeter'

describe('validatePerimeter', () => {
  it('accepts even perimeter >= 4', () => {
    expect(validatePerimeter(20)).toEqual({ valid: true, half: 10 })
  })

  it('rejects odd perimeter', () => {
    expect(validatePerimeter(15)).toEqual({ valid: false, error: '周长必须是偶数' })
  })

  it('rejects too small perimeter', () => {
    expect(validatePerimeter(2)).toEqual({ valid: false, error: '周长至少为 4' })
  })
})

describe('pairsFromPerimeter', () => {
  it('returns 9 pairs for perimeter 20', () => {
    const pairs = pairsFromPerimeter(20)
    expect(pairs).toHaveLength(9)
    expect(pairs[0]).toEqual({ length: 1, width: 9 })
    expect(pairs[8]).toEqual({ length: 9, width: 1 })
  })

  it('returns single pair for perimeter 4', () => {
    expect(pairsFromPerimeter(4)).toEqual([{ length: 1, width: 1 }])
  })

  it('returns 5 pairs for perimeter 12', () => {
    expect(pairsFromPerimeter(12)).toHaveLength(5)
  })

  it('returns empty for invalid perimeter', () => {
    expect(pairsFromPerimeter(15)).toEqual([])
    expect(pairsFromPerimeter(0)).toEqual([])
  })
})

describe('snapLength', () => {
  const half = 10

  it('snaps to nearest integer within bounds', () => {
    expect(snapLength(3.7, half)).toBe(4)
    expect(snapLength(3.2, half)).toBe(3)
  })

  it('clamps low values to 1', () => {
    expect(snapLength(0.2, half)).toBe(1)
    expect(clampLength(0.2, half)).toBe(1)
  })

  it('clamps high values to half - 1', () => {
    expect(snapLength(9.8, half)).toBe(9)
    expect(clampLength(12, half)).toBe(9)
  })
})
