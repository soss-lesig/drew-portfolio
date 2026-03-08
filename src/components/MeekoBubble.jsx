import { useEffect, useState } from 'react'
import { useTheme } from '../hooks/useTheme'
import { useAffirmation } from '../hooks/useAffirmation'

const DOT_CYCLES = 2
const DOT_DELAY = 300

export default function MeekoBubble() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [dotText, setDotText] = useState('')
  const [showQuote, setShowQuote] = useState(false)

  const { quote, displayed, fetchAffirmation } = useAffirmation(theme)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Dot animation then trigger fetch
  useEffect(() => {
    let dotIndex = 0
    let cycles = 0

    const dotInterval = setInterval(() => {
      dotIndex++
      if (dotIndex > 3) {
        setDotText('')
        dotIndex = 0
        cycles++
        if (cycles >= DOT_CYCLES) {
          clearInterval(dotInterval)
          setTimeout(() => setShowQuote(true), 400)
        }
      } else {
        setDotText('.'.repeat(dotIndex))
      }
    }, DOT_DELAY)

    return () => clearInterval(dotInterval)
  }, [])

  useEffect(() => {
    if (mounted) fetchAffirmation()
  }, [theme, mounted])

  const text = showQuote ? displayed : dotText

  return (
    <div className="meeko-bubble-wrapper">
      <div className="speech-bubble">
        {quote && <p className="speech-bubble-ghost" aria-hidden="true">"{quote}"</p>}
        {showQuote ? <p>"{text}"</p> : <p>{text}</p>}
      </div>
    </div>
  )
}
