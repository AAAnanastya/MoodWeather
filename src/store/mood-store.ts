import { create } from 'zustand'

export type WeatherEntry = {
  temperature: number
  weathercode: number
  time: string
}

export type MoodEntry = {
  id: string
  date: string
  moodScore: number
  weather: WeatherEntry
  notes?: string
}

export type Prediction = {
  type: 'POSITIVE' | 'NEUTRAL' | 'RELAXED' | 'COZY' | 'SAD'
  confidence: number
  recommendations: string[]
}

type MoodState = {
  moodHistory: MoodEntry[]
  currentPrediction: Prediction | null
  isLoading: boolean

  addMoodEntry: (mood: Omit<MoodEntry, 'id'>) => void
  setPrediction: (prediction: Prediction) => void
  clearPrediction: () => void
}

export const useMoodStore = create<MoodState>((set) => ({
  moodHistory: [],
  currentPrediction: null,
  isLoading: false,

  addMoodEntry: (moodEntry) =>
    set((state) => ({
      moodHistory: [
        ...state.moodHistory,
        { ...moodEntry, id: Date.now().toString() },
      ],
    })),

  setPrediction: (prediction) => set({ currentPrediction: prediction }),
  clearPrediction: () => set({ currentPrediction: null }),
}))
