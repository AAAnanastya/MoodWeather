'use client'

import { Prediction, WeatherEntry } from '@/store/mood-store'
import { useCallback, useEffect, useState } from 'react'

interface PredictionData {
  prediction: Prediction
  weather?: WeatherEntry
  recommendation: string
  timestamp: string
  analysis?: {
    similarDaysCount: number
    totalDaysAnalyzed: number
    confidenceFactors: string[]
  }
}

export function useDailyPrediction() {
  const [predictionData, setPredictionData] = useState<PredictionData | null>(
    null
  )
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPrediction = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/daily-prediction', {
        headers: {
          'Cache-Control': 'no-cache',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch prediction')
      }

      const data: PredictionData = await response.json()
      setPredictionData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      console.error('Prediction fetch error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const refetch = useCallback(() => {
    fetchPrediction()
  }, [fetchPrediction])

  useEffect(() => {
    fetchPrediction()
  }, [fetchPrediction])

  return {
    predictionData,
    isLoading,
    error,
    refetch,
  }
}
