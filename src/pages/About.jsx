import { useState, useEffect } from "react";
import { Link } from "react-router";
import { getPostCount } from "../lib/blog.js";

export default function About() {
  const [postCount, setPostCount] = useState(null);

  useEffect(() => {
    getPostCount().then(setPostCount).catch(console.error);
  }, []);
  return (
    <div className="about-page">
      <header className="page-header">
        <Link to="/" className="back-link">
          ← Back to home
        </Link>
        <h1>
          <em>about me.</em>
        </h1>
      </header>

      <section className="about">
        <p>
          I didn't take the straight line into software. EEE degree first, then
          teacher training, then production code at a large engineering org, and
          out the other side with a clearer idea of what I actually want to
          build and how. The scenic route, but I'd argue it was the right one.
        </p>
        <p>
          That background turns out to be useful. I've had to explain my own
          code to a classroom and realised I didn't understand it as well as I
          thought, survived a live incident at 4pm on a Friday, and refactored
          enough of my own early work to understand why the person who wrote it
          was wrong, even when the person who wrote it was me.
        </p>
        <p>
          I care about code that's readable, maintainable, and doesn't make the
          next person swear. I'm not allergic to complexity, I just want it to
          earn its place. This portfolio is the most honest version of that I
          can give you: built from scratch, with every decision documented, and
          deliberately honest about what I'm still working out, including the
          fact that AI gets me to the answer faster while occasionally making me
          less sure I could find it on my own. Which is a problem worth solving,
          and one I'm actively working on.
        </p>
      </section>

      <section className="skills">
        <h3>Skills</h3>
        <div className="skills-groups">
          <div className="skills-core">
            <h4>Confident with</h4>
            <ul>
              <li>JavaScript and HTML/CSS - the foundations, done properly</li>
              <li>React - hooks, component architecture, state management</li>
              <li>TypeScript - enough to appreciate it, enough to use it</li>
              <li>SQL and relational data modelling (PostgreSQL)</li>
              <li>Node.js and Express for backend work</li>
              <li>Git, PRs, and explaining decisions like a person</li>
              <li>I make a genuinely excellent pour over</li>
            </ul>
          </div>

          <div className="skills-working">
            <h4>Worked with in production</h4>
            <ul>
              <li>Docker and Kubernetes - deployed, not just theorised</li>
              <li>CI/CD pipelines - GitHub Actions, build and deploy flows</li>
              <li>Supabase - auth, RLS policies, real-time queries</li>
              <li>Testing with Jest and Node's built-in test runner</li>
              <li>Agile teams - standups, retros, the full ceremony</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="built-to-learn">
        <h3>Built to learn</h3>
        <p>
          The portfolio itself is the most honest demonstration of how I work.
          Rather than reaching for a template or a boilerplate, I built it from
          scratch - deliberately, in layers. Vanilla JavaScript first to
          understand what React actually solves, then a staged migration once
          the pain points were real rather than theoretical.
        </p>
        <p>
          Along the way that meant building things I could have imported: a
          custom markdown parser and frontmatter system, a client-side router
          before switching to React Router, a reusable hook system for scroll
          animations using IntersectionObserver and RAF-throttled scroll
          tracking, a CSS design token architecture using HSL custom properties
          and fluid typography with <code>clamp()</code>. Each one was a
          deliberate choice to understand the problem before reaching for the
          abstraction.
        </p>
        <p>
          I've also thought carefully about how to work with AI tooling in a way
          that actually builds understanding rather than bypassing it. The
          landscape is changing fast enough that knowing how to learn alongside
          AI - using it for pair programming, technical validation, and targeted
          explanation rather than copy-paste generation - is its own skill. I
          treat every AI-assisted session as a learning opportunity: I write the
          code myself, I understand every decision, and I can explain it without
          the AI in the room. The portfolio documents that process in real time
          across {postCount ?? "…"} blog posts and counting.
        </p>
      </section>

      <section className="experience">
        <h3>Experience</h3>
        <h4>sorted by relevance, time is a flat circle anyway</h4>

        <article className="role">
          <header className="role-header">
            <h4>Graduate Software Engineer</h4>
            <p className="role-meta">Flutter UK &amp; Ireland · 2023–2025</p>
          </header>
          <p>
            Worked in a cross-functional product team on a large React and
            Node.js codebase serving millions of users. Learned very quickly
            that production code and tutorial code are different sports.
          </p>
          <ul>
            <li>
              Built and shipped features across the full stack, working closely
              with product and design from ticket to deployment.
            </li>
            <li>
              Contributed to code reviews, wrote tests, and made the kind of
              incremental improvements that keep software alive long-term.
            </li>
            <li>
              Got hands-on with Docker, Kubernetes, and CI/CD in an environment
              where things actually had to work.
            </li>
          </ul>
        </article>

        <article className="role">
          <header className="role-header">
            <h4>Computer Science Teacher · Supply &amp; Long-Term</h4>
            <p className="role-meta">A-Level &amp; T-Level · 2025–present</p>
          </header>
          <p>
            Teaching programming and systems thinking to people who range from
            genuinely curious to aggressively indifferent. Turns out explaining
            something clearly is a harder test than implementing it.
          </p>
          <ul>
            <li>
              Planned and delivered lessons on HTML, CSS, JavaScript and Python
              across mixed confidence levels.
            </li>
            <li>
              Built structured resources and coursework support aligned to
              specification - which is basically technical writing under
              deadline.
            </li>
            <li>
              Significantly improved my ability to stay calm when things break
              in public. Ask me to fix something in front of 25 students and I'm
              fine. Ask me to type while someone tells me what to write and I'll
              forget the syntax for a for loop.
            </li>
          </ul>
        </article>

        <article className="role">
          <header className="role-header">
            <h4>Computer Science Teacher · ECT &amp; Long-Term</h4>
            <p className="role-meta">KS3 &amp; KS4 · 2022–2023</p>
          </header>
          <p>
            Designed and delivered KS3-KS4 Computer Science curriculum as an
            Early Career Teacher. Planned and delivered lessons across a full
            secondary CS curriculum, built resources and schemes of work from
            scratch, and developed the ability to explain the same concept six
            different ways until one of them lands -- which turns out to be
            useful in code review too.
          </p>
          <ul>
            <li>
              Discovered that writing a mark scheme and writing a test suite
              require suspiciously similar thinking.
            </li>
            <li>
              Developed a forensic ability to identify exactly which line of
              code a student had changed to break everything, without touching
              the keyboard.
            </li>
            <li>
              Got very good at rubber duck debugging, except the rubber duck had
              opinions and hadn't done the homework.
            </li>
          </ul>
        </article>
      </section>
    </div>
  );
}
