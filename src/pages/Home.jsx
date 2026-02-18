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
      <section className="intro">
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
              to document feature-driven architecture decisions.
            </p>
            <ul>
              <li>Vanilla foundations → React migration (in progress)</li>
              <li>Hash-based routing → React Router</li>
              <li>Markdown blog system with syntax highlighting</li>
              <li>Full Git history documenting every architectural decision</li>
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
              A coffee tracking system designed architecture-first. Demonstrates
              end-to-end thinking from business requirements through data
              modelling to future-state analytics capability.
            </p>
            <ul>
              <li>
                PostgreSQL + Prisma ORM with hybrid relational + JSONB schema
              </li>
              <li>
                Planned modular Node/TypeScript backend and Next.js frontend
              </li>
              <li>Designed analytics pipeline for brewing pattern insights</li>
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
