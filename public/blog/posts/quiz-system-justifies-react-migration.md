---
title: Building an interactive quiz system (and why it forced my hand on React)
subtitle: When a feature requirement drives architectural evolution across the entire stack
date: 2025-02-14
slug: quiz-system-justifies-react-migration
tags:
  - react
  - supabase
  - architecture
  - teaching
  - feature-driven-design
---

I've been building this portfolio deliberately: starting with vanilla JavaScript, documenting pain points, and only introducing tooling when those pain points become unbearable.

I've been thinking about adding further functionality to the blog in the form of quizzes that summarise the content of each post. This quiz system is the feature that tips the balance. Not because vanilla JavaScript can't do it, but because building it properly in vanilla would mean recreating React badly.

This post documents why the quiz feature matters, where vanilla breaks down, why Supabase solves the backend problem, and why React finally becomes the sensible choice.

---

## The concept: quizzes that actually matter

**The vision:** Interactive quizzes embedded in blog posts. Readers answer questions as they go, get immediate feedback, and track their understanding in real-time.

**The teaching connection:** I'm already creating quiz content for A-Level  and T-Level Computer Science students. Why build it twice? Turn the blog into a platform that serves both portfolio audiences and teaching work.

**Initial scope:**
- Inline quizzes within markdown blog posts
- Immediate feedback on answers
- Progress tracking across questions
- Eventually: persistent scores, leaderboards, analytics

Simple concept. Complex implementation.

---

## Why vanilla JavaScript breaks down

The problems emerge fast when you think through the requirements properly.
### 1. State management becomes a nightmare

**The state you need to track:**
- Quiz progress across multiple questions
- User answers for each question
- Score calculations that span blog posts
- Navigation state (which question you're on)
- Form state (selected answers, validation)
- Loading states (fetching data, submitting answers)

**In vanilla JavaScript:**
```javascript
// Global state object? Gross.
const quizState = {
  currentQuestion: 0,
  answers: {},
  score: 0,
  isSubmitting: false
};

// Manual state updates everywhere
function selectAnswer(questionId, answerId) {
  quizState.answers[questionId] = answerId;
  updateUI(); // Have to remember to call this
}

function nextQuestion() {
  quizState.currentQuestion++;
  updateUI(); // And here too
}

// Every function needs manual UI sync
function updateUI() {
  // Manually update every element that depends on state
  // Miss one? Stale data in the UI.
}
```

**The problems:**
- State updates don't trigger UI updates automatically
- You have to remember to call `updateUI()` everywhere
- State becomes scattered across functions
- Debugging is a nightmare (who changed what when?)
- Component coordination requires manual event passing

**This is exactly what React's state management solves.** Components re-render when state changes. Hooks manage lifecycle. Context shares state without prop drilling.

### 2. Component reusability is impossible

**Components you need:**
- Quiz question card
- Answer option buttons
- Feedback display (correct/incorrect)
- Progress indicator
- Score display
- Navigation controls
- Loading spinner
- Error boundary

**In vanilla JavaScript:**

```javascript
// Option 1: Template literals (repetitive, brittle)
function renderQuestion(question) {
  return `
    <div class="question">
      <h3>${question.text}</h3>
      <div class="answers">
        ${question.answers.map(a => `
          <button onclick="selectAnswer('${a.id}')">
            ${a.text}
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

// Option 2: Manual DOM manipulation (verbose, error-prone)
function createQuestion(question) {
  const container = document.createElement('div');
  container.className = 'question';
  
  const title = document.createElement('h3');
  title.textContent = question.text;
  container.appendChild(title);
  
  const answersDiv = document.createElement('div');
  answersDiv.className = 'answers';
  
  question.answers.forEach(answer => {
    const button = document.createElement('button');
    button.textContent = answer.text;
    button.addEventListener('click', () => selectAnswer(answer.id));
    answersDiv.appendChild(button);
  });
  
  container.appendChild(answersDiv);
  return container;
}

// Either way: no component lifecycle, no hooks, no reusable logic
```

**The problems:**
- Every quiz needs the same UI patterns rebuilt
- No way to encapsulate behaviour with markup
- Logic and presentation are tangled
- Testing individual pieces is nearly impossible
- Code duplication everywhere

**React components solve this:**
```jsx
// Single, reusable component
function QuizQuestion({ question, onAnswer }) {
  return (
    <div className="question">
      <h3>{question.text}</h3>
      <div className="answers">
        {question.answers.map(answer => (
          <button 
            key={answer.id}
            onClick={() => onAnswer(answer.id)}
          >
            {answer.text}
          </button>
        ))}
      </div>
    </div>
  );
}

// Used consistently everywhere. Tested once. Works everywhere.
```

### 3. Data persistence is non-negotiable

**What localStorage can't do:**
- Cross-device progress (you start on phone, finish on laptop)
- Leaderboards (shared state across users)
- Analytics (which questions students struggle with)
- Real-time updates (see other users' scores live)
- Proper querying (give me all quiz attempts from the last week)

**What localStorage can do:**
- Store small amounts of data on one device
- Get cleared when the user deletes browser data
- Not much else

**You need a real database.** Not a workaround. Not a hack. An actual backend.

### 4. The router limitations become critical

**Current hash-based routing issues:**
- SEO is terrible (search engines don't index hash routes well)
- Link previews don't work (social media can't preview `#/blog/post`)
- Deep linking is fragile (sharing `#/quiz/question-3` is unreliable)
- Navigation state is clumsy (back button behaviour is inconsistent)

**Now add quiz state:**
- Need to preserve quiz progress across navigation
- URL should reflect current question
- Shareable quiz results require proper URLs
- Browser history should work intuitively

**Hash routing was acceptable for simple blog navigation. For an interactive quiz app, it's not enough.**

---

## Enter Supabase: the backend you need

The quiz system requires backend capabilities. Full stop.

**What you need:**
- **Persistent user progress** - localStorage isn't enough for multi-session learning
- **Leaderboards** - shared state across users requires a database
- **Analytics** - track completion rates, identify difficult questions
- **Authentication** - attribute quiz attempts to specific users

**The choices:**

**Option A: Build your own backend**
- Node.js + Express
- PostgreSQL database (self-hosted or managed)
- Authentication system (OAuth, JWT, session management)
- Real-time WebSocket infrastructure
- Deployment and scaling

**Option B: Use Supabase**
- PostgreSQL-backed (real relational data)
- Built-in authentication (email, OAuth, magic links)
- Real-time subscriptions (live leaderboard updates)
- Row-level security (proper access control)
- GraphQL support (if needed later)
- Generous free tier

**This is pragmatic backend-as-a-service, not laziness.**

With my front-end engineer hat on: I'm building a teaching tool. The value is in the quiz design, the user experience, and the educational content. Not in maintaining PostgreSQL servers or writing OAuth flows.

**What I'm not doing:**
- Building infrastructure you don't need
- Managing database migrations manually
- Writing authentication from scratch
- Setting up WebSocket servers
- Configuring SSL certificates

**What I am doing:**
- Focusing on the feature that matters
- Using production-grade tools appropriately
- Building something that can scale if needed
- Demonstrating technical judgment over 'not invented here' syndrome

This is how modern engineering works. You pick the right tools for the job, not the impressive ones.

---

## Why React finally makes sense

The quiz feature doesn't just make React convenient. It makes React the obvious choice.
### Component architecture becomes essential

**You need:**
- `<QuizContainer />` - manages overall quiz state
- `<QuestionCard />` - displays individual questions
- `<AnswerOption />` - individual answer buttons
- `<FeedbackDisplay />` - shows correct/incorrect feedback
- `<ProgressBar />` - tracks completion
- `<ScoreCard />` - displays current score
- `<Leaderboard />` - shows top scores
- `<LoadingSpinner />` - handles async states

**In vanilla JavaScript:** You'd be rebuilding React's component model badly.

**In React:** This is exactly what it's designed for.

### State synchronisation requires reactivity

**The data flow:**
1. User selects an answer
2. State updates in `<QuizContainer />`
3. `<FeedbackDisplay />` shows result
4. `<ProgressBar />` updates
5. `<ScoreCard />` recalculates
6. Supabase receives submission
7. `<Leaderboard />` updates if high score

**In vanilla JavaScript:** Manual state updates, manual UI synchronisation, manual error handling everywhere.

**In React:** State changes trigger component re-renders automatically. The UI is always in sync.

### Developer experience matters

**Vanilla pain points:**
- No hot module replacement (refresh to see changes)
- No component DevTools (debugging is console.log hell)
- No established patterns (every decision is from scratch)
- No TypeScript integration (adding types is painful)

**React benefits:**
- Vite provides instant HMR
- React DevTools show component state live
- Established patterns for data fetching, error handling, forms
- TypeScript works seamlessly with JSX

**This isn't about comfort. It's about velocity.** The faster you can iterate, the better the final product.

### The router problem gets solved properly

**React Router provides:**
- Proper URL routing (no more hash-based hacks)
- Better SEO (server-side rendering possible later)
- Shareable URLs that work reliably
- Navigation state management
- Nested routes (blog posts with embedded quizzes)

**Migration path:**
```javascript
// Old: Hash-based vanilla routing
window.location.hash = '#/blog/post-1';

// New: React Router
<Route path="/blog/:slug" element={<BlogPost />} />
```

Same mental model. Better implementation. Natural evolution.

---

## The migration strategy: refactor, not rewrite

**Not starting from scratch. Refactoring intentionally.**

### Phase 1: React migration (feature parity first)

**On a feature branch:**
1. Set up Vite + React
2. Convert static HTML to React components
3. Migrate router from hash-based to React Router
4. Port existing blog system to React
5. Deploy preview on separate subdomain
6. Switch when feature parity is reached

**What stays the same:**
- Design tokens (CSS variables work everywhere)
- Blog content (markdown files remain markdown)
- Core styling (most CSS ports directly)
- Project structure concepts

**What changes:**
- `.html` → `.jsx` components
- Hash routing → React Router
- Manual DOM manipulation → React state
- Inline `<script>` → proper module bundling

**What gets added:**
- Vite for build tooling
- Component architecture
- Proper state management
- TypeScript (selectively, where it adds value)

### Phase 2: Supabase integration (once React is stable)

1. Set up Supabase project
2. Define database schema (users, quizzes, attempts, scores)
3. Implement authentication UI
4. Build quiz submission flow
5. Add leaderboard feature
6. Implement analytics dashboard

**This happens after React is working.** Don't change everything at once.

### Phase 3: Blog migration to database (future enhancement)

Once quizzes are in Supabase, blog posts can move there too.

**Why move blog posts to the database:**
- Quizzes are already linked to specific posts
- Content management becomes easier (edit in a CMS, not markdown files)
- Rich metadata (view counts, reading time, related posts)
- Search functionality (PostgreSQL full-text search)

**But this isn't part of the React migration.** First things first.

---

## The honest trade-offs

### What I'm gaining

**Technical:**
- Proper component architecture
- Legitimate state management
- Real backend capabilities
- Better developer experience
- Foundation for future features

**Professional:**
- Demonstrates full-stack thinking
- Shows pragmatic tool selection
- Proves migration skills over rewrite habits
- Validates AI-assisted development workflow

**Educational:**
- Quiz system serves dual purposes (portfolio + teaching)
- Content becomes interactive, not just informational
- Analytics provide genuine teaching insights

### What I'm losing

**Technical simplicity:**
- Zero-dependency vanilla approach
- View source = read actual source
- Instant load times (build step adds overhead)
- Beginner-friendly codebase

**But the vanilla approach served its purpose.** It taught fundamentals, documented pain points, and proved frameworks solve real problems.

**The portfolio narrative is complete:**
1. Started vanilla to understand fundamentals
2. Hit real constraints that frameworks solve
3. Chose tools based on actual pain points, not trends
4. Documented the entire journey

**This is engineering judgment, not framework chasing.**

---

## The meta-lesson: feature-driven architecture

**Bad reason to adopt React:** "Everyone uses React, so I should too."

**Good reason to adopt React:** "I'm building an interactive quiz system with complex state management, and React solves those problems properly."

**The quiz feature is the catalyst.** Without it, vanilla JavaScript was fine. With it, I'm either building a terrible version of React or just using React.

**This validates the original approach:**
- Frameworks aren't inherently better
- They solve specific problems
-  Understanding problems before reaching for solutions
- Evolving architecture is better than premature optimisation

---

## AI-assisted development in practice

## AI-assisted development in practice

This entire architectural analysis was done collaboratively with Claude—but not in the way you might assume.

**The actual process:**

I initially suggested using Supabase early in the project. Claude pushed back: "Do you actually need a database right now? Your blog is just markdown files. Don't over-engineer."

Fair point. The vanilla approach was working fine for static content.

Then the quiz requirements emerged. Suddenly I needed:

- Persistent user data across devices
- Leaderboards with shared state
- Analytics tracking
- Real-time updates

I revisited the Supabase suggestion. This time, Claude agreed: "Yeah, now it makes sense. Here's why..."

**What AI provided:**

- Challenged premature optimisation ("You don't need that yet")
- Validated decisions when scope changed ("Now you do need that")
- Explained trade-offs between approaches
- Identified specific pain points in vanilla implementation
- Explained React patterns for quiz architecture

**What I provided:**

- Original Supabase suggestion (before it was justified)
- Defined the feature requirements that changed the calculus
- Made final architectural decisions
- Pushed back when AI suggested over-engineering
- Chose migration strategy over rewrite
- Decided what ships when

**This mirrors real team collaboration.** A senior engineer might say "not yet" to a junior's suggestion, but when requirements change, that same suggestion becomes the right call. Good collaboration means revisiting decisions as context evolves.

**As AI becomes standard in engineering, this workflow isn't exceptional. It's professional.** The AI isn't always right. Neither am I. But the back-and-forth produces better decisions than either of us would make alone.

---

## What's next

**Immediate priorities:**
1. Create React migration branch
2. Set up Vite + React environment
3. Convert portfolio HTML to React components
4. Implement React Router
5. Port blog system
6. Reach feature parity with vanilla version

**Then:**
7. Design quiz component architecture
8. Set up Supabase project
9. Implement authentication
10. Build first quiz

**Each step documented. Each decision justified.**

The quiz system forced the migration. The migration enables the quiz system. The entire evolution demonstrates thoughtful engineering.

This isn't just building features. It's building a case study in feature-driven architecture.

---

## Reflections

A month ago, this project was static HTML and CSS. Now it's evolving toward a full-stack React application with database-backed interactive features.

**The progression feels natural because it is natural.**

Every tool was introduced for a reason. Every refactor solved a real problem. Every decision was documented and justified.

**The quiz system isn't a gimmick.** It's a legitimate teaching tool that happens to validate every architectural choice made so far.

When hiring managers ask "Why did you choose React?", the answer isn't "because everyone uses it." It's "because I built a feature that required component architecture, state management, and proper routing, and React solves those problems well."

**That's the difference between showing technical skills and demonstrating technical judgment.**
