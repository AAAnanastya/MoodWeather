import citiesJson from '@/store/cities.json'
import { WeatherEntry } from '@/store/weather-store'

interface CityCoords {
  lat: number
  lon: number
}

function getCityCoordinates(cityName: string = 'Moscow'): CityCoords {
  const cities: Record<string, CityCoords> = citiesJson
  return cities[cityName] ?? cities['Moscow']
}

export async function getCurrentWeather(city: string) {
  const cities: Record<string, CityCoords> = citiesJson
  const { lat, lon } = cities[city] ?? cities['Moscow']

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(
    lat
  )}&longitude=${encodeURIComponent(lon)}&current=temperature_2m,relativehumidity_2m,pressure_msl,windspeed_10m,winddirection_10m,cloudcover,weathercode,is_day&timezone=auto&wind_speed_unit=ms`

  const res = await fetch(url, {
    cache: 'no-store',
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Failed to fetch weather: ${res.status} ${text}`)
  }

  const data = await res.json()

  // Определение облачности
  const getCloudStatus = (cloudcover: number): string => {
    if (cloudcover < 20) return 'clear'
    if (cloudcover < 70) return 'partly_cloudy'
    return 'overcast'
  }

  // Определение типа осадков по погодному коду
  console.log(data.current.weathercode)
  const getPrecipitationType = (code: number): string => {
    if (code >= 51 && code <= 67) return 'rain'
    if (code >= 71 && code <= 77) return 'snow'
    if (code >= 80 && code <= 82) return 'rain'
    if (code >= 95 && code <= 99) return 'storm'
    return 'none'
  }

  return {
    // Основные параметры
    temperature: data.current.temperature_2m,
    humidity: data.current.relativehumidity_2m,
    pressure: data.current.pressure_msl,
    windSpeed: data.current.windspeed_10m,
    windDirection: data.current.winddirection_10m,
    cloudcover: data.current.cloudcover,
    weathercode: data.current.weathercode,
    isDay: data.current.is_day,

    // Производные параметры
    cloudStatus: getCloudStatus(data.current.cloudcover),
    dayNight: data.current.is_day ? 'day' : 'night',
    time: data.current.time,
    precipitationType: getPrecipitationType(data.current.weathercode),
  }
}

export async function getTommorowWeatherForecast(): Promise<WeatherEntry> {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=55.7558&longitude=37.6173&daily=weathercode,temperature_2m_max&timezone=Europe/Moscow`
    )

    if (!response.ok) {
      throw new Error('Weather API request failed')
    }

    const data = await response.json()
    const tomorrowIndex = 1

    return {
      temperature: Math.round(data.daily.temperature_2m_max[tomorrowIndex]),
      weathercode: data.daily.weathercode[tomorrowIndex],
      time: data.daily.time[tomorrowIndex],
    }
  } catch (error) {
    console.error('Failed to fetch weather forecast:', error)

    return {
      temperature: 15,
      weathercode: 0,
      time: new Date(Date.now() + 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
    }
  }
}

export async function getWeatherForecast(
  city: string = 'Moscow'
): Promise<WeatherEntry> {
  try {
    const { lat, lon } = getCityCoordinates(city)

    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=2`
    )

    if (!response.ok) {
      throw new Error('Weather API request failed')
    }

    const data = await response.json()

    if (!data.daily || !data.daily.time || data.daily.time.length < 2) {
      throw new Error('Invalid weather data structure')
    }

    const tomorrowIndex = 1

    const tomorrowWeather = {
      temperature: Math.round(data.daily.temperature_2m_max[tomorrowIndex]),
      weathercode: data.daily.weathercode[tomorrowIndex],
      time: data.daily.time[tomorrowIndex],
      temperatureMin: Math.round(data.daily.temperature_2m_min[tomorrowIndex]),
    }

    return tomorrowWeather
  } catch (error) {
    console.error('Failed to fetch weather forecast:', error)

    // Заглушка с данными на завтра
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    return {
      temperature: 15,
      weathercode: 2,
      time: tomorrow.toISOString().split('T')[0],
    }
  }
}
