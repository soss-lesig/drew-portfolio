import { useState } from "react";

const affirmations = [
  "ship it.",
  "you're doing better than you think.",
  "the code works. that's enough.",
  "progress over perfection.",
  "one commit at a time.",
  "you figured it out before. you'll figure it out again.",
  "it worked on my machine.",
  "have you tried turning it off and on again?",
  "undefined is not a function. but you are.",
  'git commit -m "fixed it (i have no idea why)"',
  "the bug was a feature all along.",
  'console.log("why won\'t you work") is a valid debugging strategy.',
  "99 little bugs in the code...",
  "works in production. don't touch it.",
  "semicolons optional. confidence is not.",
  "meeko has reviewed your code. meeko is unimpressed. ship it anyway.",
  "the rubber duck said you're fine.",
  "nobody knows what they're doing. you're ahead for knowing that.",
  "senior devs google things too. constantly.",
  'your future self will understand the comment "// don\'t ask".',
];

//TODO: swap for supabase fetch when ready

export default function MeekoBubble() {
  const quote = affirmations[Math.floor(Math.random() * affirmations.length)];

  return (
    <div className="meeko-bubble-wrapper">
      <div className="speech-bubble">
        <p>{quote}</p>
      </div>
    </div>
  );
}
