'use client'

import { useDailyPrediction } from '@/hooks/daily-prediction'
import { MoodPredictor } from '@/hooks/mood-analysis'
import { Prediction, WeatherEntry } from '@/store/mood-store'
import { ReactElement } from 'react'
import { PredictionCard } from './PredictionCard'

interface PredictionData {
  prediction: Prediction
  weather: WeatherEntry
  recommendation: string
}

export function PredictionEngine(): ReactElement {
  const { predictionData, isLoading, error } = useDailyPrediction()

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    )
  }

  if (error || !predictionData) {
    const fallbackWeather: WeatherEntry = {
      temperature: 18,
      weathercode: 1,
      time: new Date().toISOString(),
    }

    const fallbackPrediction = MoodPredictor.predict([], fallbackWeather)
    const fallbackRecommendation = fallbackPrediction.recommendations[0]

    return (
      <div>
        <PredictionCard
          prediction={fallbackPrediction}
          weather={fallbackWeather}
          recommendation={fallbackRecommendation}
        />
        <p className="text-xs text-[var--helperText] mt-2 opacity-50">
          *Not enough data to form an accurate prediction
        </p>
      </div>
    )
  }

  return (
    <PredictionCard
      prediction={predictionData.prediction}
      weather={predictionData.weather}
      recommendation={predictionData.recommendation}
    />
  )
}
