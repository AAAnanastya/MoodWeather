'use client'

import citiesJson from '@/store/cities.json'
import { useEffect, useState } from 'react'

interface CityCoords {
  lat: number
  lon: number
}

const cities: Record<string, CityCoords> = citiesJson

export default function SettingsPage() {
  const [city, setCity] = useState<string>('Moscow')

  useEffect(() => {
    fetch('/api/city')
      .then((res) => res.json())
      .then((data) => {
        if (data.city && cities[data.city]) {
          setCity(data.city)
        }
      })
      .catch(() => {
        setCity('Moscow')
      })
  }, [])

  const handleChange = async (newCity: string) => {
    if (!cities[newCity]) return
    setCity(newCity)
    await fetch('/api/city', {
      method: 'POST',
      body: JSON.stringify({ city: newCity }),
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return (
    <div className="p-6 flex flex-col gap-4">
      <label className="text-sm">Choose city:</label>
      <select
        value={city}
        onChange={(e) => handleChange(e.target.value)}
        className="border rounded p-2"
      >
        {Object.keys(cities).map((cityName) => (
          <option key={cityName} value={cityName}>
            {cityName}
          </option>
        ))}
      </select>
    </div>
  )
}
