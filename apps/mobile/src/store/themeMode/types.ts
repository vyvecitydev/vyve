// packages/mobile-app/src/store/types.ts
export interface ThemeModeState {
  mode: null | 'light' | 'dark'
}

export interface ThemeModeActions {
  setMode: (mode: 'light' | 'dark') => void
  resetTheme: () => void
}
