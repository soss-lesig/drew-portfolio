import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-text">
          <h1>I'm drewbs.</h1>
          <p>
            Full stack software engineer.
            <br />
            Contract teacher.
            <br />
            Pour-over enthusiast.
          </p>
        </div>
        <div className="hero-image">
          <img src="/images/meeks.jpg" alt="Meeks the site mascot" />
        </div>
      </section>
      <section className="intro-text">
        <p>
          Building web applications with JavaScript, React, and pragmatic
          technical decisions.
        </p>
        <p>
          Currently interested in clean interfaces, thoughtful systems, and
          making software that doesn't shout at the user.
        </p>
      </section>

      <section className="projects">
        <h3>Projects</h3>
        <p>
          Side projects are where I experiment, over-engineer slightly, then
          simplify again.
        </p>

        <div className="project-grid">
          <article className="project-card">
            <h4>This portfolio site</h4>
            <p>
              A deliberately engineered portfolio that evolved from vanilla
              HTML/CSS/JS to modern tooling as real constraints emerged. Built
              to document feature-driven architectural decisions.
            </p>
            <ul>
              <li>Vanilla HTML/CSS/JS foundations, migrated to React as real pain points emerged</li>
              <li>React Router replacing custom hash-based routing</li>
              <li>Client-side markdown blog system with custom syntax highlighting</li>
              <li>Full Git history and blog series documenting every architectural decision</li>
            </ul>
            <p className="project-links">
              <a href="https://github.com/soss-lesig/drew-portfolio">
                View source
              </a>
              <Link to="/blog">Read the blog</Link>
            </p>
          </article>
          <article className="project-card">
            <h4>drewBrew</h4>
            <p>
              A coffee tracking system designed architecture-first - starting
              from validated business requirements and working backwards to data
              modelling, application structure, and a planned analytics pipeline.
            </p>
            <ul>
              <li>PostgreSQL + Prisma ORM with hybrid relational + JSONB schema</li>
              <li>Architecture validated against real user needs with a competitive barista</li>
              <li>Designed analytics pipeline (BeanSights) for brewing pattern insights</li>
              <li>Modular Node/TypeScript backend and Next.js frontend planned and documented</li>
            </ul>
            <p className="project-links">
              <Link to="/drewbrew">Read the case study</Link>
            </p>
          </article>
        </div>
      </section>
    </>
  );
}
