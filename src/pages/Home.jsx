import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ProjectCard } from "../components/Card";
import { getPostCount } from "../lib/blog.js";
import { useTheme } from "../hooks/useTheme";

export default function Home() {
  const [postCount, setPostCount] = useState(null);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    getPostCount().then(setPostCount).catch(console.error);
  }, []);

  const projects = [
  {
    projectTitle: "This portfolio site",
    projectDescription:
      "A deliberately engineered portfolio that evolved from vanilla HTML/CSS/JS to modern React as real constraints emerged. Every architectural decision is documented - including the one that produced the component you're looking at right now.",
    projectBullets: [
      "Vanilla foundations migrated to React as genuine pain points justified it",
      "Supabase integration with custom PostgreSQL schema and RLS policies",
      "Client-side markdown blog with custom syntax highlighting theme",
      `Full Git history and ${postCount ?? "…"}-post blog series documenting every decision`,
    ],
    projectLinks: [
      {
        label: "View source",
        href: "https://github.com/soss-lesig/drew-portfolio",
        external: true,
      },
      { label: "Read the blog", href: "/blog", external: false },
    ],
    projectImage: "/images/portfolio-code.png",
  },
  {
    projectTitle: "drewBrew",
    projectDescription:
      "A coffee tracking system designed architecture-first - starting from real user needs and working backwards to data modelling, application structure, and a planned analytics pipeline before writing significant code.",
    projectBullets: [
      "PostgreSQL + Prisma ORM with hybrid relational + JSONB schema",
      "Requirements validated against a competitive barista before any code",
      "Designed analytics pipeline (BeanSights) for brewing pattern insights",
      "Modular Node/TypeScript backend and Next.js frontend planned and documented",
    ],
    projectLinks: [
      { label: "Read the case study", href: "/drewbrew", external: false },
    ],
    projectImage: "/images/bean-model.png",
    backgroundImage: "/images/bean-background.png",
  },
];

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
          <div className="hero-mascot-crossfade">
            <img
              src="/images/meeks.jpg"
              alt="Meeko"
              className="hero-mascot hero-mascot--meeko"
              style={{ opacity: !mounted ? 0 : theme === "dark" ? 0 : 1 }}
            />
            <img
              src="/images/mayu.jpg"
              alt="Mayu"
              className="hero-mascot hero-mascot--mayu"
              style={{ opacity: !mounted ? 0 : theme === "dark" ? 1 : 0 }}
            />
          </div>
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
