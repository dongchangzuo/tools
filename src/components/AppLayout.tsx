import { Link, Outlet, useLocation } from 'react-router-dom'

export function AppLayout() {
  const { pathname } = useLocation()
  const onHome = pathname === '/'

  return (
    <div className="site">
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
              className={
                pathname === '/substitution' ? 'site-nav__link site-nav__link--active' : 'site-nav__link'
              }
            >
              等量代换
            </Link>
          </div>
        )}
      </nav>
      <Outlet />
    </div>
  )
}
