import { create } from 'zustand'
import { LocationState } from './types'

export const useLocationStore = create<LocationState>((set) => ({
  location: null,
  setLocation: (latitude, longitude) => set({ location: { latitude, longitude } }),
}))
