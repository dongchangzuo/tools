import { describe, expect, it } from 'vitest'
import {
  checkExpressions,
  compareBalance,
  computePanOffsets,
  computeTiltRad,
} from './balanceLogic.ts'

describe('balanceLogic', () => {
  it('compareBalance returns success when equal', () => {
    const result = compareBalance(7, 7)
    expect(result.status).toBe('success')
    expect(result.targetTiltRad).toBe(0)
  })

  it('computeTiltRad is negative when left is larger', () => {
    expect(computeTiltRad(5)).toBeLessThan(0)
  })

  it('computeTiltRad is positive when right is larger', () => {
    expect(computeTiltRad(-5)).toBeGreaterThan(0)
  })

  it('computePanOffsets sinks left pan when left is larger', () => {
    const offsets = computePanOffsets(5)
    expect(offsets.left).toBeGreaterThan(0)
    expect(offsets.right).toBeLessThan(0)
  })

  it('computePanOffsets sinks right pan when right is larger', () => {
    const offsets = computePanOffsets(-5)
    expect(offsets.left).toBeLessThan(0)
    expect(offsets.right).toBeGreaterThan(0)
  })

  it('checkExpressions evaluates nested brackets', () => {
    const result = checkExpressions('[(1+2)*3]-2', '7')
    expect(result.status).toBe('success')
  })

  it('checkExpressions reports imbalance', () => {
    const result = checkExpressions('10', '5')
    expect(result.status).toBe('imbalance')
    if (result.status === 'imbalance') {
      expect(result.targetTiltRad).toBeLessThan(0)
    }
  })

  it('checkExpressions reports syntax errors', () => {
    const result = checkExpressions('(1+2', '3')
    expect(result.status).toBe('error')
  })
})
