import { Link } from "react-router-dom";
import { ProjectCard } from "../components/Card";

const projects = [
  {
    projectTitle: "This portfolio site",
    projectDescription:
      "A deliberately engineered portfolio that evolved from vanilla HTML/CSS/JS to modern tooling as real constraints emerged. Built to document feature-driven architectural decisions.",
    projectBullets: [
      "Vanilla HTML/CSS/JS foundations, migrated to React as real pain points emerged",
      "React Router replacing custom hash-based routing",
      "Client-side markdown blog system with custom syntax highlighting",
      "Full Git history and blog series documenting every architectural decision",
    ],
    projectLinks: [
      {
        label: "View source",
        href: "https://github.com/soss-lesig/drew-portfolio",
        external: true,
      },
      { label: "Read the blog", href: "/blog", external: false },
    ],
    projectImage: "/images/meeks.jpg",
  },
  {
    projectTitle: "drewBrew",
    projectDescription:
      "A coffee tracking system designed architecture-first - starting from validated business requirements and working backwards to data modelling, application structure, and a planned analytics pipeline.",
    projectBullets: [
      "PostgreSQL + Prisma ORM with hybrid relational + JSONB schema",
      "Architecture validated against real user needs with a competitive barista",
      "Designed analytics pipeline (BeanSights) for brewing pattern insights",
      "Modular Node/TypeScript backend and Next.js frontend planned and documented",
    ],
    projectLinks: [
      { label: "Read the case study", href: "/drewbrew", external: false },
    ],
    projectImage: "/images/meeks.jpg",
  },
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-text">
          <h1>
            I'm <em>drewbs.</em>
          </h1>
          <p className="hero-tagline">
            Full stack engineer. Building things that work, and documenting why.
          </p>
          <p className="hero-sub">
            JavaScript, React, pragmatic decisions. Currently seeking junior
            and associate engineering roles.
          </p>
          <div className="hero-cta">
            <Link to="/blog" className="cta-primary">
              Read the blog
            </Link>
            <Link to="/about" className="cta-secondary">
              About me →
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <img src="/images/meeks.jpg" alt="Meeko the site mascot" />
        </div>
      </section>

      <section className="projects">
        <h3>Projects</h3>
        <p>
          Side projects are where I experiment, over-engineer slightly, then
          simplify again.
        </p>

        <div className="project-grid">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.projectTitle}
              {...project}
              imagePosition={i % 2 === 0 ? "right" : "left"}
            />
          ))}
        </div>
      </section>
    </>
  );
}
