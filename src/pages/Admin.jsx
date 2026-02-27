import { useState, useEffect } from "react";
import AffirmationsPanel from "../components/admin/AffirmationsPanel";
import BlogPanel from "../components/admin/BlogPanel";
import QuizPanel from "../components/admin/QuizPanel";

export default function Admin() {
  const [openPanel, setOpenPanel] = useState(null);

  const togglePanel = (panel) => {
    setOpenPanel((prev) => (prev === panel ? null : panel));
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".admin-accordion")) {
        setOpenPanel(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="admin-accordion">
      <h1>Admin</h1>

      <div className="accordion-item">
        <button onClick={() => togglePanel("affirmations")}>
          Affirmations {openPanel === "affirmations" ? "▲" : "▼"}
        </button>
        {openPanel === "affirmations" && <AffirmationsPanel />}
      </div>

      <div className="accordion-item">
        <button onClick={() => togglePanel("blog")}>
          Blog {openPanel === "blog" ? "▲" : "▼"}
        </button>
        {openPanel === "blog" && <BlogPanel />}
      </div>

      <div className="accordion-item">
        <button onClick={() => togglePanel("quiz")}>
          Quiz {openPanel === "quiz" ? "▲" : "▼"}
        </button>
        {openPanel === "quiz" && <QuizPanel />}
      </div>
    </div>
  );
}
