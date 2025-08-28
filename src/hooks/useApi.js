import { useEffect, useRef, useState } from 'react'

// Generic API data fetching hook with abort + simple cache by URL
const cache = new Map()

export function useApi(url, { skip = false, transform } = {}) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(!skip)
  const controllerRef = useRef(null)

  useEffect(() => {
    if (skip || !url) return
    if (cache.has(url)) {
      setData(cache.get(url))
      setLoading(false)
      return
    }
    controllerRef.current?.abort()
    const controller = new AbortController()
    controllerRef.current = controller
    setLoading(true)
    setError(null)
    fetch(url, { signal: controller.signal })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(json => {
        const value = transform ? transform(json) : json
        cache.set(url, value)
        setData(value)
      })
      .catch(e => {
        if (e.name === 'AbortError') return
        setError(e)
      })
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [url, skip, transform])

  return { data, error, loading, refetch: () => cache.delete(url) }
}
