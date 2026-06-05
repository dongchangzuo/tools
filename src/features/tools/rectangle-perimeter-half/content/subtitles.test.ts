import { describe, expect, it } from 'vitest'
import { getRevealDetail, getSubtitle, SUBTITLES } from './subtitles'

describe('half subtitles', () => {
  it('does not reveal 8 before phase 7', () => {
    for (let phase = 1; phase <= 6; phase += 1) {
      const text = SUBTITLES[phase] ?? ''
      expect(text).not.toMatch(/÷\s*2|= 8/)
    }
  })

  it('shows reveal at phase 7', () => {
    expect(getSubtitle(7)).toContain('÷ 2')
    expect(getRevealDetail(7)).toContain('a + b')
  })
})
