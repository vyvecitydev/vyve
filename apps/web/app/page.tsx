'use client'
import Image from 'next/image'
// import { capitalize } from '@vyve/gotham'

function Page() {
  return (
    <div
      style={
        {
          // background: theme.colors.background,
          // color: theme.colors.text,
          // padding: theme.spacing.md,
        }
      }
    >
      {/* <h1>Current Theme: {theme.mode}</h1>
      <Button onClick={toggleTheme} title="Toggle Theme" /> */}
      {/* <Button onClick={toggleTheme} title='Tesss'>Test</Button> */}
      {/* {capitalize('welcome to vyve!')} */}
    </div>
  )
}

export default function Home() {
  return (
    // <ThemeProvider initialTheme="light">
    <Page />
    // </ThemeProvider>
  )
}
