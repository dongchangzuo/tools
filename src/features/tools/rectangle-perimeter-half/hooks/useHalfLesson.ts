import { useCallback, useRef, useState } from 'react'
import { LESSON_PHASE_COUNT } from '../content/subtitles'

export type HalfLessonPhase = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7

export function useHalfLesson() {
  const [phase, setPhaseState] = useState<HalfLessonPhase>(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const timelineRef = useRef<ReturnType<typeof import('../animation/buildStepTimeline').buildStepTimeline> | null>(
    null,
  )

  const killTimeline = useCallback(() => {
    timelineRef.current?.kill()
    timelineRef.current = null
    setIsAnimating(false)
  }, [])

  const setPhase = useCallback(
    (next: HalfLessonPhase) => {
      const clamped = Math.min(LESSON_PHASE_COUNT - 1, Math.max(0, next)) as HalfLessonPhase
      killTimeline()
      setPhaseState(clamped)
    },
    [killTimeline],
  )

  const continueLesson = useCallback(() => {
    if (isAnimating) return
    if (phase === LESSON_PHASE_COUNT - 1) {
      killTimeline()
      setPhaseState(0)
      return
    }
    setPhase((phase + 1) as HalfLessonPhase)
  }, [isAnimating, killTimeline, phase, setPhase])

  const back = useCallback(() => {
    if (phase <= 0 || isAnimating) return
    setPhase((phase - 1) as HalfLessonPhase)
  }, [isAnimating, phase, setPhase])

  const skipToReveal = useCallback(() => {
    if (isAnimating) return
    setPhase(7)
  }, [isAnimating, setPhase])

  const registerTimeline = useCallback((timeline: typeof timelineRef.current) => {
    timelineRef.current?.kill()
    if (!timeline || timeline.duration() === 0) {
      timelineRef.current = null
      setIsAnimating(false)
      return
    }
    timelineRef.current = timeline
    setIsAnimating(true)
    timeline.eventCallback('onComplete', () => {
      setIsAnimating(false)
      if (timelineRef.current === timeline) timelineRef.current = null
    })
  }, [])

  return {
    phase,
    isAnimating,
    showBack: phase > 0,
    showSkip: phase >= 1 && phase <= 6,
    showExploreLink: phase >= 7,
    continueLesson,
    back,
    skipToReveal,
    killTimeline,
    registerTimeline,
  }
}
