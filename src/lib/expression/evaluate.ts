import { normalizeExpression } from './normalize.ts'
import { tokenize } from './tokenize.ts'
import { validateTokens } from './validate.ts'
import { ExpressionError, isCloseParen, isOpenParen } from './types.ts'
import type { Operator, OpenParen, Token } from './types.ts'

const PRECEDENCE: Record<Operator, number> = {
  '+': 1,
  '-': 1,
  '*': 2,
  '/': 2,
}

export function evaluateExpression(expression: string): number {
  const normalized = normalizeExpression(expression)
  if (normalized.length === 0) {
    throw new ExpressionError('Expression is empty', 'EMPTY')
  }

  const tokens = tokenize(normalized)
  validateTokens(tokens)
  return evaluateTokens(tokens)
}

function evaluateTokens(tokens: Token[]): number {
  const values: number[] = []
  const ops: (Operator | OpenParen)[] = []

  for (const token of tokens) {
    if (token.type === 'number') {
      values.push(token.value)
      continue
    }

    if (token.type === 'paren' && isOpenParen(token.value)) {
      ops.push(token.value)
      continue
    }

    if (token.type === 'paren' && isCloseParen(token.value)) {
      while (ops.length > 0 && !isOpenParen(ops[ops.length - 1]!)) {
        applyTopOperator(values, ops)
      }
      if (ops.length === 0) {
        throw new ExpressionError('Unbalanced parentheses', 'UNBALANCED_PAREN')
      }
      ops.pop()
      continue
    }

    if (token.type === 'operator') {
      while (
        ops.length > 0 &&
        !isOpenParen(ops[ops.length - 1]!) &&
        PRECEDENCE[ops[ops.length - 1] as Operator] >= PRECEDENCE[token.value]
      ) {
        applyTopOperator(values, ops)
      }
      ops.push(token.value)
    }
  }

  while (ops.length > 0) {
    if (isOpenParen(ops[ops.length - 1]!)) {
      throw new ExpressionError('Unbalanced parentheses', 'UNBALANCED_PAREN')
    }
    applyTopOperator(values, ops)
  }

  if (values.length !== 1) {
    throw new ExpressionError('Invalid expression', 'INVALID_SYNTAX')
  }

  return values[0]!
}

function applyTopOperator(values: number[], ops: (Operator | OpenParen)[]): void {
  const op = ops.pop()
  if (!op || isOpenParen(op)) {
    throw new ExpressionError('Invalid operator stack', 'INVALID_SYNTAX')
  }

  const right = values.pop()
  const left = values.pop()
  if (right === undefined || left === undefined) {
    throw new ExpressionError('Missing operand', 'INVALID_SYNTAX')
  }

  switch (op) {
    case '+':
      values.push(left + right)
      break
    case '-':
      values.push(left - right)
      break
    case '*':
      values.push(left * right)
      break
    case '/':
      if (right === 0) {
        throw new ExpressionError('Division by zero', 'DIVISION_BY_ZERO')
      }
      values.push(left / right)
      break
  }
}
