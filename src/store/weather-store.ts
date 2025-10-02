import { create } from 'zustand'

export type WeatherEntry = {
  temperature: number
  weathercode: number
  time: string
}

type WeatherState = {
  city: string
  history: WeatherEntry[]
  setCity: (city: string) => void
  addWeatherEntry: (entry: WeatherEntry) => void
}

export const useWeatherStore = create<WeatherState>((set) => ({
  city: 'Moscow',
  history: [],
  setCity: (city) => set({ city }),
  addWeatherEntry: (entry) =>
    set((state) => ({ history: [...state.history, entry] })),
}))
