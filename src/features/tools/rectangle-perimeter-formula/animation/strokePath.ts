import { gsap, gsapDuration } from '../../../../shared/animation/gsapDefaults'

export function resetStrokeHidden(path: SVGPathElement | null): number {
  if (!path) return 0
  const length = path.getTotalLength()
  gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })
  return length
}

export function setStrokeVisible(path: SVGPathElement | null): void {
  if (!path) return
  const length = path.getTotalLength()
  gsap.set(path, { strokeDasharray: length, strokeDashoffset: 0 })
}

export function animateStroke(
  path: SVGPathElement | null,
  reducedMotion: boolean,
  duration = 0.8,
): gsap.core.Tween | gsap.core.Timeline {
  if (!path) return gsap.timeline()

  const length = path.getTotalLength()
  if (reducedMotion) {
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: 0 })
    return gsap.timeline()
  }

  gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })
  return gsap.to(path, {
    strokeDashoffset: 0,
    duration: gsapDuration(reducedMotion, duration),
    ease: 'power2.inOut',
  })
}
