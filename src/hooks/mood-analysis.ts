import { MoodEntry, Prediction } from '@/store/mood-store'
import { WeatherEntry } from '@/store/weather-store'

export interface AnalysisResult {
  prediction: Prediction
  similarDaysCount: number
  totalDaysAnalyzed: number
  confidenceFactors: string[]
  similarDays: MoodEntry[]
}

export class MoodPredictor {
  static predictWithAnalysis(
    moodHistory: MoodEntry[],
    weatherForecast: WeatherEntry
  ): AnalysisResult {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    console.log('moodHistory', moodHistory)

    const validMoodHistory = moodHistory.filter(
      (entry) =>
        entry &&
        typeof entry.moodScore === 'number' &&
        entry.weather &&
        new Date(entry.date) >= thirtyDaysAgo
    )

    const totalDaysAnalyzed = validMoodHistory.length

    if (totalDaysAnalyzed === 0) {
      const prediction = this.getDefaultPrediction()
      return {
        prediction,
        similarDaysCount: 0,
        totalDaysAnalyzed: 0,
        confidenceFactors: ['no_recent_data_using_default'],
        similarDays: [],
      }
    }

    const similarDays = this.findSimilarDays(validMoodHistory, weatherForecast)
    const similarDaysCount = similarDays.length

    let prediction: Prediction
    let confidenceFactors: string[] = []

    if (similarDaysCount > 0) {
      prediction = this.predictFromSimilarDays(similarDays, weatherForecast)
      confidenceFactors.push(`found_${similarDaysCount}_similar_days`)
    } else {
      prediction = this.predictFromMonthlyPatterns(
        validMoodHistory,
        weatherForecast
      )
      confidenceFactors.push('using_monthly_patterns')
    }

    if (totalDaysAnalyzed >= 14) confidenceFactors.push('good_monthly_history')
    if (totalDaysAnalyzed >= 25)
      confidenceFactors.push('excellent_monthly_coverage')

    return {
      prediction,
      similarDaysCount,
      totalDaysAnalyzed,
      confidenceFactors,
      similarDays: similarDays,
    }
  }

  private static predictFromSimilarDays(
    similarDays: MoodEntry[],
    forecast: WeatherEntry
  ): Prediction {
    const moodDistribution = this.analyzeMoodDistribution(similarDays)
    const dominantMood = this.getDominantMoodType(moodDistribution)
    const avgScoreForDominantMood =
      moodDistribution[dominantMood]?.avgScore || 6
    const confidence = this.calculateSemanticConfidence(
      similarDays.length,
      moodDistribution
    )

    return {
      type: dominantMood,
      confidence,
      recommendations: this.getRecommendations(dominantMood),
      expectedMoodScore: Math.round(avgScoreForDominantMood),
    }
  }

  private static predictFromMonthlyPatterns(
    moodHistory: MoodEntry[],
    forecast: WeatherEntry
  ): Prediction {
    const monthlyDistribution = this.analyzeMoodDistribution(moodHistory)
    const mostFrequentMood = this.getMostFrequentMood(monthlyDistribution)
    const confidence = Math.min(0.5 + moodHistory.length * 0.01, 0.8)

    return {
      type: mostFrequentMood,
      confidence,
      recommendations: this.getRecommendations(mostFrequentMood),
      expectedMoodScore: Math.round(
        monthlyDistribution[mostFrequentMood]?.avgScore || 6
      ),
    }
  }

  private static analyzeMoodDistribution(
    entries: MoodEntry[]
  ): Record<string, { count: number; avgScore: number }> {
    const distribution: Record<string, { count: number; avgScore: number }> = {}

    entries.forEach((entry) => {
      const moodType = this.getMoodTypeFromEntry(entry)

      if (!distribution[moodType]) {
        distribution[moodType] = { count: 0, avgScore: 0 }
      }

      distribution[moodType].count++
      distribution[moodType].avgScore =
        (distribution[moodType].avgScore * (distribution[moodType].count - 1) +
          entry.moodScore) /
        distribution[moodType].count
    })

    return distribution
  }

  private static getMoodTypeFromEntry(entry: MoodEntry): Prediction['type'] {
    const textMood = entry.mood?.toLowerCase()
    const expectedMoodType = this.getMoodType(entry.moodScore)

    if (textMood === 'sad' && expectedMoodType !== 'SAD') {
      return 'SAD'
    }

    if (textMood === 'happy' && expectedMoodType === 'SAD') {
      return 'POSITIVE'
    }

    return expectedMoodType
  }

  private static getDominantMoodType(
    distribution: Record<string, { count: number; avgScore: number }>
  ): Prediction['type'] {
    let dominantMood: Prediction['type'] = 'NEUTRAL'
    let maxCount = 0

    for (const [moodType, data] of Object.entries(distribution)) {
      if (data.count > maxCount) {
        maxCount = data.count
        dominantMood = moodType as Prediction['type']
      }
    }

    return dominantMood
  }

  private static getMostFrequentMood(
    distribution: Record<string, { count: number; avgScore: number }>
  ): Prediction['type'] {
    return this.getDominantMoodType(distribution)
  }

  private static calculateSemanticConfidence(
    similarDaysCount: number,
    distribution: Record<string, { count: number; avgScore: number }>
  ): number {
    const baseConfidence = Math.min(0.4 + similarDaysCount * 0.1, 0.8)

    const moodTypes = Object.keys(distribution)
    if (moodTypes.length === 1) {
      return Math.min(baseConfidence + 0.15, 0.9)
    }

    return baseConfidence
  }

  private static findSimilarDays(
    moodHistory: MoodEntry[],
    forecast: WeatherEntry
  ): MoodEntry[] {
    return moodHistory.filter((day) => {
      if (!day.weather) return false

      const tempDiff = Math.abs(day.weather.temperature - forecast.temperature)
      if (tempDiff > 3) return false

      const dayWeatherType = this.getSimpleWeatherType(day.weather.weathercode)
      const forecastWeatherType = this.getSimpleWeatherType(
        forecast.weathercode
      )

      return dayWeatherType === forecastWeatherType
    })
  }

  private static getSimpleWeatherType(weathercode: number): string {
    if ([0, 1].includes(weathercode)) return 'sunny'
    if ([2, 3].includes(weathercode)) return 'cloudy'
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(weathercode)) return 'rainy'
    if ([71, 73, 75, 77, 85, 86].includes(weathercode)) return 'snowy'
    if ([45, 48].includes(weathercode)) return 'foggy'
    return 'other'
  }

  private static getMoodType(moodScore: number): Prediction['type'] {
    if (moodScore >= 8) return 'POSITIVE'
    if (moodScore >= 6) return 'NEUTRAL'
    if (moodScore >= 4) return 'COZY'
    return 'SAD'
  }

  private static getRecommendations(type: Prediction['type']): string[] {
    const baseRecommendations = {
      POSITIVE: [
        'Channel your energy into activity: go for a run, bike ride, or a hike in nature.',
        'Perfect day to tackle a challenging project or start something new you’ve been putting off.',
        'Plan a social gathering or call a friend—your positivity is contagious!',
        'Dive into a creative hobby or passion project—your energy will fuel your ideas.',
        'Set new goals or plan an exciting future trip. Your optimism will help you dream big.',
      ],
      COZY: [
        'Create a cozy sanctuary: soft blankets, warm tea, dim lighting, and a good book or movie.',
        'Have a self-care evening: a relaxing bath, face mask, and your favorite calming music.',
        'Spend quality time with a loved one or a pet with a board game or deep conversation.',
        'Try some gentle baking or cooking—comforting smells and tastes will enhance the mood.',
        'Practice mindfulness or journaling in a quiet, comfortable spot.',
      ],
      RELAXED: [
        'A day for gentle activities and going with the flow',
        'Perfect for quiet hobbies and taking things slow',
        'Listen to your body and rest when needed',
        'Light stretching or a leisurely walk would feel great',
        'Enjoy some quiet time with a book or podcast',
      ],
      NEUTRAL: [
        'A great day for routine tasks and organization. Tidy your space or tackle your inbox.',
        'Balance is key. Schedule a mix of work and a pleasant activity you enjoy.',
        'Dedicate time to personal growth: learn a new skill or read an informative article.',
        'Connect with a colleague or acquaintance—low-pressure socializing can be refreshing.',
        'Go with the flow. Be open to spontaneous opportunities that might arise.',
      ],
      SAD: [
        'Be kind to yourself. Allow yourself to feel without judgment. It’s okay not to be okay.',
        'Reach out for support. Talk to a trusted friend, family member, or therapist.',
        'Find a small comfort: a nostalgic movie, a favorite comfort food, or a warm hug.',
        'Express your feelings through writing, art, or music. Let it out in a creative way.',
        'If you have the energy, a short walk outside or opening a window for fresh air can help shift your perspective, even just a little.',
      ],
    }

    return baseRecommendations[type] || baseRecommendations.NEUTRAL
  }

  private static getDefaultPrediction(): Prediction {
    return {
      type: 'NEUTRAL',
      confidence: 0.3,
      recommendations: this.getRecommendations('NEUTRAL'),
      expectedMoodScore: 6,
    }
  }
}
