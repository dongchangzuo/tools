import type { RectanglePair } from '../math/pairsFromPerimeter'
import { gsap, GSAP_EASE_DEMO, gsapDuration, gsapPause } from '../../../../shared/animation/gsapDefaults'

type BuildDemoTimelineOptions = {
  pairs: RectanglePair[]
  getLength: () => number
  setLength: (length: number) => void
  onStep: (index: number) => void
  reducedMotion: boolean
  onComplete?: () => void
}

export function buildDemoTimeline({
  pairs,
  getLength,
  setLength,
  onStep,
  reducedMotion,
  onComplete,
}: BuildDemoTimelineOptions): gsap.core.Timeline {
  const tl = gsap.timeline({ onComplete })
  const duration = gsapDuration(reducedMotion, 0.45)
  const pause = gsapPause(reducedMotion, 0.6)

  pairs.forEach((pair, index) => {
    const proxy = { length: index === 0 ? getLength() : pairs[index - 1]!.length }

    tl.to(
      proxy,
      {
        length: pair.length,
        duration,
        ease: reducedMotion ? 'none' : GSAP_EASE_DEMO,
        onStart: () => onStep(index),
        onUpdate: () => setLength(Math.round(proxy.length)),
      },
      index === 0 ? 0 : `+=${pause}`,
    )
  })

  return tl
}
