import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import useToast from "../../hooks/useToast";
import Toast from "../Toast";

// TODO: remove placeholder once mayu_affirmations table is created in Supabase
const MAYU_AFFIRMATIONS_PLACEHOLDER = [
  { id: "p1", text: "the void is comfortable once you stop fighting it", active: true },
  { id: "p2", text: "precision over enthusiasm. always.", active: true },
  { id: "p3", text: "rest is not failure. it is load management.", active: true },
  { id: "p4", text: "a well-placed semicolon changes everything", active: true },
  { id: "p5", text: "you shipped it. that's already more than most.", active: true },
];

export default function AffirmationsPanel() {
  // Meeko state
  const [meekoAffirmations, setMeekoAffirmations] = useState([]);
  const [meekoLoading, setMeekoLoading] = useState(true);
  const [meekoNewText, setMeekoNewText] = useState("");

  // Mayu state
  const [mayuAffirmations, setMayuAffirmations] = useState([]);
  const [mayuLoading, setMayuLoading] = useState(true);
  const [mayuNewText, setMayuNewText] = useState("");

  const { toasts, addToast } = useToast();

  // --- Meeko fetching ---
  useEffect(() => {
    const fetchMeekoAffirmations = async () => {
      const { data, error } = await supabase
        .schema("drew_portfolio")
        .from("meeko_affirmations")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        console.error(error);
      } else {
        setMeekoAffirmations(data);
      }
      setMeekoLoading(false);
    };

    fetchMeekoAffirmations();
  }, []);

  // --- Mayu fetching ---
  // TODO: swap to Supabase fetch once mayu_affirmations table is created
  useEffect(() => {
    setMayuAffirmations(MAYU_AFFIRMATIONS_PLACEHOLDER);
    setMayuLoading(false);
  }, []);

  // --- Meeko handlers ---
  const toggleMeeko = async (id, currentActive) => {
    const { error } = await supabase
      .schema("drew_portfolio")
      .from("meeko_affirmations")
      .update({ active: !currentActive })
      .eq("id", id);

    if (error) {
      console.error(error);
      addToast("Failed to update affirmation", "error");
    } else {
      setMeekoAffirmations((prev) =>
        prev.map((a) => (a.id === id ? { ...a, active: !currentActive } : a))
      );
      addToast(
        currentActive ? "Affirmation deactivated" : "Affirmation activated",
        "success"
      );
    }
  };

  const addMeeko = async (e) => {
    e.preventDefault();
    if (!meekoNewText.trim()) return;

    const { data, error } = await supabase
      .schema("drew_portfolio")
      .from("meeko_affirmations")
      .insert({ text: meekoNewText.trim() })
      .select();

    if (error) {
      console.error(error);
      addToast("Failed to add affirmation", "error");
    } else {
      setMeekoAffirmations((prev) => [...prev, data[0]]);
      setMeekoNewText("");
      addToast("Affirmation added", "success");
    }
  };

  const deleteMeeko = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this affirmation? This cannot be undone."
    );
    if (!confirmed) return;

    const { error } = await supabase
      .schema("drew_portfolio")
      .from("meeko_affirmations")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      addToast("Failed to delete affirmation", "error");
    } else {
      setMeekoAffirmations((prev) => prev.filter((a) => a.id !== id));
      addToast("Affirmation deleted", "success");
    }
  };

  // --- Mayu handlers (placeholder - no real DB ops yet) ---
  // TODO: wire these up to Supabase once mayu_affirmations table is created
  const toggleMayu = (id, currentActive) => {
    setMayuAffirmations((prev) =>
      prev.map((a) => (a.id === id ? { ...a, active: !currentActive } : a))
    );
    addToast(
      currentActive ? "Affirmation deactivated" : "Affirmation activated",
      "success"
    );
  };

  const addMayu = (e) => {
    e.preventDefault();
    if (!mayuNewText.trim()) return;
    const newEntry = { id: `p${Date.now()}`, text: mayuNewText.trim(), active: true };
    setMayuAffirmations((prev) => [...prev, newEntry]);
    setMayuNewText("");
    addToast("Affirmation added (placeholder only)", "success");
  };

  const deleteMayu = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this affirmation? This cannot be undone."
    );
    if (!confirmed) return;
    setMayuAffirmations((prev) => prev.filter((a) => a.id !== id));
    addToast("Affirmation deleted (placeholder only)", "success");
  };

  const renderList = (items, onToggle, onDelete) => (
    <ul>
      {items.map((a) => (
        <li key={a.id}>
          <span>{a.text}</span>
          <div className="affirmation-actions">
            <button
              className={a.active ? "toggle-active" : "toggle-inactive"}
              onClick={() => onToggle(a.id, a.active)}
            >
              {a.active ? "Active" : "Inactive"}
            </button>
            <button
              className="btn-delete"
              onClick={() => onDelete(a.id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="affirmations-panel">
      <Toast toasts={toasts} />

      <div className="affirmations-section">
        <h4>Meeko (light mode)</h4>
        {meekoLoading ? <p>Loading...</p> : renderList(meekoAffirmations, toggleMeeko, deleteMeeko)}
        <form onSubmit={addMeeko}>
          <input
            type="text"
            value={meekoNewText}
            onChange={(e) => setMeekoNewText(e.target.value)}
            placeholder="New Meeko affirmation..."
          />
          <button type="submit">Add</button>
        </form>
      </div>

      <div className="affirmations-section">
        <h4>Mayu (dark mode) <span className="placeholder-badge">placeholder data</span></h4>
        {mayuLoading ? <p>Loading...</p> : renderList(mayuAffirmations, toggleMayu, deleteMayu)}
        <form onSubmit={addMayu}>
          <input
            type="text"
            value={mayuNewText}
            onChange={(e) => setMayuNewText(e.target.value)}
            placeholder="New Mayu affirmation..."
          />
          <button type="submit">Add</button>
        </form>
      </div>
    </div>
  );
}
