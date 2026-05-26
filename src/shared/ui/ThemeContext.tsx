import { createContext, useCallback, useContext, useState } from 'react'

export type ThemeName = 'real-estate' | 'warm' | 'tech'

export const THEMES: { id: ThemeName; label: string }[] = [
  { id: 'real-estate', label: '地产' },
  { id: 'warm', label: '暖色' },
  { id: 'tech', label: '科技' },
]

const STORAGE_KEY = 'tools.theme'
const DEFAULT_THEME: ThemeName = 'real-estate'

type ThemeContextValue = {
  theme: ThemeName
  setTheme: (t: ThemeName) => void
  cycleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function getStoredTheme(): ThemeName {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === 'cosmic') return 'real-estate'
    if (raw === 'real-estate' || raw === 'warm' || raw === 'tech') return raw
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

  const cycleTheme = useCallback(() => {
    const order: ThemeName[] = ['real-estate', 'warm', 'tech']
    const next = order[(order.indexOf(theme) + 1) % order.length]!
    setTheme(next)
  }, [theme, setTheme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider')
  return ctx
}
