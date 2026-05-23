import { describe, expect, it } from 'vitest'
import {
  DEFAULT_PROBLEM,
  DEMO2_PROBLEM,
  DEMO3_PROBLEM,
  expectedNumericAnswer,
  sumShapes,
  validateAnswer,
  validateNumericAnswer,
} from './substitutionLogic'

describe('validateAnswer demo 1', () => {
  it('accepts triangle triangle', () => {
    expect(validateAnswer(DEFAULT_PROBLEM, ['triangle', 'triangle'])).toEqual({
      ok: true,
    })
  })

  it('accepts triangle circle', () => {
    expect(validateAnswer(DEFAULT_PROBLEM, ['triangle', 'circle'])).toEqual({
      ok: true,
    })
  })

  it('accepts circle circle', () => {
    expect(validateAnswer(DEFAULT_PROBLEM, ['circle', 'circle'])).toEqual({
      ok: true,
    })
  })

  it('rejects empty slots', () => {
    expect(validateAnswer(DEFAULT_PROBLEM, [null, null])).toEqual({
      ok: false,
      reason: 'empty',
    })
  })

  it('rejects partial fill', () => {
    expect(validateAnswer(DEFAULT_PROBLEM, ['triangle', null])).toEqual({
      ok: false,
      reason: 'empty',
    })
  })
})

describe('validateAnswer demo 2', () => {
  it('left side totals 4 units', () => {
    expect(sumShapes(DEMO2_PROBLEM.left, DEMO2_PROBLEM.rule)).toBe(4)
  })

  it('accepts circle circle only', () => {
    expect(validateAnswer(DEMO2_PROBLEM, ['circle', 'circle'])).toEqual({
      ok: true,
    })
  })

  it('rejects triangle triangle', () => {
    expect(validateAnswer(DEMO2_PROBLEM, ['triangle', 'triangle'])).toEqual({
      ok: false,
      reason: 'unequal',
    })
  })

  it('rejects triangle circle', () => {
    expect(validateAnswer(DEMO2_PROBLEM, ['triangle', 'circle'])).toEqual({
      ok: false,
      reason: 'unequal',
    })
  })

  it('rejects empty slots', () => {
    expect(validateAnswer(DEMO2_PROBLEM, [null, null])).toEqual({
      ok: false,
      reason: 'empty',
    })
  })
})

describe('validateNumericAnswer demo 3', () => {
  it('expected answer is 30', () => {
    expect(expectedNumericAnswer(DEMO3_PROBLEM)).toBe(30)
  })

  it('accepts 30', () => {
    expect(validateNumericAnswer(DEMO3_PROBLEM, '30')).toEqual({ ok: true })
  })

  it('rejects empty answer', () => {
    expect(validateNumericAnswer(DEMO3_PROBLEM, '')).toEqual({
      ok: false,
      reason: 'empty',
    })
    expect(validateNumericAnswer(DEMO3_PROBLEM, null)).toEqual({
      ok: false,
      reason: 'empty',
    })
  })

  it('rejects wrong number', () => {
    expect(validateNumericAnswer(DEMO3_PROBLEM, '29')).toEqual({
      ok: false,
      reason: 'unequal',
    })
  })
})
