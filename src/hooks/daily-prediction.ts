'use client'

import { Prediction, WeatherEntry } from '@/store/mood-store'
import { useEffect, useState } from 'react'

interface PredictionData {
  prediction: Prediction
  weather?: WeatherEntry
  recommendation: string
  timestamp: string
}

export function useDailyPrediction() {
  const [predictionData, setPredictionData] = useState<PredictionData | null>(
    null
  )
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch('/api/prediction/daily')

        if (!response.ok) {
          throw new Error('Failed to fetch prediction')
        }

        const data: PredictionData = await response.json()
        setPredictionData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPrediction()
  }, [])

  return {
    predictionData,
    isLoading,
    error,
  }
}
