import { evaluateExpression, ExpressionError } from '../lib/expression/index.ts'
import type { ExpressionErrorCode } from '../lib/expression/index.ts'

export type CheckStatus = 'idle' | 'success' | 'imbalance' | 'error'

export type PanOffsets = { left: number; right: number }

export const ZERO_PAN_OFFSETS: PanOffsets = { left: 0, right: 0 }

export const MAX_TILT_RAD = Math.PI / 10
export const TILT_PER_UNIT = 0.02
export const MAX_PAN_OFFSET_PX = 36
export const PAN_OFFSET_PER_UNIT = 4

export type BalanceCompareResult =
  | {
      status: 'success'
      leftValue: number
      rightValue: number
      targetTiltRad: 0
      panOffsets: PanOffsets
      message: string
    }
  | {
      status: 'imbalance'
      leftValue: number
      rightValue: number
      targetTiltRad: number
      panOffsets: PanOffsets
      message: string
    }

export type BalanceErrorResult = {
  status: 'error'
  message: string
  targetTiltRad: 0
  panOffsets: PanOffsets
}

export function mapExpressionError(code: ExpressionErrorCode): string {
  switch (code) {
    case 'EMPTY':
      return '请输入完整算式'
    case 'INVALID_CHAR':
    case 'INVALID_SYNTAX':
      return '表达式格式有误，请检查输入'
    case 'UNBALANCED_PAREN':
      return '括号不匹配'
    case 'DIVISION_BY_ZERO':
      return '除数不能为零'
    default:
      return '表达式格式有误，请检查输入'
  }
}

export function computeTiltRad(diff: number): number {
  if (diff === 0) return 0
  return (
    -Math.sign(diff) * Math.min(MAX_TILT_RAD, Math.abs(diff) * TILT_PER_UNIT)
  )
}

export function computePanOffsets(diff: number): PanOffsets {
  if (diff === 0) return ZERO_PAN_OFFSETS
  const mag = Math.min(MAX_PAN_OFFSET_PX, Math.abs(diff) * PAN_OFFSET_PER_UNIT)
  return diff > 0 ? { left: mag, right: -mag } : { left: -mag, right: mag }
}

export function compareBalance(
  leftValue: number,
  rightValue: number,
): BalanceCompareResult {
  const diff = leftValue - rightValue

  if (diff === 0) {
    return {
      status: 'success',
      leftValue,
      rightValue,
      targetTiltRad: 0,
      panOffsets: ZERO_PAN_OFFSETS,
      message: '太棒了！两边相等，天平平衡啦',
    }
  }

  return {
    status: 'imbalance',
    leftValue,
    rightValue,
    targetTiltRad: computeTiltRad(diff),
    panOffsets: computePanOffsets(diff),
    message: '等式不平衡！较大一侧会下沉',
  }
}

export function evaluateSide(expression: string): number {
  return evaluateExpression(expression)
}

export function checkExpressions(
  leftExpression: string,
  rightExpression: string,
): BalanceCompareResult | BalanceErrorResult {
  const left = leftExpression.trim()
  const right = rightExpression.trim()

  if (!left || !right) {
    return {
      status: 'error',
      message: '请输入完整算式',
      targetTiltRad: 0,
      panOffsets: ZERO_PAN_OFFSETS,
    }
  }

  try {
    const leftValue = evaluateSide(left)
    const rightValue = evaluateSide(right)
    return compareBalance(leftValue, rightValue)
  } catch (error) {
    if (error instanceof ExpressionError) {
      return {
        status: 'error',
        message: mapExpressionError(error.code),
        targetTiltRad: 0,
        panOffsets: ZERO_PAN_OFFSETS,
      }
    }
    return {
      status: 'error',
      message: '表达式格式有误，请检查输入',
      targetTiltRad: 0,
      panOffsets: ZERO_PAN_OFFSETS,
    }
  }
}
