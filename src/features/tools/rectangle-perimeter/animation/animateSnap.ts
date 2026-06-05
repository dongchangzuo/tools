import { gsap, GSAP_EASE_SNAP, gsapDuration } from '../../../../shared/animation/gsapDefaults'

type AnimateLengthOptions = {
  from: number
  to: number
  reducedMotion: boolean
  onUpdate: (length: number) => void
  onComplete?: () => void
}

export function animateLength({
  from,
  to,
  reducedMotion,
  onUpdate,
  onComplete,
}: AnimateLengthOptions): gsap.core.Tween {
  const proxy = { length: from }
  onUpdate(from)

  return gsap.to(proxy, {
    length: to,
    duration: gsapDuration(reducedMotion, 0.35),
    ease: reducedMotion ? 'none' : GSAP_EASE_SNAP,
    onUpdate: () => onUpdate(proxy.length),
    onComplete,
  })
}

export function killTween(tween: gsap.core.Tween | null | undefined): void {
  tween?.kill()
}
