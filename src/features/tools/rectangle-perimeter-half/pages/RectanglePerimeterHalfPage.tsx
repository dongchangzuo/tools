import { useLayoutEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '../../../../shared/animation/usePrefersReducedMotion'
import { setStrokeVisible } from '../../rectangle-perimeter-formula/animation/strokePath'
import { buildStepTimeline } from '../animation/buildStepTimeline'
import { HalfLessonControls } from '../components/HalfLessonControls'
import { HalfRectangleSvg } from '../components/HalfRectangleSvg'
import { HalfSubtitleBar } from '../components/HalfSubtitleBar'
import { HalfSummaryTable } from '../components/HalfSummaryTable'
import { useHalfLesson } from '../hooks/useHalfLesson'
import '../../rectangle-perimeter-formula/rectangle-perimeter-formula.css'
import '../rectangle-perimeter-half.css'

export function RectanglePerimeterHalfPage() {
  const reducedMotion = usePrefersReducedMotion()
  const lesson = useHalfLesson()
  const { phase, registerTimeline, killTimeline } = lesson

  const shapeGroupRef = useRef<SVGGElement>(null)
  const perimeterBadgeRef = useRef<HTMLParagraphElement>(null)
  const idleBottomRef = useRef<SVGLineElement>(null)
  const idleRightRef = useRef<SVGLineElement>(null)
  const redPathRef = useRef<SVGPathElement>(null)
  const greenPathRef = useRef<SVGPathElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const revealDetailRef = useRef<HTMLParagraphElement>(null)

  useLayoutEffect(() => {
    const refs = {
      shapeGroup: shapeGroupRef.current,
      perimeterBadge: perimeterBadgeRef.current,
      subtitle: subtitleRef.current,
      revealDetail: revealDetailRef.current,
      idleBottom: idleBottomRef.current,
      idleRight: idleRightRef.current,
      redPath: redPathRef.current,
      greenPath: greenPathRef.current,
    }

    const timeline = buildStepTimeline({ phase, reducedMotion, refs })
    registerTimeline(timeline)

    return () => {
      killTimeline()
    }
  }, [phase, reducedMotion, registerTimeline, killTimeline])

  useLayoutEffect(() => {
    if (phase < 7) return
    setStrokeVisible(redPathRef.current)
    setStrokeVisible(greenPathRef.current)
  }, [phase])

  return (
    <main className="rpf-page rpf-page--minimal">
      <header className="rpf-page__header">
        <p className="rpf-page__eyebrow">半周长</p>
      </header>

      <section className="rpf-page__stage" aria-label="已知周长求半周长">
        <HalfRectangleSvg
          phase={phase}
          shapeGroupRef={shapeGroupRef}
          perimeterBadgeRef={perimeterBadgeRef}
          idleBottomRef={idleBottomRef}
          idleRightRef={idleRightRef}
          redPathRef={redPathRef}
          greenPathRef={greenPathRef}
        />
      </section>

      <HalfSummaryTable phase={phase} />

      <HalfSubtitleBar
        phase={phase}
        disabled={lesson.isAnimating}
        onPrimary={lesson.continueLesson}
        subtitleRef={subtitleRef}
        revealDetailRef={revealDetailRef}
      />

      <HalfLessonControls
        showBack={lesson.showBack}
        showSkip={lesson.showSkip}
        showExploreLink={lesson.showExploreLink}
        disabled={lesson.isAnimating}
        onBack={lesson.back}
        onSkip={lesson.skipToReveal}
      />
    </main>
  )
}
