import { gsap, gsapDuration } from '../../../../shared/animation/gsapDefaults'
import { setElement, setElements, timelineFromTo, timelineFromToAll } from '../../rectangle-perimeter-formula/animation/gsapSafe'
import {
  animateStroke,
  resetStrokeHidden,
  setStrokeVisible,
} from '../../rectangle-perimeter-formula/animation/strokePath'

export type PhaseAnimationRefs = {
  shapeGroup: SVGGElement | null
  perimeterBadge: HTMLElement | null
  subtitle: HTMLElement | null
  revealDetail: HTMLElement | null
  idleBottom: SVGLineElement | null
  idleRight: SVGLineElement | null
  redPath: SVGPathElement | null
  greenPath: SVGPathElement | null
}

type BuildStepTimelineOptions = {
  phase: number
  reducedMotion: boolean
  refs: PhaseAnimationRefs
  onComplete?: () => void
}

export function applyPhaseVisualState(phase: number, refs: PhaseAnimationRefs): void {
  const showRed = phase >= 2
  const showGreen = phase >= 4

  if (phase === 0) {
    setElement(refs.shapeGroup, { autoAlpha: 0 })
  } else {
    setElement(refs.shapeGroup, { autoAlpha: 1 })
  }

  if (phase < 1) {
    setElement(refs.perimeterBadge, { autoAlpha: 0 })
  } else {
    setElement(refs.perimeterBadge, { autoAlpha: 1 })
  }

  setElements([refs.idleBottom, refs.idleRight], {
    autoAlpha: phase >= 4 ? 0.35 : 1,
  })

  if (!showRed) {
    resetStrokeHidden(refs.redPath)
  } else if (phase > 2) {
    setStrokeVisible(refs.redPath)
  }

  if (!showGreen) {
    resetStrokeHidden(refs.greenPath)
  } else if (phase > 4) {
    setStrokeVisible(refs.greenPath)
  }

  if (phase < 1 || phase === 3 || phase === 5) {
    setElement(refs.subtitle, { autoAlpha: 0 })
  } else if (phase === 6 || phase === 7) {
    setElement(refs.subtitle, { autoAlpha: 0, y: 0 })
  } else {
    setElement(refs.subtitle, { autoAlpha: 1, y: 0 })
  }

  if (phase === 7) {
    setElement(refs.revealDetail, { autoAlpha: 0, y: 0 })
  } else {
    setElement(refs.revealDetail, { autoAlpha: 0, y: 0 })
  }
}

export function buildStepTimeline({
  phase,
  reducedMotion,
  refs,
  onComplete,
}: BuildStepTimelineOptions): gsap.core.Timeline {
  applyPhaseVisualState(phase, refs)

  const tl = gsap.timeline({ onComplete })
  const duration = gsapDuration(reducedMotion, 0.5)

  if (phase === 0) {
    timelineFromTo(tl, refs.shapeGroup, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration })
    return tl
  }

  if (phase === 1) {
    resetStrokeHidden(refs.redPath)
    resetStrokeHidden(refs.greenPath)
    timelineFromTo(
      tl,
      refs.perimeterBadge,
      { autoAlpha: 0, y: 6 },
      { autoAlpha: 1, y: 0, duration: gsapDuration(reducedMotion, 0.4) },
    )
    timelineFromTo(
      tl,
      refs.subtitle,
      { autoAlpha: 0, y: 10 },
      { autoAlpha: 1, y: 0, duration: gsapDuration(reducedMotion, 0.4) },
      '<',
    )
    return tl
  }

  if (phase === 2) {
    resetStrokeHidden(refs.redPath)
    timelineFromTo(
      tl,
      refs.subtitle,
      { autoAlpha: 0, y: 10 },
      { autoAlpha: 1, y: 0, duration: gsapDuration(reducedMotion, 0.4) },
    )
    tl.add(animateStroke(refs.redPath, reducedMotion, 0.85), '<')
    return tl
  }

  if (phase === 3) {
    setStrokeVisible(refs.redPath)
    resetStrokeHidden(refs.greenPath)
    return tl
  }

  if (phase === 4) {
    setStrokeVisible(refs.redPath)
    resetStrokeHidden(refs.greenPath)
    timelineFromTo(
      tl,
      refs.subtitle,
      { autoAlpha: 0, y: 10 },
      { autoAlpha: 1, y: 0, duration: gsapDuration(reducedMotion, 0.4) },
    )
    tl.add(animateStroke(refs.greenPath, reducedMotion, 0.85), '<')
    return tl
  }

  if (phase === 5) {
    setStrokeVisible(refs.redPath)
    setStrokeVisible(refs.greenPath)
    return tl
  }

  if (phase === 6) {
    setStrokeVisible(refs.redPath)
    setStrokeVisible(refs.greenPath)
    timelineFromToAll(
      tl,
      [refs.idleBottom, refs.idleRight],
      { opacity: 0.35 },
      { opacity: 1, duration: gsapDuration(reducedMotion, 0.35), yoyo: true, repeat: 1 },
    )
    timelineFromTo(
      tl,
      refs.subtitle,
      { autoAlpha: 0, y: 8 },
      { autoAlpha: 1, y: 0, duration: gsapDuration(reducedMotion, 0.35) },
      '<',
    )
    return tl
  }

  if (phase === 7) {
    setStrokeVisible(refs.redPath)
    setStrokeVisible(refs.greenPath)
    timelineFromTo(
      tl,
      refs.subtitle,
      { autoAlpha: 0, y: 10 },
      { autoAlpha: 1, y: 0, duration: gsapDuration(reducedMotion, 0.4) },
    )
    timelineFromTo(
      tl,
      refs.revealDetail,
      { autoAlpha: 0, y: 8 },
      { autoAlpha: 1, y: 0, duration: gsapDuration(reducedMotion, 0.35) },
      '+=0.12',
    )
    return tl
  }

  return tl
}
