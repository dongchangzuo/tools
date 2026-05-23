import { describe, expect, it } from 'vitest'
import {
  BALANCE_WIDTH,
  getHookAnchors,
  getPanCenterWorld,
  hitTestHook,
  PIVOT_X,
} from './geometry'

describe('balance-hook geometry', () => {
  it('hook anchors are symmetric about pivot at tilt 0', () => {
    const { left, right } = getHookAnchors(0)
    expect(left.x + right.x).toBeCloseTo(PIVOT_X * 2, 0)
    expect(left.y).toBeCloseTo(right.y, 0)
  })

  it('hitTestHook returns side near pan center', () => {
    const pan = getPanCenterWorld('left', 0)
    expect(hitTestHook(pan.x, pan.y, 0)).toBe('left')
    expect(hitTestHook(pan.x + 80, pan.y, 0)).toBeNull()
  })

  it('hitTestHook detects right pan', () => {
    const pan = getPanCenterWorld('right', 0)
    expect(hitTestHook(pan.x, pan.y, 0)).toBe('right')
  })

  it('anchors stay within canvas bounds at rest', () => {
    const { left, right } = getHookAnchors(0)
    for (const p of [left, right]) {
      expect(p.x).toBeGreaterThan(0)
      expect(p.x).toBeLessThan(BALANCE_WIDTH)
      expect(p.y).toBeGreaterThan(0)
    }
  })
})
