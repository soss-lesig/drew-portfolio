import { useState, useCallback, useRef } from 'react'

const CHAR_DELAY = 35

/**
 * useAffirmation
 * Fetches a random affirmation from Supabase for the given theme.
 * Returns { quote, displayed, loading, fetchAffirmation }
 * Call fetchAffirmation() to trigger a new fetch on demand.
 *
 * Cancellation: each call gets a closure-scoped `cancelled` flag.
 * If fetchAffirmation is called again before the previous call resolves,
 * the previous call's flag is set to true and its typewriter interval is
 * cleared -- preventing stale state updates and racing typewriters.
 */
export function useAffirmation(theme) {
  const [quote, setQuote] = useState('')
  const [displayed, setDisplayed] = useState('')
  const [loading, setLoading] = useState(false)

  // Holds the active typewriter interval so we can cancel it on the next call
  const typewriterRef = useRef(null)
  // Holds a cancel function for the in-flight async call
  const cancelRef = useRef(null)

  const fetchAffirmation = useCallback(async () => {
    // Cancel any previous in-flight call
    if (cancelRef.current) cancelRef.current()

    // Clear any running typewriter
    if (typewriterRef.current) {
      clearInterval(typewriterRef.current)
      typewriterRef.current = null
    }

    // This call's cancellation flag
    let cancelled = false
    cancelRef.current = () => { cancelled = true }

    setLoading(true)
    setDisplayed('')
    setQuote('')

    const table = theme === 'dark' ? 'mayu_affirmations' : 'meeko_affirmations'

    let data
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/${table}?select=text&active=is.true`,
        {
          headers: {
            'Accept-Profile': 'drew_portfolio',
            'apikey': import.meta.env.VITE_SUPABASE_JWT_ANON_KEY,
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_JWT_ANON_KEY}`,
          },
        }
      )
      if (!res.ok) throw new Error(`${res.status}`)
      data = await res.json()
    } catch (err) {
      if (cancelled) return
      console.error('Failed to fetch affirmation:', err)
      setQuote('the database said no. :(')
      setLoading(false)
      return
    }

    if (cancelled) return

    if (!data?.length) {
      setQuote('...')
      setLoading(false)
      return
    }

    const text = data[Math.floor(Math.random() * data.length)].text
    setQuote(text)
    setLoading(false)

    // Typewriter
    let i = 0
    typewriterRef.current = setInterval(() => {
      if (cancelled) {
        clearInterval(typewriterRef.current)
        typewriterRef.current = null
        return
      }
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(typewriterRef.current)
        typewriterRef.current = null
      }
    }, CHAR_DELAY)
  }, [theme])

  return { quote, displayed, loading, fetchAffirmation }
}
