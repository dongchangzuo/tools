import { gsap } from '../../../../shared/animation/gsapDefaults'

export function pickElements(...targets: (Element | null | undefined)[]): Element[] {
  return targets.filter((target): target is Element => target != null)
}

export function setElements(targets: (Element | null | undefined)[], vars: gsap.TweenVars): void {
  const list = pickElements(...targets)
  if (list.length > 0) gsap.set(list, vars)
}

export function setElement(target: Element | null | undefined, vars: gsap.TweenVars): void {
  if (target) gsap.set(target, vars)
}

export function timelineFromTo(
  timeline: gsap.core.Timeline,
  target: Element | null | undefined,
  fromVars: gsap.TweenVars,
  toVars: gsap.TweenVars,
  position?: gsap.Position,
): void {
  if (target) timeline.fromTo(target, fromVars, toVars, position)
}

export function timelineFromToAll(
  timeline: gsap.core.Timeline,
  targets: (Element | null | undefined)[],
  fromVars: gsap.TweenVars,
  toVars: gsap.TweenVars,
  position?: gsap.Position,
): void {
  const list = pickElements(...targets)
  if (list.length > 0) timeline.fromTo(list, fromVars, toVars, position)
}
