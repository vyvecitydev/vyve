import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getItem, setItem, removeItem } from '@vyve/gotham-native'
import { FavoriteOrg } from './types'

interface FavoritesState {
  favorites: FavoriteOrg[]
}

interface FavoritesActions {
  setFavorites: (favorites: FavoriteOrg[]) => void
  appendFavorite: (favorite: FavoriteOrg) => void
  deleteFavorite: (orgId: string) => void
  clearFavorites: () => void
}

type Store = FavoritesState & FavoritesActions

export const useFavoritesStore = create<Store>()(
  persist(
    (set) => ({
      favorites: [],

      // 🔁 İlk yükleme (replace)
      setFavorites: (favorites) =>
        set({
          favorites,
        }),

      // ➕ pagination / load more
      appendFavorite: (favorite) =>
        set((state) => ({
          favorites: [favorite, ...state.favorites],
        })),

      // ❌ unlike sonrası
      deleteFavorite: (orgId) =>
        set((state) => ({
          favorites: state.favorites.filter((f) => f._id !== orgId),
        })),

      // 🚪 logout / manual clear
      clearFavorites: () =>
        set({
          favorites: [],
        }),
    }),
    {
      name: 'vyve-favorites',

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
