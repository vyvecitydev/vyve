import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getItem, setItem, removeItem } from '@vyve/gotham-native'
import { NotificationItem } from './types'

interface NotificationsState {
  notifications: NotificationItem[]
}

interface NotificationsActions {
  setNotifications: (notifications: NotificationItem[]) => void
  appendNotifications: (notifications: NotificationItem[]) => void
  prependNotification: (notification: NotificationItem) => void
  clearNotifications: () => void
}

type Store = NotificationsState & NotificationsActions

export const useNotificationsStore = create<Store>()(
  persist(
    (set) => ({
      notifications: [],

      // 🔁 İlk yükleme (replace)
      setNotifications: (notifications) =>
        set({
          notifications,
        }),

      // ➕ pagination (load more)
      appendNotifications: (notifications) =>
        set((state) => ({
          notifications: [...state.notifications, ...notifications],
        })),

      // 🔔 yeni notification (socket / realtime)
      prependNotification: (notification) =>
        set((state) => ({
          notifications: [notification, ...state.notifications],
        })),

      // 🚪 logout
      clearNotifications: () =>
        set({
          notifications: [],
        }),
    }),
    {
      name: 'vyve-notifications',

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
