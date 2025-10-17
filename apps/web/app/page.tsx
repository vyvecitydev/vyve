'use client'
import Image from 'next/image'
import { capitalize } from '@vyve/gotham'
import { ThemeProvider, useTheme } from '@vyve/ui'

function Page() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div
      style={{
        background: theme.colors.background,
        color: theme.colors.text,
        padding: theme.spacing.md,
      }}
    >
      <h1>Current Theme: {theme.mode}</h1>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  )
}

export default function Home() {
  return (
    <ThemeProvider>
      <Page />
    </ThemeProvider>
  )
}
