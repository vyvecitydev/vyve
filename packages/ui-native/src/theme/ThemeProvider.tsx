import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react'
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
  setThemeColors: (colors: Partial<Colors>) => void
  resetThemeColors: () => void
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
  const [mode, setMode] = useState<'light' | 'dark'>(initialMode ?? 'light')

  // 🎨 Runtime renk override state'i
  const [colorOverrides, setColorOverrides] = useState<Partial<Colors>>({})

  const toggleTheme = useCallback(() => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'))
  }, [])

  const setThemeColors = useCallback((colors: Partial<Colors>) => {
    setColorOverrides((prev) => ({
      ...prev,
      ...colors,
    }))
  }, [])

  const resetThemeColors = useCallback(() => {
    setColorOverrides({})
  }, [])

  const theme = useMemo<Theme>(() => {
    const currentMode = modeOverride || mode

    const baseColors = currentMode === 'light' ? lightColors : darkColors

    return {
      colors: {
        ...baseColors,
        ...colorOverrides, // 👈 override burada merge ediliyor
      },
      spacing,
      radius,
      typography,
      mode: currentMode,
    }
  }, [mode, modeOverride, colorOverrides])

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        setThemeColors,
        resetThemeColors,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
