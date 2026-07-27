import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getItem, setItem, removeItem } from '@vyve/gotham-native'

interface OrgItem {
  _id: string
  text: string
  imageUrl: string
  likeCount: number
  currentOccupancy: number
  capacity: number
  percent: number
  tags: string[]
  description: string
  address: string
  phone?: string
  location: { type: 'Point'; coordinates: [number, number] }
  isLiked?: boolean
  photos: string[]
  createdAt?: string
}

interface PopularState {
  newPlaces: OrgItem[]
  favorite: OrgItem[]
  mostVisited: OrgItem[]
}

interface PopularActions {
  setPopular: (data: PopularState) => void
  clearPopular: () => void
}

type Store = PopularState & PopularActions

export const usePopularStore = create<Store>()(
  persist(
    (set) => ({
      newPlaces: [],
      favorite: [],
      mostVisited: [],
      setPopular: (data) => set({ ...data }),
      clearPopular: () => set({ newPlaces: [], favorite: [], mostVisited: [] }),
    }),
    {
      name: 'vyve-popular',
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
