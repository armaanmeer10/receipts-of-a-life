import { useState, useEffect } from 'react'

/**
 * Custom hook for asynchronously fetching stats.json, events.json, and hours.json dataset.
 * @returns {{ stats: Object|null, events: Array|null, hours: Object|null, loading: boolean, error: string|null }} Data loading state.
 */
export function useData() {
  const [stats, setStats] = useState(null)
  const [events, setEvents] = useState(null)
  const [hours, setHours] = useState(null)
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
      fetch('./data/hours.json')
        .then((res) => (res.ok ? res.json() : null))
        .catch(() => null),
    ])
      .then(([statsData, eventsData, hoursData]) => {
        if (isMounted) {
          setStats(statsData)
          setEvents(eventsData)
          setHours(hoursData)
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

  return { stats, events, hours, loading, error }
}
