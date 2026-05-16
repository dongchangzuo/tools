import { CLOSE_TO_OPEN, ExpressionError, isCloseParen, isOpenParen } from './types.ts'
import type { OpenParen, Token } from './types.ts'

export function validateTokens(tokens: Token[]): void {
  if (tokens.length === 0) {
    throw new ExpressionError('Expression is empty', 'EMPTY')
  }

  validateParentheses(tokens)
  validateTokenSequence(tokens)
}

function validateParentheses(tokens: Token[]): void {
  const stack: OpenParen[] = []

  for (const token of tokens) {
    if (token.type !== 'paren') continue

    if (isOpenParen(token.value)) {
      stack.push(token.value)
      continue
    }

    if (stack.length === 0) {
      throw new ExpressionError('Unbalanced parentheses', 'UNBALANCED_PAREN')
    }

    const open = stack[stack.length - 1]!
    if (CLOSE_TO_OPEN[token.value] !== open) {
      throw new ExpressionError('Mismatched parentheses', 'UNBALANCED_PAREN')
    }

    stack.pop()
  }

  if (stack.length > 0) {
    throw new ExpressionError('Unbalanced parentheses', 'UNBALANCED_PAREN')
  }
}

function validateTokenSequence(tokens: Token[]): void {
  let expectOperand = true

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]!
    const next = tokens[i + 1]

    if (expectOperand) {
      if (token.type === 'number') {
        expectOperand = false
        continue
      }
      if (token.type === 'paren' && isOpenParen(token.value)) {
        if (
          next?.type === 'paren' &&
          isCloseParen(next.value) &&
          CLOSE_TO_OPEN[next.value] === token.value
        ) {
          throw new ExpressionError('Empty parentheses', 'INVALID_SYNTAX')
        }
        expectOperand = true
        continue
      }
      throw new ExpressionError('Expected operand', 'INVALID_SYNTAX')
    }

    if (token.type === 'operator') {
      expectOperand = true
      continue
    }

    if (token.type === 'paren' && isCloseParen(token.value)) {
      expectOperand = false
      continue
    }

    throw new ExpressionError('Expected operator', 'INVALID_SYNTAX')
  }

  if (expectOperand) {
    throw new ExpressionError('Expression cannot end with an operator', 'INVALID_SYNTAX')
  }
}
