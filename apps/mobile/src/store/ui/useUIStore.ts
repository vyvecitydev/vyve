import { create } from 'zustand'
import { UIState, UIActions } from './types'

interface PushState {
  pushVisible: boolean
  pushMessage: string
  pushType: 'success' | 'error' | 'info'
}

interface PushActions {
  showPush: (message: string, type?: 'success' | 'error' | 'info') => void
  hidePush: () => void
}

export const useUIStore = create<UIState & UIActions & PushState & PushActions>((set) => ({
  isLoading: false,
  modal: null,
  pushVisible: false,
  pushMessage: '',
  pushType: 'info',

  setLoading: (v) => set({ isLoading: v }),
  showModal: (id) => set({ modal: id }),
  hideModal: () => set({ modal: null }),

  showPush: (message, type = 'info') =>
    set({ pushVisible: true, pushMessage: message, pushType: type }),
  hidePush: () => set({ pushVisible: false }),
}))
