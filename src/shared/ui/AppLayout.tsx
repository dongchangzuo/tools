import { Link, Outlet, useLocation } from 'react-router-dom'
import { useTheme } from './ThemeContext'

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <button
      type="button"
      className="site-nav__theme-btn"
      onClick={toggleTheme}
      aria-label={theme === 'cosmic' ? '切换到暖色主题' : '切换到深色主题'}
      title={theme === 'cosmic' ? '暖色主题' : '深色主题'}
    >
      {theme === 'cosmic' ? (
        /* Sun icon */
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ) : (
        /* Moon icon */
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  )
}

export function AppLayout() {
  const { pathname } = useLocation()
  const onHome = pathname === '/'
  const onSubstitution = pathname.startsWith('/substitution')
  const onLogin = pathname === '/login'

  return (
    <div className="site">
      {!onHome && !onLogin && (
        <nav className="site-nav" aria-label="站点导航">
          <Link to="/" className="site-nav__brand">
            数学小游戏
          </Link>
          <div className="site-nav__links">
            <Link
              to="/balance"
              className={pathname === '/balance' ? 'site-nav__link site-nav__link--active' : 'site-nav__link'}
            >
              天平
            </Link>
            <Link
              to="/substitution"
              className={onSubstitution ? 'site-nav__link site-nav__link--active' : 'site-nav__link'}
            >
              等量代换
            </Link>
            <Link
              to="/login"
              className={onLogin ? 'site-nav__link site-nav__link--active' : 'site-nav__link'}
            >
              登录
            </Link>
            {onSubstitution && (
              <>
                <Link
                  to="/substitution"
                  className={
                    pathname === '/substitution' ? 'site-nav__link site-nav__link--active' : 'site-nav__link'
                  }
                >
                  演示1
                </Link>
                <Link
                  to="/substitution/2"
                  className={
                    pathname === '/substitution/2' ? 'site-nav__link site-nav__link--active' : 'site-nav__link'
                  }
                >
                  演示2
                </Link>
                <Link
                  to="/substitution/3"
                  className={
                    pathname === '/substitution/3' ? 'site-nav__link site-nav__link--active' : 'site-nav__link'
                  }
                >
                  演示3
                </Link>
              </>
            )}
            <ThemeToggle />
          </div>
        </nav>
      )}
      <Outlet />
    </div>
  )
}
