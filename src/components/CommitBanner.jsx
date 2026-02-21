import { useState, useEffect } from "react";

export default function CommitBanner() {
  const [commit, setCommit] = useState(null);

  useEffect(() => {
    fetch("https://api.github.com/repos/soss-lesig/drew-portfolio/commits?per_page=1")
      .then((res) => res.json())
      .then((data) => {
        setCommit({
          hash: data[0].sha.slice(0, 7),
          message: data[0].commit.message.split("\n")[0],
        });
      })
      .catch(() => null); // fail silently, banner just won't show
  }, []);

  if (!commit) return null;

  return (
    <a
      href="https://github.com/soss-lesig/drew-portfolio"
      target="_blank"
      rel="noopener noreferrer"
      className="commit-banner"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
      </svg>
      <span className="commit-label">latest commit:</span>
      <span className="commit-hash">{commit.hash}</span>
      <span className="commit-divider">·</span>
      <span className="commit-message">{commit.message}</span>
    </a>
  );
}