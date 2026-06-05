import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP)

export const GSAP_EASE_SNAP = 'back.out(1.2)'
export const GSAP_EASE_DEMO = 'power2.inOut'

export function gsapDuration(reducedMotion: boolean, normal = 0.4): number {
  return reducedMotion ? 0.01 : normal
}

export function gsapPause(reducedMotion: boolean, normal = 0.6): number {
  return reducedMotion ? 0.05 : normal
}

export { gsap, useGSAP }
