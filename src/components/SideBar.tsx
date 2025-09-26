'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export interface StaggeredMenuItem {
  label: string
  ariaLabel: string
  link: string
}

export interface StaggeredMenuProps {
  position?: 'left' | 'right'
  colors?: string[]
  items?: StaggeredMenuItem[]
  displayItemNumbering?: boolean
  menuButtonColor?: string
  openMenuButtonColor?: string
  accentColor?: string
  onMenuOpen?: () => void
  onMenuClose?: () => void
}

export default function StaggeredMenuSidebar({
  position = 'right',
  colors = ['var(--deepAccentColor)', 'var(--lightAccentColor)'],
  items = [],
  displayItemNumbering = true,
  menuButtonColor = 'var(--foreground)',
  openMenuButtonColor = 'var(--foreground)',
  accentColor = 'var(--lightAccentColor)',
  onMenuOpen,
  onMenuClose,
}: StaggeredMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const toggleMenu = () => {
    const newState = !isOpen
    setIsOpen(newState)

    if (newState) {
      onMenuOpen?.()
    } else {
      onMenuClose?.()
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    onMenuClose?.()
  }

  /** === Variants === */
  const preLayerVariants = {
    closed: (custom: number) => ({
      x: position === 'left' ? '-100%' : '100%',
      transition: {
        delay: custom * 0.05,
        duration: 0.5,
        ease: 'easeInOut',
      },
    }),
    open: (custom: number) => ({
      x: 0,
      transition: {
        delay: custom * 0.1,
        duration: 0.6,
        ease: 'easeOut',
      },
    }),
  }

  const preLayers =
    colors && colors.length ? colors.slice(0, 4) : ['#1e1e22', '#35353c']
  if (preLayers.length >= 3) {
    const mid = Math.floor(preLayers.length / 2)
    preLayers.splice(mid, 1)
  }

  const overlayVariants = {
    closed: { opacity: 0 },
    open: { opacity: 0.6 },
  }

  const panelVariants = {
    closed: { x: position === 'left' ? '-100%' : '100%' },
    open: {
      x: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
        delay: preLayers.length * 0.1,
      },
    },
  }

  const menuItemVariants = {
    closed: { y: '140%', rotate: 10, opacity: 0 },
    open: (i: number) => ({
      y: 0,
      rotate: 0,
      opacity: 1,
      transition: {
        delay: 0.3 + i * 0.1,
        duration: 0.7,
        ease: 'easeOut',
      },
    }),
  }

  const numberVariants = {
    closed: {
      opacity: 0,
    },
    open: (custom: number) => ({
      opacity: 1,
      transition: {
        delay: 0.25 + custom * 0.08,
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    }),
  }

  return (
    <div style={{ ['--sm-accent' as any]: accentColor }}>
      {/* Toggle Button*/}
      <button
        onClick={toggleMenu}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        className="z-60 flex items-center gap-2 relative"
        style={{
          color: isOpen ? openMenuButtonColor : menuButtonColor,
        }}
      >
        <div className="relative h-6 w-16 overflow-hidden flex items-center justify-end">
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.span
                key="close"
                className="absolute leading-none block"
                initial={isMounted ? { y: 20, opacity: 0 } : false}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                Закрыть
              </motion.span>
            ) : (
              <motion.span
                key="menu"
                className="absolute leading-none block"
                initial={isMounted ? { y: -20, opacity: 0 } : false}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                Меню
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <motion.span
          className="relative w-[12px] h-[12px] block"
          initial={isMounted ? { rotate: 0 } : false}
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <motion.span
            className="absolute left-0 top-1/2 w-full h-[1.5px] bg-current rounded"
            initial={isMounted ? { rotate: 0, scaleX: 1 } : false}
            animate={{
              rotate: isOpen ? 90 : 0,
              scaleX: isOpen ? 1.2 : 1,
            }}
            transition={{ duration: 0.3 }}
          />
          <motion.span
            className="absolute left-0 top-1/2 w-full h-[1.5px] bg-current rounded"
            initial={isMounted ? { rotate: 90, scaleX: 1 } : false}
            animate={{
              rotate: isOpen ? 0 : 90,
              scaleX: isOpen ? 1.2 : 1,
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.span>
      </button>

      {/* Pre-layers */}
      {isOpen && (
        <div
          className="fixed top-0 h-full w-[clamp(260px,38vw,420px)] pointer-events-none z-40"
          style={{
            [position]: 0,
            left: position === 'left' ? 0 : 'auto',
            right: position === 'right' ? 0 : 'auto',
          }}
        >
          <AnimatePresence>
            {preLayers.map((c, i) => (
              <motion.div
                key={i}
                className="absolute top-0 right-0 h-full w-full"
                style={{ background: c }}
                custom={i}
                initial="closed"
                animate="open"
                exit="closed"
                variants={preLayerVariants as any}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-[var(--maskColor)] z-30"
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
          />
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            className="fixed top-0 right-0 h-full w-[clamp(260px,38vw,420px)] bg-[var(--background)] pl-10 pt-22 md:pt-26 flex flex-col z-50 overflow-y-auto backdrop-blur-xl"
            style={{ WebkitBackdropFilter: 'blur(12px)' }}
            initial="closed"
            animate="open"
            exit="closed"
            variants={panelVariants as any}
          >
            <ul
              className="flex flex-col gap-4"
              data-numbering={displayItemNumbering || undefined}
            >
              {items.map((it, idx) => (
                <li key={it.label + idx}>
                  <motion.div
                    custom={idx}
                    initial="closed"
                    animate="open"
                    exit="closed"
                    variants={menuItemVariants as any}
                  >
                    <Link
                      href={it.link}
                      aria-label={it.ariaLabel}
                      className="flex gap-1 font-bold text-2xl md:text-3xl lg:text-4xl uppercase tracking-tight relative"
                      onClick={handleClose}
                    >
                      <span>{it.label}</span>

                      {displayItemNumbering && (
                        <motion.span
                          className="text-sm bg-clip-text opacity-50"
                          style={{
                            backgroundImage:
                              'linear-gradient(to bottom right, var(--deepAccentColor), var(--lightAccentColor))',
                            color: 'transparent',
                          }}
                          variants={numberVariants as any}
                          initial="closed"
                          animate="open"
                          custom={idx}
                        >
                          {(idx + 1).toString().padStart(2, '0')}
                        </motion.span>
                      )}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  )
}
