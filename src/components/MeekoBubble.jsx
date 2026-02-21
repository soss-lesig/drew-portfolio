import { useEffect, useState } from "react";

const affirmations = [
  // genuine
  "you're more capable than you give yourself credit for.",
  "every expert was once a beginner.",
  "the fact you care this much means you're already good.",
  "slow progress is still progress.",
  "you've solved hard problems before. you'll solve this one.",
  "being curious is a superpower.",
  "it's okay not to know. it's not okay not to try.",
  "rest is part of the process.",
  "you don't have to figure it all out today.",
  "asking for help is a skill, not a weakness.",
  // dev humour
  "meeko has reviewed your code. meeko is unimpressed. ship it anyway.",
  "it worked on my machine.",
  "undefined is not a function. but you are.",
  'git commit -m "fixed it (no idea why)"',
  "works in production. don't touch it.",
  "the bug was a feature all along.",
  "have you tried turning it off and on again?",
  "the rubber duck said you're fine.",
  "99 little bugs in the code...",
  "to understand recursion, see: recursion.",
];
//TODO: swap for supabase fetch when ready

const DOT_CYCLES = 3; // how many times ... loops before the quote appears
const DOT_DELAY = 300;
const CHAR_DELAY = 35;

export default function MeekoBubble() {
  const quote = affirmations[Math.floor(Math.random() * affirmations.length)];
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
    if (!showQuote) return;
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
