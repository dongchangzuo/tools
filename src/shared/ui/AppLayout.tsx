import { Link, Outlet, useLocation } from 'react-router-dom'

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
          {!onHome && (
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
            </div>
          )}
        </nav>
      )}
      <Outlet />
    </div>
  )
}
