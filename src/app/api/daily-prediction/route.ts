import { MoodPredictor } from '@/hooks/mood-analysis'
import { getTommorowWeatherForecast } from '@/hooks/weather'
import { NextResponse } from 'next/server'

let cachedPrediction: any = null
let cacheTimestamp: Date | null = null

function isCacheValid(): boolean {
  if (!cachedPrediction || !cacheTimestamp) return false
  const now = new Date()
  const cacheAge = now.getTime() - cacheTimestamp.getTime()
  return cacheAge < 1000 * 60 * 60
}

async function getMoodHistory(): Promise<any[]> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/mood-history`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }

    return await res.json()
  } catch (error) {
    console.error('Failed to fetch mood history:', error)
    return []
  }
}

export async function GET() {
  if (isCacheValid()) {
    return NextResponse.json(cachedPrediction)
  }

  try {
    const [weatherForecast, moodHistory] = await Promise.all([
      getTommorowWeatherForecast(),
      getMoodHistory(),
    ])

    const analysis = MoodPredictor.predictWithAnalysis(
      moodHistory,
      weatherForecast
    )

    const randomRecommendation =
      analysis.prediction.recommendations[
        Math.floor(Math.random() * analysis.prediction.recommendations.length)
      ]

    const result = {
      prediction: analysis.prediction,
      weather: weatherForecast,
      recommendation: randomRecommendation,
      timestamp: new Date().toISOString(),
      analysis: {
        similarDaysCount: analysis.similarDaysCount,
        totalDaysAnalyzed: analysis.totalDaysAnalyzed,
        confidenceFactors: analysis.confidenceFactors,
        // weatherImpact: analysis.weatherImpact,
        similarDays: analysis.similarDays,
      },
    }

    cachedPrediction = result
    cacheTimestamp = new Date()

    return NextResponse.json(result)
  } catch (error) {
    console.error('Prediction API error:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate prediction',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
