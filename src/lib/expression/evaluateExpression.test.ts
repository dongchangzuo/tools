import { describe, expect, it } from 'vitest'
import { evaluateExpression, ExpressionError } from './index.ts'

describe('evaluateExpression', () => {
  it('evaluates nested brackets', () => {
    expect(evaluateExpression('[(1+2)*3]-2')).toBe(7)
  })

  it('evaluates curly braces', () => {
    expect(evaluateExpression('{10/[2+3]}')).toBe(2)
  })

  it('normalizes full-width characters', () => {
    expect(evaluateExpression('（１＋２）＊３')).toBe(9)
    expect(evaluateExpression('｛（１＋２）＊３｝－２')).toBe(7)
  })

  it('supports decimals', () => {
    expect(evaluateExpression('1.5+2.5')).toBe(4)
  })

  it('supports unary minus', () => {
    expect(evaluateExpression('-3+5')).toBe(2)
    expect(evaluateExpression('(-3)*2')).toBe(-6)
  })

  it('throws on unbalanced parentheses', () => {
    expect(() => evaluateExpression('(1+2')).toThrow(ExpressionError)
    expect(() => evaluateExpression('(1+2')).toThrow(
      expect.objectContaining({ code: 'UNBALANCED_PAREN' }),
    )
  })

  it('throws on mismatched bracket types', () => {
    expect(() => evaluateExpression('[1+2)')).toThrow(ExpressionError)
    expect(() => evaluateExpression('[1+2)')).toThrow(
      expect.objectContaining({ code: 'UNBALANCED_PAREN' }),
    )
  })

  it('throws on invalid syntax', () => {
    expect(() => evaluateExpression('1++2')).toThrow(ExpressionError)
    expect(() => evaluateExpression('1++2')).toThrow(
      expect.objectContaining({ code: 'INVALID_SYNTAX' }),
    )
  })

  it('throws on division by zero', () => {
    expect(() => evaluateExpression('1/0')).toThrow(ExpressionError)
    expect(() => evaluateExpression('1/0')).toThrow(
      expect.objectContaining({ code: 'DIVISION_BY_ZERO' }),
    )
  })

  it('throws on empty expression', () => {
    expect(() => evaluateExpression('')).toThrow(ExpressionError)
    expect(() => evaluateExpression('   ')).toThrow(
      expect.objectContaining({ code: 'EMPTY' }),
    )
  })

  it('throws on empty parentheses', () => {
    expect(() => evaluateExpression('()')).toThrow(ExpressionError)
  })
})
