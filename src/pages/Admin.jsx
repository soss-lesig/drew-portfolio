import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import AffirmationsPanel from "../components/admin/AffirmationsPanel";
import BlogPanel from "../components/admin/BlogPanel";
import QuizPanel from "../components/admin/QuizPanel";

export default function Admin() {
  const [openPanel, setOpenPanel] = useState(null);
  const [deployStatus, setDeployStatus] = useState(null); // null | 'loading' | 'success' | 'error'

  const togglePanel = (panel) => {
    setOpenPanel((prev) => (prev === panel ? null : panel));
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!document.contains(e.target)) return;
      if (!e.target.closest(".admin-accordion")) {
        setOpenPanel(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/studio/login");
  };

  const handleDeploy = async () => {
    setDeployStatus("loading");
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No active session");
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/trigger-deploy`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            apikey: import.meta.env.VITE_SUPABASE_JWT_ANON_KEY,
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) {
        const errBody = await res.json();
        console.error("Deploy error response:", errBody);
        throw new Error(`Deploy failed: ${res.status}`);
      }
      setDeployStatus("success");
      setTimeout(() => setDeployStatus(null), 4000);
    } catch (err) {
      console.error(err);
      setDeployStatus("error");
      setTimeout(() => setDeployStatus(null), 4000);
    }
  };

  return (
    <div className="admin-accordion">
      <div className="admin-header">
        <h1>Admin</h1>
        <div className="admin-header-actions">
          <button
            onClick={handleDeploy}
            className="admin-deploy"
            disabled={deployStatus === "loading"}
          >
            {deployStatus === "loading" && "deploying..."}
            {deployStatus === "success" && "deployed ✓"}
            {deployStatus === "error" && "failed ✗"}
            {deployStatus === null && "deploy"}
          </button>
          <button onClick={handleLogout} className="admin-logout">
            log out
          </button>
        </div>
      </div>

      <div className={`accordion-item${openPanel === "affirmations" ? " is-open" : ""}`}>
        <button onClick={() => togglePanel("affirmations")}>
          Affirmations
          <span className="accordion-chevron">{openPanel === "affirmations" ? "▲" : "▼"}</span>
        </button>
        <div className="accordion-panel">
          <div className="accordion-panel-inner">
            <AffirmationsPanel />
          </div>
        </div>
      </div>

      <div className={`accordion-item${openPanel === "blog" ? " is-open" : ""}`}>
        <button onClick={() => togglePanel("blog")}>
          Blog
          <span className="accordion-chevron">{openPanel === "blog" ? "▲" : "▼"}</span>
        </button>
        <div className="accordion-panel">
          <div className="accordion-panel-inner">
            <BlogPanel />
          </div>
        </div>
      </div>

      <div className={`accordion-item${openPanel === "quiz" ? " is-open" : ""}`}>
        <button onClick={() => togglePanel("quiz")}>
          Quiz
          <span className="accordion-chevron">{openPanel === "quiz" ? "▲" : "▼"}</span>
        </button>
        <div className="accordion-panel">
          <div className="accordion-panel-inner">
            <QuizPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
