import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <div className="home-page">
      <header className="home-page__header">
        <h1>数学小游戏</h1>
        <p className="home-page__subtitle">选一个游戏开始玩</p>
      </header>

      <nav className="home-page__nav" aria-label="游戏列表">
        <Link to="/balance" className="home-card">
          <span className="home-card__icon" aria-hidden>
            ⚖️
          </span>
          <h2 className="home-card__title">数学等式天平</h2>
          <p className="home-card__desc">在托盘上输入算式，让天平保持平衡</p>
        </Link>

        <Link to="/substitution" className="home-card">
          <span className="home-card__icon" aria-hidden>
            🔺
          </span>
          <h2 className="home-card__title">等量代换</h2>
          <p className="home-card__desc">根据规则拖动图形，让等式两边一样多</p>
        </Link>
      </nav>
    </div>
  )
}
