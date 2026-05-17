import { describe, expect, it } from 'vitest'
import { DEFAULT_PROBLEM, validateAnswer } from './substitutionLogic'

describe('validateAnswer', () => {
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
