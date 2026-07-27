// packages/mobile-app/src/store/useThemeModeStore.ts
import { persist } from 'zustand/middleware'
import { create } from 'zustand'
import { getItem, setItem, removeItem } from '@vyve/gotham-native'
import { ThemeModeState, ThemeModeActions } from './types'

type Store = ThemeModeState & ThemeModeActions

export const useThemeModeStore = create<Store>()(
  persist(
    (set) => ({
      mode: null,
      setMode: (mode: 'light' | 'dark') => set({ mode }),
      resetTheme: () => set({ mode: null }),
    }),
    {
      name: 'vyve-theme-mode',
      storage: {
        getItem: async (key: string) => {
          const raw = await getItem(key)
          return raw ? JSON.parse(raw) : null
        },
        setItem: async (key: string, value: unknown) => {
          await setItem(key, JSON.stringify(value))
        },
        removeItem: async (key: string) => {
          await removeItem(key)
        },
      },
    },
  ),
)
