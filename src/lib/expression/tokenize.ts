import { ExpressionError } from './types.ts'
import type { Operator, Paren, Token } from './types.ts'

const OPERATORS = new Set<string>(['+', '-', '*', '/'])
const PARENS = new Set<string>(['(', ')', '[', ']', '{', '}'])

function isDigit(char: string): boolean {
  return char >= '0' && char <= '9'
}

export function tokenize(expression: string): Token[] {
  const tokens: Token[] = []
  let i = 0

  while (i < expression.length) {
    const char = expression[i]!

    if (isDigit(char) || char === '.') {
      const start = i
      let hasDot = char === '.'
      i++

      while (i < expression.length) {
        const next = expression[i]!
        if (isDigit(next)) {
          i++
          continue
        }
        if (next === '.' && !hasDot) {
          hasDot = true
          i++
          continue
        }
        break
      }

      const raw = expression.slice(start, i)
      if (!/^\d*\.?\d+$/.test(raw) || raw === '.' || raw.endsWith('.')) {
        throw new ExpressionError(`Invalid number: ${raw}`, 'INVALID_SYNTAX')
      }

      const value = Number(raw)
      if (!Number.isFinite(value)) {
        throw new ExpressionError(`Invalid number: ${raw}`, 'INVALID_SYNTAX')
      }

      tokens.push({ type: 'number', value })
      continue
    }

    if (OPERATORS.has(char)) {
      if (char === '-' && isUnaryMinusPosition(tokens)) {
        tokens.push({ type: 'number', value: 0 })
      }
      tokens.push({ type: 'operator', value: char as Operator })
      i++
      continue
    }

    if (PARENS.has(char)) {
      tokens.push({ type: 'paren', value: char as Paren })
      i++
      continue
    }

    throw new ExpressionError(`Invalid character: ${char}`, 'INVALID_CHAR')
  }

  return tokens
}

function isUnaryMinusPosition(tokens: Token[]): boolean {
  if (tokens.length === 0) return true
  const last = tokens[tokens.length - 1]!
  if (last.type === 'operator') return true
  if (last.type === 'paren' && isOpenParenToken(last)) return true
  return false
}

function isOpenParenToken(token: Token): boolean {
  return token.type === 'paren' && (token.value === '(' || token.value === '[' || token.value === '{')
}
