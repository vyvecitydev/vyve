import { getItem, removeItem, setItem } from '@vyve/gotham-native'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type SearchPayload = {
  text: string
  mods: number[]
  tags: string[]
}

type SearchStore = {
  // 🔎 son arama payload
  payload: SearchPayload

  // 🏷 backend'den türetilen tagler
  availableTags: string[]

  // 🕘 recent searches
  recentSearches: string[]

  // setters
  setPayload: (payload: Partial<SearchPayload>) => void
  clearPayload: () => void

  setAvailableTags: (tags: string[]) => void
  clearAvailableTags: () => void

  addRecentSearch: (text: string) => void
  removeRecentSearch: (text: string) => void
  clearRecentSearches: () => void
}

const INITIAL_PAYLOAD = {
  text: '',
  mods: [],
  tags: [],
}

export const useSearchStore = create<SearchStore>()(
  persist(
    (set, get) => ({
      payload: INITIAL_PAYLOAD,
      availableTags: [],
      recentSearches: [],

      setPayload: (partial) =>
        set((state) => ({
          payload: {
            ...state.payload,
            ...partial,
          },
        })),

      clearPayload: () => set({ payload: INITIAL_PAYLOAD }),

      setAvailableTags: (tags) => set({ availableTags: tags }),
      clearAvailableTags: () => set({ availableTags: [] }),

      addRecentSearch: (text) => {
        const prev = get().recentSearches
        const updated = [text, ...prev.filter((i) => i !== text)].slice(0, 10)
        set({ recentSearches: updated })
      },

      removeRecentSearch: (text) =>
        set((state) => ({
          recentSearches: state.recentSearches.filter((i) => i !== text),
        })),

      clearRecentSearches: () => set({ recentSearches: [] }),
    }),
    {
      name: 'vyve-search',
      storage: {
        getItem: async (key) => {
          const raw = await getItem(key)
          return raw ? JSON.parse(raw) : null
        },
        setItem: async (key, value) => {
          await setItem(key, JSON.stringify(value))
        },
        removeItem: async (key) => {
          await removeItem(key)
        },
      },
    },
  ),
)