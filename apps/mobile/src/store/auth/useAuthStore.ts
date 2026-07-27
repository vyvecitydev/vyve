import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getItem, setItem, removeItem } from '@vyve/gotham-native'
import { useFavoritesStore } from '../favorites/useFavoritesStore'

export interface User {
  id: string
  name: string
  email: string
  picture?: string
  privacy?: boolean
  provider: 'local' | 'google' | 'apple' | 'facebook'
  followersCount?: number
  followingCount?: number
}

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
}

interface AuthActions {
  setAuth: (payload: { user: User; accessToken: string; refreshToken: string }) => void

  logout: () => void
}

type Store = AuthState & AuthActions

export const useAuthStore = create<Store>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,

      setAuth: ({ user, accessToken, refreshToken }) =>
        set({
          user,
          accessToken,
          refreshToken,
        }),

      logout: () => {
        useFavoritesStore.getState().clearFavorites()
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
        })
      },
    }),
    {
      name: 'vyve-auth', // storage key

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
