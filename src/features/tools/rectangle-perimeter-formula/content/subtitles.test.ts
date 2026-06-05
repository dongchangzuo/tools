import { describe, expect, it } from 'vitest'
import { getSubtitle, SUBTITLES } from './subtitles'

describe('subtitles', () => {
  it('has no answer hints before phase 6', () => {
    for (let phase = 1; phase <= 5; phase += 1) {
      const text = SUBTITLES[phase] ?? ''
      expect(text).not.toMatch(/×|\+.*\+|b \+ a/i)
    }
  })

  it('shows formula at phase 6', () => {
    expect(getSubtitle(6)).toContain('× 2')
  })
})
