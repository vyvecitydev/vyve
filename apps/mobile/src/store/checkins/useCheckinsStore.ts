import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getItem, setItem, removeItem } from '@vyve/gotham-native'
import { CheckinOrg } from './types'

interface CheckinsState {
  checkins: CheckinOrg[]
}

interface CheckinsActions {
  setCheckins: (checkins: CheckinOrg[]) => void
  appendCheckin: (checkin: CheckinOrg) => void
  deleteCheckin: (orgId: string) => void
  clearCheckins: () => void
}

type Store = CheckinsState & CheckinsActions

export const useCheckinsStore = create<Store>()(
  persist(
    (set) => ({
      checkins: [],

      // 🔁 İlk yükleme (replace)
      setCheckins: (checkins) =>
        set({
          checkins,
        }),

      // ➕ pagination / load more
      appendCheckin: (checkin) =>
        set((state) => ({
          checkins: [checkin, ...state.checkins],
        })),

      // ❌ unlike sonrası
      deleteCheckin: (orgId) =>
        set((state) => ({
          checkins: state.checkins.filter((f) => f._id !== orgId),
        })),

      // 🚪 logout / manual clear
      clearCheckins: () =>
        set({
          checkins: [],
        }),
    }),
    {
      name: 'vyve-checkins',

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
