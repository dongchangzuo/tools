import { Link } from 'react-router-dom'
import { usePrefersReducedMotion } from '../../../../shared/animation/usePrefersReducedMotion'
import { FormulaDisplay } from '../components/FormulaDisplay'
import { HalfPerimeterBar } from '../components/HalfPerimeterBar'
import { PerimeterControls } from '../components/PerimeterControls'
import { RectangleScene } from '../components/RectangleScene'
import { SolutionList } from '../components/SolutionList'
import { usePerimeterExplorer } from '../hooks/usePerimeterExplorer'
import '../rectangle-perimeter.css'

export function RectanglePerimeterPage() {
  const reducedMotion = usePrefersReducedMotion()
  const explorer = usePerimeterExplorer({ reducedMotion })

  const controlsDisabled = explorer.demoPlaying || !explorer.validation.valid

  return (
    <main className="rp-page">
      <header className="rp-page__header">
        <p className="rp-page__eyebrow">探索工具</p>
        <h1 className="rp-page__title">长方形周长</h1>
        <p className="rp-page__lead">拖一拖，周长不会变。看看长变长时，宽怎么变短。</p>
      </header>

      {explorer.validation.valid ? (
        <div className="rp-page__layout">
          <section className="rp-page__workspace" aria-label="长方形探索区域">
            <FormulaDisplay
              length={explorer.length}
              verticalWidth={explorer.verticalWidth}
              half={explorer.half}
              perimeter={explorer.perimeter}
            />
            <HalfPerimeterBar
              length={explorer.length}
              verticalWidth={explorer.verticalWidth}
              half={explorer.half}
            />
            <RectangleScene
              length={explorer.length}
              verticalWidth={explorer.verticalWidth}
              half={explorer.half}
              isDragging={explorer.isDragging}
              disabled={controlsDisabled}
              onBeginDrag={explorer.beginDrag}
              onDrag={explorer.updateLengthFromPointer}
              onEndDrag={explorer.endDrag}
              onNudge={explorer.nudgeLength}
            />
          </section>

          <SolutionList
            pairs={explorer.pairs}
            activeIndex={explorer.activeIndex}
            demoIndex={explorer.demoIndex}
            demoPlaying={explorer.demoPlaying}
            onSelect={(index) => explorer.goToPair(index)}
            onPlayDemo={explorer.playDemo}
            onStopDemo={explorer.stopDemo}
          />
        </div>
      ) : (
        <p className="rp-page__invalid" role="alert">
          请选择一个有效的偶数周长（至少 4）。
        </p>
      )}

      <PerimeterControls
        perimeter={explorer.perimeter}
        onChange={explorer.setPerimeter}
        disabled={explorer.demoPlaying}
      />

      <footer className="rp-page__footer">
        <Link className="rp-link" to="/tools/rectangle-perimeter-formula">
          还没懂公式？先看推导 →
        </Link>
      </footer>
    </main>
  )
}
