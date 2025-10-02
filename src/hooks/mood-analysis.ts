import { MoodEntry, Prediction } from '@/store/mood-store'
import { WeatherEntry } from '@/store/weather-store'

export class MoodPredictor {
  static predict(
    moodHistory: MoodEntry[],
    weatherForecast: WeatherEntry
  ): Prediction {
    if (moodHistory.length === 0) {
      return this.getDefaultPrediction(weatherForecast)
    }

    const similarDays = moodHistory.filter((entry) =>
      this.isWeatherSimilar(entry.weather, weatherForecast)
    )

    if (similarDays.length > 0) {
      return this.analyzeSimilarDays(similarDays, weatherForecast)
    } else {
      return this.analyzeGeneralPattern(moodHistory, weatherForecast)
    }
  }

  private static analyzeGeneralPattern(
    moodHistory: MoodEntry[],
    forecast: WeatherEntry
  ): Prediction {
    // Анализ общих тенденций без точного совпадения погоды
    const avgMood =
      moodHistory.reduce((sum, entry) => sum + entry.moodScore, 0) /
      moodHistory.length

    // Учитываем влияние конкретной погоды на общий тренд
    const weatherImpact = this.calculateWeatherImpact(forecast)
    const adjustedMood = avgMood + weatherImpact

    const type = this.getMoodType(adjustedMood)
    const confidence = 0.5 // Средняя уверенность для общих паттернов

    return {
      type,
      confidence,
      recommendations: this.getRecommendations(type, forecast),
    }
  }

  private static calculateWeatherImpact(weather: WeatherEntry): number {
    // Влияние погоды на настроение
    const isSunny = [0, 1].includes(weather.weathercode)
    const isRainy = [61, 63, 65, 80, 81, 82].includes(weather.weathercode)
    const isCold = weather.temperature < 10
    const isPerfectTemp = weather.temperature >= 18 && weather.temperature <= 25

    if (isSunny && isPerfectTemp) return 1.5
    if (isSunny) return 1.0
    if (isRainy && isCold) return -1.5
    if (isRainy) return -0.5
    if (isCold) return -1.0

    return 0
  }

  private static isWeatherSimilar(a: WeatherEntry, b: WeatherEntry): boolean {
    const tempDiff = Math.abs(a.temperature - b.temperature)
    const sameWeatherCode = a.weathercode === b.weathercode

    return tempDiff <= 5 && sameWeatherCode
  }

  private static analyzeSimilarDays(
    similarDays: MoodEntry[],
    forecast: WeatherEntry
  ): Prediction {
    const avgMood =
      similarDays.reduce((sum, entry) => sum + entry.moodScore, 0) /
      similarDays.length

    const type = this.getMoodType(avgMood)
    const confidence = Math.min(similarDays.length / 10, 0.95)

    return {
      type,
      confidence,
      recommendations: this.getRecommendations(type, forecast),
    }
  }

  private static getMoodType(avgMood: number): Prediction['type'] {
    if (avgMood >= 8) return 'POSITIVE'
    if (avgMood >= 6) return 'NEUTRAL'
    if (avgMood >= 4) return 'COZY'
    return 'RELAXED'
  }

  private static getDefaultPrediction(weather: WeatherEntry): Prediction {
    const isSunny = [0, 1].includes(weather.weathercode)
    const isRainy = [61, 63, 65, 80, 81, 82].includes(weather.weathercode)
    const isCold = weather.temperature < 10

    let type: Prediction['type'] = 'NEUTRAL'
    if (isSunny) type = 'POSITIVE'
    if (isRainy) type = 'COZY'
    if (isCold) type = 'RELAXED'

    return {
      type,
      confidence: 0.3,
      recommendations: this.getRecommendations(type, weather),
    }
  }

  private static getRecommendations(
    type: Prediction['type'],
    weather: WeatherEntry
  ): string[] {
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
}
