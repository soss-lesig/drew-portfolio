import { useState, useCallback } from 'react'

const CHAR_DELAY = 35

/**
 * useAffirmation
 * Fetches a random affirmation from Supabase for the given theme.
 * Returns { text, typewriterText, loading, fetch: triggerFetch }
 * Call fetch() to trigger a new fetch on demand.
 */
export function useAffirmation(theme) {
  const [quote, setQuote] = useState('')
  const [displayed, setDisplayed] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchAffirmation = useCallback(async () => {
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
      console.error('Failed to fetch affirmation:', err)
      setQuote('the database said no. :(')
      setLoading(false)
      return
    }

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
    const interval = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) clearInterval(interval)
    }, CHAR_DELAY)
  }, [theme])

  return { quote, displayed, loading, fetchAffirmation }
}
