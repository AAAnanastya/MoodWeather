import { getCurrentWeather } from '@/hooks/weather'
import { cookies } from 'next/headers'
import { FaMapMarkerAlt } from 'react-icons/fa'

export default async function WeatherCard() {
  const store = await cookies()
  const city = store.get('city')?.value || 'Moscow'
  const weather = await getCurrentWeather(city)
  console.log(city, weather.precipitationType)
  const precipitationType =
    weather.precipitationType !== 'none'
      ? weather.precipitationType
      : weather.cloudStatus

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Current Weather</h2>
        <span className="flex items-center gap-1">
          <FaMapMarkerAlt className="text-[var(--deepPurple)] h-3" />
          <p className="text-[12px]">{city}</p>
        </span>
      </div>

      <div className="pt-3 flex items-center justify-between">
        <span>
          <p className="text-4xl font-black">
            {Math.floor(weather.temperature)}°C
          </p>
          <p className="text-sm text-[var(--helperText)]">
            {precipitationType
              .replace(/_/g, ' ')
              .replace(/\b\w/g, (char) => char.toUpperCase())}
          </p>
        </span>

        <img
          src={`/weather-icons/${weather.dayNight}/${precipitationType}.png`}
          alt={`${weather.dayNight} ${precipitationType}`}
          className="w-auto h-12"
        />
      </div>

      <hr className="text-[var(--helperText)] my-3 opacity-15" />

      <div className="flex flex-inline justify-between ">
        <span className="flex flex-col items-center">
          <p className="weatherHelperMark">Pressure</p>
          <p className="weatherHelperValue">
            {Math.floor(weather.pressure)} hPa
          </p>
        </span>
        <span className="flex flex-col items-center">
          <p className="weatherHelperMark">Himidity</p>
          <p className="weatherHelperValue">{weather.humidity}%</p>
        </span>
        <span className="flex flex-col items-center">
          <p className="weatherHelperMark">Wind</p>
          <p className="weatherHelperValue">
            {Math.floor(weather.windSpeed)} km/h
          </p>
        </span>
      </div>
    </>
  )
}
