'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import CardWrapper from '../base/CardWrapper'

const MoodForm = dynamic(() => import('./MoodForm'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-[var(--background)] bg-opacity-50 flex items-center justify-center p-4 z-100000">
      <div className="w-50 h-30">
        <CardWrapper>
          <p className="text-lg text-center">Loading form...</p>
        </CardWrapper>
      </div>
    </div>
  ),
})

export default function MoodFormWrapper() {
  const [isOpen, setIsOpen] = useState(false)

  const openForm = () => setIsOpen(true)
  const closeForm = () => setIsOpen(false)

  return (
    <>
      <button
        onClick={openForm}
        className="lg:col-span-1 bg-[var(--deepPurple)] rounded-2xl h-10 text-white font-bold hover:bg-[var(--darkAccentColor)] transition-colors"
      >
        +Add Mood
      </button>

      {isOpen && <MoodForm onClose={closeForm} />}
    </>
  )
}

export const useMoodForm = () => {
  const [isOpen, setIsOpen] = useState(false)

  return {
    isOpen,
    openForm: () => setIsOpen(true),
    closeForm: () => setIsOpen(false),
    MoodFormComponent: isOpen
      ? dynamic(() => import('./MoodForm'), { ssr: false })
      : null,
  }
}
