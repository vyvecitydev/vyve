export type ThemeColors = {
  primary: string
  secondary: string
  success: string
  danger: string
  warning: string
  info: string
  background: string
  text: string
}

export type Theme = {
  mode: 'light' | 'dark'
  colors: ThemeColors
  spacing: {
    xs: number
    sm: number
    md: number
    lg: number
    xl: number
  }
  borderRadius: number
  fontSize: {
    sm: number
    md: number
    lg: number
  }
}
