export async function GET() {
  try {
    // Позже здесь будет запрос к БД

    // Заглушка для примера
    const mockMoods = [
      {
        id: 1,
        mood: 'sad',
        date: '2025-09-28',
        moodScore: 3,
        weather: { temperature: 12, weathercode: 63 }, // дождь
      },
      {
        id: 2,
        mood: 'sad',
        date: '2025-09-29',
        moodScore: 8,
        weather: { temperature: 10, weathercode: 3 },
      },
      {
        id: 3,
        mood: 'sad',
        date: '2025-09-30',
        moodScore: 6,
        weather: { temperature: 11, weathercode: 3 }, // облачно
      },
      {
        id: 4,
        mood: 'sad',
        date: '2025-09-27',
        moodScore: 4,
        weather: { temperature: 10, weathercode: 61 }, // дождь
      },
      {
        id: 5,
        mood: 'happy',
        date: '2025-09-26',
        moodScore: 7,
        weather: { temperature: 14, weathercode: 0 }, // ясно
      },
      {
        id: 6,
        mood: 'sad',
        date: '2025-09-25',
        moodScore: 5,
        weather: { temperature: 9, weathercode: 71 }, // снег
      },
    ]

    return Response.json(mockMoods)
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch mood history' },
      { status: 500 }
    )
  }
}
