import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getItem, removeItem, setItem } from '@vyve/gotham-native'

export interface Org {
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

interface OrgsState {
  orgs: Org[]
  setOrgs: (orgs: Org[]) => void
  appendOrgs: (orgs: Org[]) => void
  clearOrgs: () => void
  updateLike: (orgId: string, delta: number) => void
  setLikeState: (orgId: string, liked: boolean) => void
}

export const useOrgsStore = create<OrgsState>()(
  persist(
    (set, get) => ({
      orgs: [],

      // İlk load / refresh
      setOrgs: (orgs) =>
        set(() => ({
          orgs: [...orgs],
        })),

      // Pagination
      appendOrgs: (newOrgs) => {
        const current = get().orgs

        const map = new Map<string, Org>()

        // önce mevcutlar
        current.forEach((org) => {
          map.set(org._id, org)
        })

        // sonra yeniler (aynı id varsa overwrite eder)
        newOrgs.forEach((org) => {
          map.set(org._id, org)
        })

        set({ orgs: Array.from(map.values()) })
      },

      clearOrgs: () => set({ orgs: [] }),

      updateLike: (orgId, delta) =>
        set((state) => ({
          orgs: state.orgs.map((org) =>
            org._id === orgId ? { ...org, likeCount: Math.max(0, org.likeCount + delta) } : org,
          ),
        })),

      setLikeState: (orgId, liked) =>
        set((state) => ({
          orgs: state.orgs.map((org) => (org._id === orgId ? { ...org, isLiked: liked } : org)),
        })),
    }),
    {
      name: 'vyve-orgs',
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
      partialize: (state) => ({ orgs: state.orgs }),
    },
  ),
)
