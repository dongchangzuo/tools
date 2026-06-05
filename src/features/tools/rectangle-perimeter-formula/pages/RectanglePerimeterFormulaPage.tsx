import { useLayoutEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '../../../../shared/animation/usePrefersReducedMotion'
import { buildStepTimeline } from '../animation/buildStepTimeline'
import { setStrokeVisible } from '../animation/strokePath'
import { DimensionSliders } from '../components/DimensionSliders'
import { FormulaRectangleSvg } from '../components/FormulaRectangleSvg'
import { LessonControls } from '../components/LessonControls'
import { LessonSummaryTable } from '../components/LessonSummaryTable'
import { SubtitleBar } from '../components/SubtitleBar'
import { useFormulaLesson } from '../hooks/useFormulaLesson'
import '../rectangle-perimeter-formula.css'

export function RectanglePerimeterFormulaPage() {
  const reducedMotion = usePrefersReducedMotion()
  const lesson = useFormulaLesson()
  const { phase, registerTimeline, killTimeline, lengthA, widthB } = lesson

  const shapeGroupRef = useRef<SVGGElement>(null)
  const idleBottomRef = useRef<SVGLineElement>(null)
  const idleRightRef = useRef<SVGLineElement>(null)
  const redPathRef = useRef<SVGPathElement>(null)
  const greenPathRef = useRef<SVGPathElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const revealDetailRef = useRef<HTMLParagraphElement>(null)

  useLayoutEffect(() => {
    const refs = {
      shapeGroup: shapeGroupRef.current,
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
    if (phase < 6) return
    setStrokeVisible(redPathRef.current)
    setStrokeVisible(greenPathRef.current)
  }, [phase, lengthA, widthB])

  return (
    <main className="rpf-page rpf-page--minimal">
      <header className="rpf-page__header">
        <p className="rpf-page__eyebrow">周长公式</p>
      </header>

      <section className="rpf-page__stage" aria-label="公式推导">
        <FormulaRectangleSvg
          lengthA={lengthA}
          widthB={widthB}
          phase={phase}
          shapeGroupRef={shapeGroupRef}
          idleBottomRef={idleBottomRef}
          idleRightRef={idleRightRef}
          redPathRef={redPathRef}
          greenPathRef={greenPathRef}
        />
      </section>

      <LessonSummaryTable phase={phase} />

      <SubtitleBar
        phase={phase}
        disabled={lesson.isAnimating}
        onPrimary={lesson.continueLesson}
        subtitleRef={subtitleRef}
        revealDetailRef={revealDetailRef}
      />

      <LessonControls
        showBack={lesson.showBack}
        showSkip={lesson.showSkip}
        showExploreLink={lesson.showExploreLink}
        disabled={lesson.isAnimating}
        onBack={lesson.back}
        onSkip={lesson.skipToReveal}
      />

      {lesson.canAdjustDimensions && (
        <DimensionSliders
          lengthA={lengthA}
          widthB={widthB}
          disabled={lesson.isAnimating}
          onLengthChange={lesson.setLengthA}
          onWidthChange={lesson.setWidthB}
        />
      )}
    </main>
  )
}
