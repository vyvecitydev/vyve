import React, { createContext, useContext, useState, ReactNode } from 'react'
import { lightTheme } from '../theme/light'
import { darkTheme } from '../theme/dark'
import type { Theme } from '../theme/types'

type ThemeContextType = {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  toggleTheme: () => {},
})

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(lightTheme)

  const toggleTheme = () => {
    setTheme((prev) => (prev.mode === 'light' ? darkTheme : lightTheme))
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export const useThemeContext = () => useContext(ThemeContext)
