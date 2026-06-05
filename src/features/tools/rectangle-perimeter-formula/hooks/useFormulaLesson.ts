import { useCallback, useMemo, useRef, useState } from 'react'
import { LESSON_PHASE_COUNT } from '../content/subtitles'
import {
  clampDimension,
  DEFAULT_LENGTH_A,
  DEFAULT_WIDTH_B,
  perimeter,
} from '../math/perimeterFormula'

export type LessonPhase = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7

export function useFormulaLesson() {
  const [phase, setPhaseState] = useState<LessonPhase>(0)
  const [lengthA, setLengthAState] = useState(DEFAULT_LENGTH_A)
  const [widthB, setWidthBState] = useState(DEFAULT_WIDTH_B)
  const [isAnimating, setIsAnimating] = useState(false)
  const timelineRef = useRef<ReturnType<typeof import('../animation/buildStepTimeline').buildStepTimeline> | null>(
    null,
  )

  const perimeterValue = useMemo(() => perimeter(lengthA, widthB), [lengthA, widthB])

  const killTimeline = useCallback(() => {
    timelineRef.current?.kill()
    timelineRef.current = null
    setIsAnimating(false)
  }, [])

  const setPhase = useCallback(
    (next: LessonPhase) => {
      const clamped = Math.min(LESSON_PHASE_COUNT - 1, Math.max(0, next)) as LessonPhase
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
      setLengthAState(DEFAULT_LENGTH_A)
      setWidthBState(DEFAULT_WIDTH_B)
      return
    }
    setPhase((phase + 1) as LessonPhase)
  }, [isAnimating, killTimeline, phase, setPhase])

  const back = useCallback(() => {
    if (phase <= 0 || isAnimating) return
    setPhase((phase - 1) as LessonPhase)
  }, [isAnimating, phase, setPhase])

  const skipToReveal = useCallback(() => {
    if (isAnimating) return
    setPhase(6)
  }, [isAnimating, setPhase])

  const setLengthA = useCallback(
    (value: number) => {
      killTimeline()
      setLengthAState(clampDimension(value))
    },
    [killTimeline],
  )

  const setWidthB = useCallback(
    (value: number) => {
      killTimeline()
      setWidthBState(clampDimension(value))
    },
    [killTimeline],
  )

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
    lengthA,
    widthB,
    perimeterValue,
    isAnimating,
    canAdjustDimensions: phase === 7,
    showBack: phase > 0,
    showSkip: phase >= 1 && phase <= 5,
    showExploreLink: phase >= 6,
    continueLesson,
    back,
    skipToReveal,
    setLengthA,
    setWidthB,
    killTimeline,
    registerTimeline,
  }
}

export type FormulaLesson = ReturnType<typeof useFormulaLesson>
