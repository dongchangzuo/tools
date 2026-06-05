import { LESSON_PERIMETER_CM } from '../math/halfPerimeter'

export const LESSON_PHASE_COUNT = 8

export const SUBTITLES: Record<number, string | null> = {
  0: null,
  1: `周长是 ${LESSON_PERIMETER_CM} 厘米。`,
  2: '红色的长度是多少厘米？',
  3: null,
  4: '绿色的长度是多少厘米？',
  5: null,
  6: '红色和绿色，一共是几厘米？',
  7: `${LESSON_PERIMETER_CM} ÷ 2 = 8（厘米）`,
}

export function getSubtitle(phase: number): string | null {
  return SUBTITLES[phase] ?? null
}

export function getPrimaryLabel(phase: number): '开始' | '继续' | '再玩一次' {
  if (phase === 0) return '开始'
  if (phase === LESSON_PHASE_COUNT - 1) return '再玩一次'
  return '继续'
}

export function getRevealDetail(phase: number): string | null {
  if (phase === 7) return '也就是 a + b = 8 厘米'
  return null
}
