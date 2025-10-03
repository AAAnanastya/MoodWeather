'use client'

import { useMoodStore } from '@/store/mood-store'
import Image from 'next/image'
import { useState } from 'react'
import CardWrapper from '../base/CardWrapper'

const MOOD_OPTIONS = [
  {
    value: 'sad',
    label: 'Sad',
    image: '/emoji/sad.png',
    color: 'border-blue-500 bg-blue-50',
  },
  {
    value: 'cozy',
    label: 'Cozy',
    image: '/emoji/cozy.png',
    color: 'border-orange-500 bg-orange-50',
  },
  {
    value: 'relaxed',
    label: 'Relaxed',
    image: '/emoji/relaxed.png',
    color: 'border-green-500 bg-green-50',
  },
  {
    value: 'neutral',
    label: 'Neutral',
    image: '/emoji/neutral.png',
    color: 'border-gray-500 bg-gray-50',
  },
  {
    value: 'positive',
    label: 'Positive',
    image: '/emoji/positive.png',
    color: 'border-yellow-500 bg-yellow-50',
  },
]

interface MoodFormProps {
  onClose: () => void
}

export default function MoodForm({ onClose }: MoodFormProps) {
  const [selectedMood, setSelectedMood] = useState('')
  const [moodScore, setMoodScore] = useState(5)
  const [notes, setNotes] = useState('')
  const { addMoodEntry, isLoading, error } = useMoodStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedMood) {
      alert('Please select your mood for today')
      return
    }

    try {
      const newMoodEntry = {
        date: new Date().toISOString().split('T')[0],
        moodScore,
        mood: selectedMood,
        weather: {
          temperature: 15,
          weathercode: 0,
          time: new Date().toISOString(),
        },
        notes: notes.trim() || undefined,
      }

      await addMoodEntry(newMoodEntry)

      if (!error) {
        onClose()
      }
    } catch (err) {
      console.error('Error saving mood:', err)
    }
  }

  return (
    <div className="fixed inset-0 bg-[var(--background)] bg-opacity-70 flex items-center justify-center z-100000 px-4 md:px-30 lg:px-90">
      <CardWrapper>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">How are you feeling today?</h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 text-2xl disabled:opacity-50"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Choose your current mood:
            </label>
            <div className="grid grid-cols-3 gap-3">
              {MOOD_OPTIONS.map((mood) => (
                <button
                  key={mood.value}
                  type="button"
                  onClick={() => setSelectedMood(mood.value)}
                  disabled={isLoading}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedMood === mood.value
                      ? `${mood.color} scale-105`
                      : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="w-12 h-12 relative mx-auto mb-2">
                    <Image
                      src={mood.image}
                      alt={mood.label}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="text-sm font-medium text-gray-700">
                    {mood.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <label className="block text-sm font-medium mb-2">
            Rate your mood:{' '}
            <span className="text-[var(--deepPurple)] text-md font-bold">
              {moodScore}/10
            </span>
          </label>

          <div className="relative m-0">
            <div className="absolute top-1/2 left-0 right-0 h-3 bg-gradient-to-r from-[var(--deepPurple)] via-[var(--lightPurple)] to-[var(--lightAccentColor)] rounded-full -translate-y-1/2"></div>
            <div className="absolute top-1/2 left-0 right-0 flex justify-between pointer-events-none -translate-y-1/2 px-[10px]">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className={`w-1 h-5 rounded-full bg-white border border-[var(--maskColor)]/30`}
                />
              ))}
            </div>

            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={moodScore}
              onChange={(e) => setMoodScore(parseInt(e.target.value))}
              disabled={isLoading}
              className="relative w-full h-4 bg-transparent appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed z-10
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:h-7
                [&::-webkit-slider-thumb]:w-7
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-[var(--deepPurple)]
                [&::-webkit-slider-thumb]:border-2
                [&::-webkit-slider-thumb]:border-white
                [&::-webkit-slider-thumb]:shadow-lg
                [&::-webkit-slider-thumb]:relative
                [&::-webkit-slider-thumb]:z-20
                [&::-moz-range-thumb]:h-7
                [&::-moz-range-thumb]:w-7
                [&::-moz-range-thumb]:rounded-full
                [&::-moz-range-thumb]:bg-[var(--deepPurple)]
                [&::-moz-range-thumb]:border-2
                [&::-moz-range-thumb]:border-white
                [&::-moz-range-thumb]:shadow-lg
                [&::-moz-range-thumb]:relative
                [&::-moz-range-thumb]:z-20"
            />
          </div>

          <div className="flex justify-between text-[11px] text-[var(--helperText)] opacity-70 m-0 ">
            <span>Bad</span>
            <span>Great</span>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={isLoading || !selectedMood}
              className="flex-1 py-3 px-4 bg-[var(--deepPurple)] text-white font-medium rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Save...
                </>
              ) : (
                'Save'
              )}
            </button>
          </div>
        </form>
      </CardWrapper>
    </div>
  )
}
