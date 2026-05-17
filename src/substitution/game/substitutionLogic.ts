import type { FailureReason, ShapeKind } from '../types'

export type SubstitutionRule = {
  from: ShapeKind
  to: ShapeKind
}

export type Problem = {
  rule: SubstitutionRule
  left: ShapeKind[]
  slotCount: number
}

export const DEFAULT_PROBLEM: Problem = {
  rule: { from: 'triangle', to: 'circle' },
  left: ['triangle', 'triangle'],
  slotCount: 2,
}

function shapeWeight(_shape: ShapeKind, _rule: SubstitutionRule): number {
  return 1
}

export function sumShapes(shapes: ShapeKind[], rule: SubstitutionRule): number {
  return shapes.reduce((acc, s) => acc + shapeWeight(s, rule), 0)
}

export type ValidateResult =
  | { ok: true }
  | { ok: false; reason: FailureReason }

export function validateAnswer(
  problem: Problem,
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

export function failureMessage(reason: FailureReason): string {
  switch (reason) {
    case 'empty':
      return '请先补全右边的图形'
    case 'unequal':
      return '两边不一样哦，再想想代换规则'
  }
}
