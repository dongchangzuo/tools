import type { FailureReason, ShapeKind } from '../types'

export type SubstitutionRule =
  | { kind: 'pair'; from: ShapeKind; to: ShapeKind }
  | { kind: 'sum'; from: ShapeKind; fromCount: number; to: ShapeKind }

export type NumericSumRule = {
  kind: 'numericSum'
  terms: ShapeKind[]
  value: number
}

export type SlotsProblem = {
  mode: 'slots'
  rule: SubstitutionRule
  left: ShapeKind[]
  slotCount: number
}

export type NumericProblem = {
  mode: 'numeric'
  rule: NumericSumRule
  left: ShapeKind[]
}

export type Problem = SlotsProblem | NumericProblem

export const DEFAULT_PROBLEM: SlotsProblem = {
  mode: 'slots',
  rule: { kind: 'pair', from: 'triangle', to: 'circle' },
  left: ['triangle', 'triangle'],
  slotCount: 2,
}

export const DEMO2_PROBLEM: SlotsProblem = {
  mode: 'slots',
  rule: { kind: 'sum', from: 'triangle', fromCount: 2, to: 'circle' },
  left: ['triangle', 'triangle', 'circle'],
  slotCount: 2,
}

export const DEMO3_PROBLEM: NumericProblem = {
  mode: 'numeric',
  rule: { kind: 'numericSum', terms: ['triangle', 'circle'], value: 15 },
  left: ['triangle', 'triangle', 'circle', 'circle'],
}

function shapeWeight(shape: ShapeKind, rule: SubstitutionRule): number {
  if (rule.kind === 'pair') {
    return 1
  }
  if (shape === rule.to) {
    return rule.fromCount
  }
  return 1
}

export function sumShapes(shapes: ShapeKind[], rule: SubstitutionRule): number {
  return shapes.reduce((acc, s) => acc + shapeWeight(s, rule), 0)
}

function countShapes(shapes: ShapeKind[]): Record<ShapeKind, number> {
  const counts: Record<ShapeKind, number> = { triangle: 0, circle: 0 }
  for (const s of shapes) {
    counts[s] += 1
  }
  return counts
}

export function expectedNumericAnswer(problem: NumericProblem): number {
  const { terms, value } = problem.rule
  const counts = countShapes(problem.left)
  const groups = Math.min(...terms.map((t) => counts[t] ?? 0))
  return groups * value
}

export type ValidateResult =
  | { ok: true }
  | { ok: false; reason: FailureReason }

export function validateAnswer(
  problem: SlotsProblem,
  slots: (ShapeKind | null)[],
): ValidateResult {
  if (slots.length !== problem.slotCount) {
    return { ok: false, reason: 'unequal' }
  }

  if (slots.some((s) => s === null)) {
    return { ok: false, reason: 'empty' }
  }

  const leftTotal = sumShapes(problem.left, problem.rule)
  const rightTotal = sumShapes(slots as ShapeKind[], problem.rule)

  if (leftTotal !== rightTotal) {
    return { ok: false, reason: 'unequal' }
  }

  return { ok: true }
}

export function validateNumericAnswer(
  problem: NumericProblem,
  answer: string | null,
): ValidateResult {
  if (answer === null || answer.trim() === '') {
    return { ok: false, reason: 'empty' }
  }

  const parsed = Number.parseInt(answer, 10)
  if (Number.isNaN(parsed)) {
    return { ok: false, reason: 'unequal' }
  }

  if (parsed !== expectedNumericAnswer(problem)) {
    return { ok: false, reason: 'unequal' }
  }

  return { ok: true }
}

export function failureMessage(
  reason: FailureReason,
  mode: 'slots' | 'numeric' = 'slots',
): string {
  if (mode === 'numeric') {
    switch (reason) {
      case 'empty':
        return '请先输入答案'
      case 'unequal':
        return '再算算，想想 △+○=15'
    }
  }
  switch (reason) {
    case 'empty':
      return '请先补全右边的图形'
    case 'unequal':
      return '两边不一样哦，再想想代换规则'
  }
}
