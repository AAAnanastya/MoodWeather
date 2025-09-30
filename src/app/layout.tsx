import DynamicHeader from '@/components/navigation/DynamicHeader'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'MoodWeather',
  description:
    'Исследуйте корреляцию между вашим настроением и погодными условиями. Отслеживайте, как температура, осадки и солнечная активность влияют на ваше эмоциональное состояние.',
  keywords:
    'погода, настроение, корреляция, эмоции, метеозависимость, самоанализ, психология',
  openGraph: {
    title: 'MoodWeather',
    description:
      'Исследуйте взаимосвязь между погодой и вашим эмоциональным состоянием',
    type: 'website',
    locale: 'ru_RU',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased p-6 md:p-8 lg:px-14`}
      >
        <DynamicHeader />
        <main className="py-4">{children}</main>
      </body>
    </html>
  )
}
