import { useEffect, useState } from "react";
import { useTheme } from "../hooks/useTheme";

const DOT_CYCLES = 2; // how many times ... loops before the quote appears
const DOT_DELAY = 300;
const CHAR_DELAY = 35;


export default function MeekoBubble() {
  const { theme } = useTheme();
  const [quote, setQuote] = useState("");
  const [displayed, setDisplayed] = useState("");
  const [showQuote, setShowQuote] = useState(false);

  useEffect(() => {
    let dotIndex = 0;
    let cycles = 0;

    const dotInterval = setInterval(() => {
      dotIndex++;

      if (dotIndex > 3) {
        setDisplayed("");
        dotIndex = 0;
        cycles++;
        if (cycles >= DOT_CYCLES) {
          clearInterval(dotInterval);
          setTimeout(() => {
            setShowQuote(true);
          }, 400);
        }
      } else {
        setDisplayed(".".repeat(dotIndex));
      }
    }, DOT_DELAY);

    return () => clearInterval(dotInterval);
  }, []);

  useEffect(() => {
    async function fetchAffirmation() {
      const table = theme === "dark" ? "mayu_affirmations" : "meeko_affirmations";

      let data, error;
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/${table}?select=text&active=is.true`,
          {
            headers: {
              "Accept-Profile": "drew_portfolio",
              "apikey": import.meta.env.VITE_SUPABASE_JWT_ANON_KEY,
              "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_JWT_ANON_KEY}`,
            },
          }
        );
        if (!res.ok) throw new Error(`${res.status}`);
        data = await res.json();
      } catch (err) {
        console.error("Failed to fetch affirmation:", err);
        setQuote("meeko tried to say something. the database said no. :(");
        return;
      }

      if (!data?.length) {
        setQuote("...");
        return;
      }

      const random = data[Math.floor(Math.random() * data.length)];
      setQuote(random.text);
    }

    fetchAffirmation();
  }, [theme]);

  useEffect(() => {
    if (!showQuote || !quote) return;
    let i = 0;
    setDisplayed("");

    const interval = setInterval(() => {
      i++;
      setDisplayed(quote.slice(0, i));
      if (i >= quote.length) clearInterval(interval);
    }, CHAR_DELAY);

    return () => clearInterval(interval);
  }, [showQuote, quote]);

  return (
    <div className="meeko-bubble-wrapper">
      <div className="speech-bubble">
        {showQuote ? <p>"{displayed}"</p> : <p>{displayed}</p>}
      </div>
    </div>
  );
}
