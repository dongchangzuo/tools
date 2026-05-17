import { EquationBoard } from '../substitution/components/EquationBoard'
import { FailureScreen } from '../substitution/components/FailureScreen'
import { RuleBar } from '../substitution/components/RuleBar'
import { ShapeToolbox } from '../substitution/components/ShapeToolbox'
import { SubmitBar } from '../substitution/components/SubmitBar'
import { SuccessCelebration } from '../substitution/components/SuccessCelebration'
import { useSubstitutionGame } from '../substitution/hooks/useSubstitutionGame'
import '../substitution/substitution.css'

export function SubstitutionPage() {
  const game = useSubstitutionGame()

  return (
    <div className="substitution-page">
      <div className="app">
        <header className="app-header">
          <h1>等量代换</h1>
          <p className="app-subtitle">根据规则拖动图形，让等式两边一样多</p>
        </header>

        <main className="app-main">
          <RuleBar rule={game.problem.rule} />
          <EquationBoard
            problem={game.problem}
            slots={game.slots}
            disabled={game.locked}
            onDrop={game.setSlot}
            onClear={game.clearSlot}
          />
          <ShapeToolbox disabled={game.locked} />
          <SubmitBar
            disabled={game.locked}
            onSubmit={game.submit}
            onReset={game.reset}
          />
        </main>

        {game.status === 'success' && (
          <SuccessCelebration onPlayAgain={game.reset} />
        )}
        {game.status === 'failure' && game.failureReason && (
          <FailureScreen
            reason={game.failureReason}
            onRetry={game.retry}
            onReset={game.reset}
          />
        )}
      </div>
    </div>
  )
}
