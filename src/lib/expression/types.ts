export type Operator = '+' | '-' | '*' | '/'

export type OpenParen = '(' | '[' | '{'
export type CloseParen = ')' | ']' | '}'
export type Paren = OpenParen | CloseParen

export type Token =
  | { type: 'number'; value: number }
  | { type: 'operator'; value: Operator }
  | { type: 'paren'; value: Paren }

export type ExpressionErrorCode =
  | 'EMPTY'
  | 'INVALID_CHAR'
  | 'UNBALANCED_PAREN'
  | 'INVALID_SYNTAX'
  | 'DIVISION_BY_ZERO'

export class ExpressionError extends Error {
  readonly code: ExpressionErrorCode

  constructor(message: string, code: ExpressionErrorCode) {
    super(message)
    this.name = 'ExpressionError'
    this.code = code
  }
}

export const OPEN_TO_CLOSE: Record<OpenParen, CloseParen> = {
  '(': ')',
  '[': ']',
  '{': '}',
}

export const CLOSE_TO_OPEN: Record<CloseParen, OpenParen> = {
  ')': '(',
  ']': '[',
  '}': '{',
}

export function isOpenParen(char: string): char is OpenParen {
  return char === '(' || char === '[' || char === '{'
}

export function isCloseParen(char: string): char is CloseParen {
  return char === ')' || char === ']' || char === '}'
}
