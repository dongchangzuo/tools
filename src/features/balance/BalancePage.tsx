import { BalanceScale } from './components/BalanceScale'
import { GameActions } from './components/GameActions'
import { MathKeyboard } from './components/MathKeyboard'
import { StatusBanner } from './components/StatusBanner'
import { useBalanceGame } from './hooks/useBalanceGame'
import './balance.css'

export function BalancePage() {
  const game = useBalanceGame()

  const appClass = [
    'app',
    game.checkStatus === 'success' && 'app--success',
    game.checkStatus === 'imbalance' && 'app--imbalance',
    game.checkStatus === 'error' && 'app--error',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="balance-page">
      <div className={appClass}>
      <header className="app-header">
        <h1>数学等式天平</h1>
        <p className="app-subtitle">点击托盘输入算式，校验看看天平是否平衡</p>
      </header>

      <main className="app-main">
        <BalanceScale
          leftExpression={game.leftExpression}
          rightExpression={game.rightExpression}
          activeTray={game.activeTray}
          onSelectTray={game.setActiveTray}
          checkStatus={game.checkStatus}
          currentTiltRad={game.currentTiltRad}
          animTime={game.animTime}
          imbalanceEpoch={game.imbalanceEpoch}
        />

        <MathKeyboard onKeyPress={game.insertKey} onDelete={game.deleteKey} />

        <StatusBanner checkStatus={game.checkStatus} message={game.message} />

        <GameActions onCheck={game.handleCheck} onReset={game.handleReset} />
      </main>
      </div>
    </div>
  )
}
