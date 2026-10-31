import { create } from 'zustand'

interface RideState {
  speed: number // metres per second along the rope
  riding: boolean
  setSpeed: (speed: number) => void
  toggleRide: () => void
}

export const useRideStore = create<RideState>((set) => ({
  speed: 6,
  riding: false,
  setSpeed: (speed) => set({ speed }),
  toggleRide: () => set((s) => ({ riding: !s.riding })),
}))
