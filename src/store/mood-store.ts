import { create } from 'zustand'

export type WeatherEntry = {
  temperature: number
  weathercode: number
  time: string
  windspeed?: number
}

export type MoodEntry = {
  id: string
  date: string
  moodScore: number
  mood?: string
  weather: WeatherEntry
  notes?: string
}

export interface Prediction {
  type: 'POSITIVE' | 'NEUTRAL' | 'COZY' | 'RELAXED' | 'SAD'
  confidence: number
  recommendations: string[]
  expectedMoodScore?: number
}

type MoodState = {
  moodHistory: MoodEntry[]
  currentPrediction: Prediction | null
  isLoading: boolean
  error: string | null

  addMoodEntry: (mood: Omit<MoodEntry, 'id'>) => Promise<void>
  setPrediction: (prediction: Prediction) => void
  clearPrediction: () => void
  fetchMoodHistory: () => Promise<void>
}

export const useMoodStore = create<MoodState>((set, get) => ({
  moodHistory: [],
  currentPrediction: null,
  isLoading: false,
  error: null,

  addMoodEntry: async (moodEntry) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch('/api/mood-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(moodEntry),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save mood entry')
      }

      const savedEntry = await response.json()

      set((state) => ({
        moodHistory: [...state.moodHistory, savedEntry],
        isLoading: false,
      }))
    } catch (error) {
      console.error('Error saving mood entry:', error)
      set({
        error:
          error instanceof Error ? error.message : 'Failed to save mood entry',
        isLoading: false,
      })
    }
  },

  setPrediction: (prediction) => set({ currentPrediction: prediction }),

  clearPrediction: () => set({ currentPrediction: null }),

  fetchMoodHistory: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch('/api/mood-history')
      if (!response.ok) {
        throw new Error('Failed to fetch mood history')
      }
      const data = await response.json()
      set({ moodHistory: data, isLoading: false })
    } catch (error) {
      console.error('Error fetching mood history:', error)
      set({
        error: 'Failed to fetch mood history',
        isLoading: false,
      })
    }
  },
}))
