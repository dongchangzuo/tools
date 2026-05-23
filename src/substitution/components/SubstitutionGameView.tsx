import type { SlotsProblem } from '../game/substitutionLogic'
import { useSubstitutionGame } from '../hooks/useSubstitutionGame'
import { EquationBoard } from './EquationBoard'
import { FailureScreen } from './FailureScreen'
import { RuleBar } from './RuleBar'
import { ShapeToolbox } from './ShapeToolbox'
import { SubmitBar } from './SubmitBar'
import { SuccessCelebration } from './SuccessCelebration'

type SubstitutionGameViewProps = {
  problem: SlotsProblem
  title: string
  subtitle: string
  shapeSize?: number
}

export function SubstitutionGameView({
  problem,
  title,
  subtitle,
  shapeSize,
}: SubstitutionGameViewProps) {
  const game = useSubstitutionGame(problem)

  return (
    <div className="substitution-page">
      <div className="app">
        <header className="app-header">
          <h1>{title}</h1>
          <p className="app-subtitle">{subtitle}</p>
        </header>

        <main className="app-main">
          <RuleBar rule={game.problem.rule} />
          <EquationBoard
            problem={game.problem}
            slots={game.slots}
            disabled={game.locked}
            onDrop={game.setSlot}
            onClear={game.clearSlot}
            shapeSize={shapeSize}
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
