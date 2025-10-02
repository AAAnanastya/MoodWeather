'use client'

import { Prediction, WeatherEntry } from '@/store/mood-store'
import { FcIdea } from 'react-icons/fc'
import { TbCrystalBall } from 'react-icons/tb'

interface PredictionCardProps {
  prediction: Prediction
  weather?: WeatherEntry
  recommendation: string
}

export function PredictionCard({
  prediction,
  weather,
  recommendation,
}: PredictionCardProps) {
  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Tomorrow's Forecast</h2>
        <TbCrystalBall className="text-xl" />
      </div>

      <div className="flex items-center gap-3 py-3">
        <img
          src={`/emoji/${prediction.type.toLowerCase()}.png`}
          alt={`${prediction.type.toLowerCase()} emoji`}
          className="h-8"
        />
        <div>
          <p className="font-bold">
            {prediction.type.charAt(0).toUpperCase() +
              prediction.type.slice(1).toLowerCase()}{' '}
            Mood Expected
          </p>
          <p className="text-sm">Based on weather & patterns</p>
        </div>
      </div>

      <div className="bg-white/20 rounded-xl p-3">
        <p className="text-sm">
          <FcIdea className="inline-flex mr-1 align-baseline text-xs" />
          <strong>Recommendation:</strong> {recommendation}
        </p>
      </div>
    </>
  )
}
