import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const DOT_CYCLES = 2; // how many times ... loops before the quote appears
const DOT_DELAY = 300;
const CHAR_DELAY = 35;

export default function MeekoBubble() {
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
    const {data, error} = await supabase
    .schema("drew_portfolio")
    .from("meeko_affirmations")
    .select("text")
    .eq("active", true);

    if (error) {
      console.error("Failed to fetch affirmation:", error);
      setQuote("meeko tried to say something. the database said no. :(");
    }

    const random = data[Math.floor(Math.random() * data.length)];
    setQuote(random.text);
  }

  fetchAffirmation();
}, []);

  useEffect(() => {
    if (!showQuote || !quote) return;
    let i = 0;

    const interval = setInterval(() => {
      i++;
      setDisplayed(quote.slice(0, i));
      if (i >= quote.length) clearInterval(interval);
    }, CHAR_DELAY);

    return () => clearInterval(interval);
  }, [showQuote]);

  return (
    <div className="meeko-bubble-wrapper">
      <div className="speech-bubble">
        {showQuote ? <p>"{displayed}"</p> : <p>{displayed}</p>}
      </div>
    </div>
  );
}
