import CardWrapper from '@/components/base/CardWrapper'
import MoodCard from '@/components/mood/MoodCard'
import MoodFormWrapper from '@/components/mood/MoodFormWrapper'
import { PredictionEngine } from '@/components/mood/PredictionEngine'
import WeatherCard from '@/components/weather/WeatherCard'

export default function Home() {
  return (
    <>
      <div className="flex flex-col gap-5 lg:grid lg:grid-cols-2 lg:grid-rows-3 lg:gap-4">
        <CardWrapper className="lg:col-span-1">
          <WeatherCard />
        </CardWrapper>

        <CardWrapper className="lg:col-span-1">
          <MoodCard />
        </CardWrapper>

        <CardWrapper
          className="lg:col-span-1 text-white"
          background="linear-gradient(to right, var(--lavenderPurple), var(--darkAccentColor), var(--lightPurple), var(--lightPurple))"
        >
          <PredictionEngine />
        </CardWrapper>

        <CardWrapper className="lg:col-span-1 lg:row-span-2">
          <p>Mood trend diagram</p>
        </CardWrapper>

        <MoodFormWrapper />
      </div>
    </>
  )
}
