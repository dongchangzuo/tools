import { createContext, useCallback, useContext, useState } from 'react'

export type ThemeName = 'cosmic' | 'warm'

const STORAGE_KEY = 'tools.theme'
const DEFAULT_THEME: ThemeName = 'cosmic'

type ThemeContextValue = {
  theme: ThemeName
  setTheme: (t: ThemeName) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function getStoredTheme(): ThemeName {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === 'cosmic' || raw === 'warm') return raw
  } catch { /* localStorage unavailable */ }
  return DEFAULT_THEME
}

function applyTheme(theme: ThemeName) {
  document.documentElement.dataset.theme = theme
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(() => {
    const stored = getStoredTheme()
    applyTheme(stored)
    return stored
  })

  const setTheme = useCallback((t: ThemeName) => {
    setThemeState(t)
    applyTheme(t)
    try { localStorage.setItem(STORAGE_KEY, t) } catch { /* noop */ }
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'cosmic' ? 'warm' : 'cosmic')
  }, [theme, setTheme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider')
  return ctx
}
