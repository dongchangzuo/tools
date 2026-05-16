import { describe, expect, it } from 'vitest'
import { CRACK_DURATION, getCrackProgress } from './balanceEqualsCrack.ts'

describe('getCrackProgress', () => {
  it('returns 0 at start', () => {
    expect(getCrackProgress(0)).toBe(0)
  })

  it('reaches 1 after crack duration', () => {
    expect(getCrackProgress(CRACK_DURATION)).toBe(1)
    expect(getCrackProgress(CRACK_DURATION + 1)).toBe(1)
  })

  it('eases out mid-animation', () => {
    const mid = getCrackProgress(CRACK_DURATION / 2)
    expect(mid).toBeGreaterThan(0.4)
    expect(mid).toBeLessThan(0.9)
  })
})
