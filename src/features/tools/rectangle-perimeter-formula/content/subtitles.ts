export const LESSON_PHASE_COUNT = 8

export const SUBTITLES: Record<number, string | null> = {
  0: null,
  1: '红色的长度是多少？',
  2: null,
  3: '绿色的长度是多少？',
  4: null,
  5: '红色 + 绿色，是不是就是长方形的周长？',
  6: '周长 = (a + b) × 2',
  7: '自己改一改长和宽',
}

export function getSubtitle(phase: number): string | null {
  return SUBTITLES[phase] ?? null
}

export function getPrimaryLabel(phase: number): '开始' | '继续' | '再玩一次' {
  if (phase === 0) return '开始'
  if (phase === LESSON_PHASE_COUNT - 1) return '再玩一次'
  return '继续'
}

export function getRevealDetail(_phase: number): string | null {
  return null
}
