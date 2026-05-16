import { GameCanvas } from './components/GameCanvas'
import './App.css'

function App() {
  return (
    <div className="app">
      <header className="hud">
        <h1>Canvas Game</h1>
        <p className="hud-subtitle">React shell + Canvas loop</p>
      </header>
      <GameCanvas />
    </div>
  )
}

export default App
