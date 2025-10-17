import { useThemeContext } from '../providers/ThemeProvider'

export const useTheme = () => {
  const { theme, toggleTheme } = useThemeContext()
  return { theme, toggleTheme }
}
