import citiesJson from '@/store/cities.json'

interface CityCoords {
  lat: number
  lon: number
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
