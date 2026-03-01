import { Link } from "react-router-dom";
import Card from "./Card";
import styles from "./ProjectCard.module.css";
import useScrollReveal from "../../hooks/useScrollReveal.js";
import useScrollTilt from "../../hooks/useScrollTilt.js";

export default function ProjectCard({
  projectTitle,
  projectDescription,
  projectBullets = [],
  projectLinks = [],
  projectImage,
  imagePosition = "right",
}) {
  const revealRef = useScrollReveal();
  const tiltRef = useScrollTilt();

  // Merge both refs onto the same element
  const ref = (el) => {
    revealRef.current = el;
    tiltRef.current = el;
  };

  return (
    <Card as="article" className={styles.projectCard} ref={ref}>
      <div
        className={`${styles.projectLayout} ${imagePosition === "left" ? styles.imageLeft : ""}`}
      >
        {projectImage && (
          <div className={styles.projectImage}>
            <img src={projectImage} alt={`${projectTitle} preview`} />
          </div>
        )}
        <div className={styles.projectContent}>
          <h4>{projectTitle}</h4>
          <p>{projectDescription}</p>
          {projectBullets.length > 0 && (
            <ul>
              {projectBullets.map((bullet, i) => (
                <li key={i}>{bullet}</li>
              ))}
            </ul>
          )}
          {projectLinks.length > 0 && (
            <div className={styles.projectLinks}>
              {projectLinks.map((link, i) =>
                link.external ? (
                  <a
                    key={i}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link key={i} to={link.href}>
                    {link.label}
                  </Link>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
