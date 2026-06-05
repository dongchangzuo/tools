export type PerimeterValidation =
  | { valid: true; half: number }
  | { valid: false; error: string }

export function validatePerimeter(perimeter: number): PerimeterValidation {
  if (!Number.isFinite(perimeter) || !Number.isInteger(perimeter)) {
    return { valid: false, error: '请输入整数' }
  }
  if (perimeter < 4) {
    return { valid: false, error: '周长至少为 4' }
  }
  if (perimeter % 2 !== 0) {
    return { valid: false, error: '周长必须是偶数' }
  }
  return { valid: true, half: perimeter / 2 }
}
