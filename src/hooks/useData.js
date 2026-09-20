import { useState, useEffect } from 'react'

/**
 * Custom hook for asynchronously fetching stats.json and events.json dataset.
 * @returns {{ stats: Object|null, events: Array|null, loading: boolean, error: string|null }} Data loading state.
 */
export function useData() {
  const [stats, setStats] = useState(null)
  const [events, setEvents] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    Promise.all([
      fetch('./data/stats.json').then((res) => {
        if (!res.ok) throw new Error('Failed to fetch stats.json')
        return res.json()
      }),
      fetch('./data/events.json').then((res) => {
        if (!res.ok) throw new Error('Failed to fetch events.json')
        return res.json()
      }),
    ])
      .then(([statsData, eventsData]) => {
        if (isMounted) {
          setStats(statsData)
          setEvents(eventsData)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Error loading dataset')
          setLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  return { stats, events, loading, error }
}
