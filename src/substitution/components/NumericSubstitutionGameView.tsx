import type { NumericProblem } from '../game/substitutionLogic'
import { useNumericSubstitutionGame } from '../hooks/useNumericSubstitutionGame'
import { NumericEquationBoard } from './NumericEquationBoard'
import { NumericFailureScreen } from './NumericFailureScreen'
import { NumericKeyboard } from './NumericKeyboard'
import { RuleBar } from './RuleBar'
import { SubmitBar } from './SubmitBar'
import { SuccessCelebration } from './SuccessCelebration'

type NumericSubstitutionGameViewProps = {
  problem: NumericProblem
  title: string
  subtitle: string
}

export function NumericSubstitutionGameView({
  problem,
  title,
  subtitle,
}: NumericSubstitutionGameViewProps) {
  const game = useNumericSubstitutionGame(problem)

  return (
    <div className="substitution-page">
      <div className="app">
        <header className="app-header">
          <h1>{title}</h1>
          <p className="app-subtitle">{subtitle}</p>
        </header>

        <main className="app-main">
          <RuleBar rule={game.problem.rule} />
          <NumericEquationBoard
            problem={game.problem}
            answer={game.answer}
          />
          <NumericKeyboard
            disabled={game.locked}
            onDigit={game.appendDigit}
            onDelete={game.deleteDigit}
          />
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
          <NumericFailureScreen
            reason={game.failureReason}
            onRetry={game.retry}
            onReset={game.reset}
          />
        )}
      </div>
    </div>
  )
}
