'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import StaggeredMenuSidebar from './SideBar'

export default function DynamicHeader() {
  const pathname = usePathname()
  const isInitialLoad = useRef(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      isInitialLoad.current = false
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  return (
    <header className="pt-2 top-0 left-0 right-0 z-50 mx-auto">
      <HeaderContent
        pathname={pathname}
        isInitialLoad={isInitialLoad.current}
      />
    </header>
  )
}

function HeaderContent({
  pathname,
  isInitialLoad,
}: {
  pathname: string
  isInitialLoad: boolean
}) {
  const isRootPage = pathname === '/'
  const router = useRouter()
  const handleGoHome = () => router.push('/')

  const animationProps = isInitialLoad
    ? {
        initial: { opacity: 1, y: 0, x: 0 },
        animate: { opacity: 1, y: 0, x: 0 },
        exit: { opacity: 1, y: 0, x: 0 },
        transition: { duration: 0 },
      }
    : {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
        transition: { duration: 0.25 },
      }

  const backButtonAnimationProps = isInitialLoad
    ? {
        initial: { opacity: 1, x: 0 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 1, x: 0 },
        transition: { duration: 0 },
      }
    : {
        initial: { opacity: 0, x: -8 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -8 },
        transition: { duration: 0.2 },
      }

  return (
    <div className="flex items-center h-[44px] justify-between">
      <div className="flex items-center space-x-2">
        <AnimatePresence mode="wait">
          {!isRootPage && (
            <motion.button
              key="back-button"
              onClick={handleGoHome}
              className="hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Назад"
              {...backButtonAnimationProps}
            >
              ←
            </motion.button>
          )}
        </AnimatePresence>

        <div className="flex flex-col">
          <AnimatePresence mode="wait">
            <motion.h1
              key={pathname}
              {...animationProps}
              className="text-xl font-semibold"
            >
              {getPageTitle(pathname)}
            </motion.h1>
            {isRootPage && (
              <motion.p
                key="root-subtitle"
                initial={
                  isInitialLoad ? { opacity: 1, y: 0 } : { opacity: 0, y: -5 }
                }
                animate={{ opacity: 1, y: 0 }}
                exit={
                  isInitialLoad ? { opacity: 1, y: 0 } : { opacity: 0, y: -5 }
                }
                transition={{
                  duration: isInitialLoad ? 0 : 0.25,
                  delay: isInitialLoad ? 0 : 0.1,
                }}
                className="md:hidden text-xs text-[var(--helperText)]"
              >
                Главная
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      <StaggeredMenuSidebar
        items={[
          { label: 'Главная', ariaLabel: 'Главная', link: '/' },
          { label: 'Аналитика', ariaLabel: 'Аналитика', link: '/analytics' },
          {
            label: 'Достижения',
            ariaLabel: 'Достижения',
            link: '/achievements',
          },
          { label: 'Настройки', ariaLabel: 'Настройки', link: '/settings' },
        ]}
      />
    </div>
  )
}

function getPageTitle(pathname: string): string {
  const titles: { [key: string]: string } = {
    '/': 'MoodWeather',
    '/analytics': 'Аналитика',
    '/achievements': 'Достижения',
    '/settings': 'Настройки',
  }
  return titles[pathname] || 'Страница 404'
}
