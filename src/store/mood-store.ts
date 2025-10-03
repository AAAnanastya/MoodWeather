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

export type MoodState = {
  moodHistory: MoodEntry[]
  currentMoodEntry: MoodEntry | null
  currentPrediction: Prediction | null
  isLoading: boolean
  error: string | null

  addMoodEntry: (mood: Omit<MoodEntry, 'id'>) => Promise<void>
  setCurrentMoodEntry: (moodEntry: MoodEntry | null) => void
  setPrediction: (prediction: Prediction) => void
  clearPrediction: () => void
  fetchMoodHistory: () => Promise<void>
  getTodaysMood: () => MoodEntry | null
  hasMoodEntryToday: () => boolean
}

export const useMoodStore = create<MoodState>((set, get) => ({
  moodHistory: [],
  currentMoodEntry: null,
  currentPrediction: null,
  isLoading: false,
  error: null,

  // addMoodEntry: async (moodEntry) => {
  //   set({ isLoading: true, error: null })
  //   try {
  //     const response = await fetch('/api/mood-history', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(moodEntry),
  //     })

  //     if (!response.ok) {
  //       const errorData = await response.json()
  //       throw new Error(errorData.error || 'Failed to save mood entry')
  //     }

  //     const savedEntry = await response.json()

  //     set((state) => ({
  //       moodHistory: [...state.moodHistory, savedEntry],
  //       currentMoodEntry: savedEntry,
  //       isLoading: false,
  //     }))
  //   } catch (error) {
  //     console.error('Error saving mood entry:', error)
  //     set({
  //       error:
  //         error instanceof Error ? error.message : 'Failed to save mood entry',
  //       isLoading: false,
  //     })
  //   }
  // },

  addMoodEntry: async (moodEntry) => {
    set({ isLoading: true, error: null })
    try {
      // Временное решение без API - создаем запись локально
      const newEntry: MoodEntry = {
        ...moodEntry,
        id: Math.random().toString(36).substr(2, 9), // Генерируем временный ID
      }

      // Имитируем задержку сети
      await new Promise((resolve) => setTimeout(resolve, 500))

      set((state) => ({
        moodHistory: [...state.moodHistory, newEntry],
        currentMoodEntry: newEntry,
        isLoading: false,
      }))
    } catch (error) {
      console.error('Error saving mood entry:', error)
      set({
        error: 'Failed to save mood entry',
        isLoading: false,
      })
    }
  },

  // Новый метод для установки текущей записи
  setCurrentMoodEntry: (moodEntry) => set({ currentMoodEntry: moodEntry }),

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

  // Хелпер для получения сегодняшней записи
  getTodaysMood: () => {
    const today = new Date().toISOString().split('T')[0]
    const { currentMoodEntry, moodHistory } = get()

    if (currentMoodEntry?.date === today) {
      return currentMoodEntry
    }

    return moodHistory.find((entry) => entry.date === today) || null
  },

  // Хелпер для проверки, была ли сегодня запись
  hasMoodEntryToday: () => {
    const today = new Date().toISOString().split('T')[0]
    const { currentMoodEntry, moodHistory } = get()

    return (
      currentMoodEntry?.date === today ||
      moodHistory.some((entry) => entry.date === today)
    )
  },
}))
