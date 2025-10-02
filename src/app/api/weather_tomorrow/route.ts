import { getWeatherForecast } from '@/hooks/weather'

export async function GET() {
  const forecast = await getWeatherForecast()
  return Response.json(forecast)
}
