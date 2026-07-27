import { persist } from 'zustand/middleware'
import { create } from 'zustand'
import { getItem, setItem, removeItem } from '@vyve/gotham-native'
import { OnboardingState, OnboardingActions } from './types'

type Store = OnboardingState & OnboardingActions

export const useOnboardingStore = create<Store>()(
  persist(
    (set) => ({
      hasSeenWelcome: false,
      setHasSeenWelcome: (v: boolean) => set({ hasSeenWelcome: v }),
      resetOnboarding: () => set({ hasSeenWelcome: false }),
    }),
    {
      name: 'vyve-onboarding',
      storage: {
        getItem: async (key: string) => {
          const raw = await getItem(key)
          // string veya null'i StorageValue ile uyumlu hale getir
          return raw ? JSON.parse(raw) : null
        },
        setItem: async (key: string, value: unknown) => {
          // Zustand persist, value'yi JSON.stringify ile kaydediyor, burada da uyumlu hale getir
          await setItem(key, JSON.stringify(value))
        },
        removeItem: async (key: string) => {
          await removeItem(key)
        },
      },
    },
  ),
)
