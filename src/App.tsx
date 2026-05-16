import { BalanceScale } from './components/BalanceScale'
import { GameActions } from './components/GameActions'
import { StatusBanner } from './components/StatusBanner'
import { useBalanceGame } from './hooks/useBalanceGame'
import './App.css'

function App() {
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
    <div className={appClass}>
      <header className="app-header">
        <h1>数学等式天平</h1>
        <p className="app-subtitle">在托盘里输入算式，点击校验，看看是否平衡</p>
      </header>

      <main className="app-main">
        <BalanceScale
          leftExpression={game.leftExpression}
          rightExpression={game.rightExpression}
          onLeftChange={game.handleLeftChange}
          onRightChange={game.handleRightChange}
          checkStatus={game.checkStatus}
          currentTiltRad={game.currentTiltRad}
          currentPanOffsets={game.currentPanOffsets}
        />

        <StatusBanner checkStatus={game.checkStatus} message={game.message} />

        <GameActions onCheck={game.handleCheck} onReset={game.handleReset} />
      </main>
    </div>
  )
}

export default App
