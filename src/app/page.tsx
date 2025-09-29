import CardWrapper from '@/components/CardWrapper'
import WeatherCard from '@/components/WeatherCard'

export default function Home() {
  return (
    <div className="flex flex-col gap-5 lg:grid lg:grid-cols-2 lg:grid-rows-3 lg:gap-4">
      <CardWrapper className="lg:col-span-1">
        <WeatherCard />
      </CardWrapper>

      <CardWrapper className="lg:col-span-1">
        <p>Mood today</p>
      </CardWrapper>

      <CardWrapper
        className="lg:col-span-1 text-white"
        background="linear-gradient(to right, var(--lavenderPurple), var(--darkAccentColor), var(--lightPurple), var(--lightPurple))"
      >
        <p>Mood forecast</p>
      </CardWrapper>

      <CardWrapper className="lg:col-span-1 lg:row-span-2">
        <p>Mood trend diagram</p>
      </CardWrapper>

      <button className="lg:col-span-1 bg-[var(--deepPurple)] rounded-2xl h-10 text-white font-bold">
        + Add mood
      </button>
    </div>
  )
}
