import { Link } from "react-router-dom";
import { getAllPosts } from "../data/posts.js";

export default function About() {
  const postCount = getAllPosts().length;
  return (
    <div className="about-page">
      <header className="page-header">
        <Link to="/" className="back-link">
          ← Back to home
        </Link>
        <h1>About me</h1>
      </header>

      <section className="about">
        <p>
          I didn't take the straight line into software. I took the scenic
          route - picked up a degree, ended up teaching A-Level Computer
          Science, shipped production code at a large engineering org, and
          somehow came out the other side with a clearer idea of what I actually
          want to build and how I want to build it.
        </p>
        <p>
          That background turns out to be useful. I've explained recursion to
          a seventeen-year-old who definitely wasn't listening, debugged a
          live incident at 4pm on a Friday, and sat in enough architecture
          meetings to know the difference between a good trade-off and someone
          just vibing with microservices.
        </p>
        <p>
          I care about code that's readable, maintainable, and doesn't make the
          next person swear. I'm not allergic to complexity - I just want it to
          earn its place.
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
          I've also thought carefully about how to work with AI tooling in a
          way that actually builds understanding rather than bypassing it. The
          landscape is changing fast enough that knowing how to learn alongside
          AI - using it for pair programming, technical validation, and targeted
          explanation rather than copy-paste generation - is its own skill. I
          treat every AI-assisted session as a learning opportunity: I write the
          code myself, I understand every decision, and I can explain it without
          the AI in the room. The portfolio documents that process in real time
          across {postCount} blog posts and counting.
        </p>
      </section>

      <section className="experience">
        <h3>Experience</h3>

        <article className="role">
          <header className="role-header">
            <h4>Graduate Software Engineer</h4>
            <p className="role-meta">Flutter UK &amp; Ireland · 2022–2024</p>
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
            <p className="role-meta">A-Level &amp; T-Level · 2024–present</p>
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
              Significantly improved my ability to debug under pressure, because
              a Year 12 class is effectively a live incident with 25 concurrent
              users.
            </li>
          </ul>
        </article>
      </section>
    </div>
  );
}
