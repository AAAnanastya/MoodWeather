// app/api/prediction/daily/route.ts
import { MoodPredictor } from '@/hooks/mood-analysis'
import { getWeatherForecast } from '@/hooks/weather'
import { NextResponse } from 'next/server'

let cachedPrediction: any = null
let cacheTimestamp: Date | null = null

function isCacheValid(): boolean {
  if (!cachedPrediction || !cacheTimestamp) return false
  return new Date().toDateString() === cacheTimestamp.toDateString()
}

async function getMoodHistory() {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/mood/history`, {
      cache: 'no-store',
    })
    return await res.json()
  } catch (error) {
    return []
  }
}

export async function GET() {
  if (isCacheValid()) {
    return NextResponse.json(cachedPrediction)
  }

  try {
    const [weatherForecast, moodHistory] = await Promise.all([
      getWeatherForecast(),
      getMoodHistory(),
    ])

    const prediction = MoodPredictor.predict(moodHistory, weatherForecast)

    const randomRecommendation =
      prediction.recommendations[
        Math.floor(Math.random() * prediction.recommendations.length)
      ]

    const result = {
      prediction,
      weather: weatherForecast,
      recommendation: randomRecommendation,
      timestamp: new Date().toISOString(),
    }

    cachedPrediction = result
    cacheTimestamp = new Date()

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate prediction' },
      { status: 500 }
    )
  }
}
