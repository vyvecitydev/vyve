import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react'
import { lightColors, darkColors, Colors } from './colors'
import { spacing, Spacing } from './spacing'
import { radius, Radius } from './radius'
import { typography, Typography } from './typography'

export interface Theme {
  colors: Colors
  spacing: Spacing
  radius: Radius
  typography: Typography
  mode: 'light' | 'dark'
}

interface ThemeContextProps {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined)

export const ThemeProvider = ({
  children,
  initialMode,
  modeOverride,
}: {
  children: ReactNode
  initialMode: 'light' | 'dark'
  modeOverride?: 'light' | 'dark' | null
}) => {
  const [mode, setMode] = useState<'light' | 'dark'>(initialMode ? initialMode : 'light')

  const toggleTheme = () => setMode((prev) => (prev === 'light' ? 'dark' : 'light'))

  const theme = useMemo<Theme>(
    () => ({
      colors: (modeOverride || mode) === 'light' ? lightColors : darkColors,
      spacing,
      radius,
      typography,
      mode: modeOverride || mode,
    }),
    [mode, modeOverride],
  )

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within a ThemeProvider')
  return context
}
