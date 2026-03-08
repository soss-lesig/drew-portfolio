import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import useToast from "../../hooks/useToast";
import Toast from "../Toast";

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
  useEffect(() => {
    const fetchMayuAffirmations = async () => {
      const { data, error } = await supabase
        .schema("drew_portfolio")
        .from("mayu_affirmations")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        console.error(error);
      } else {
        setMayuAffirmations(data);
      }
      setMayuLoading(false);
    };

    fetchMayuAffirmations();
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

  // --- Mayu handlers ---
  const toggleMayu = async (id, currentActive) => {
    const { error } = await supabase
      .schema("drew_portfolio")
      .from("mayu_affirmations")
      .update({ active: !currentActive })
      .eq("id", id);

    if (error) {
      console.error(error);
      addToast("Failed to update affirmation", "error");
    } else {
      setMayuAffirmations((prev) =>
        prev.map((a) => (a.id === id ? { ...a, active: !currentActive } : a))
      );
      addToast(
        currentActive ? "Affirmation deactivated" : "Affirmation activated",
        "success"
      );
    }
  };

  const addMayu = async (e) => {
    e.preventDefault();
    if (!mayuNewText.trim()) return;

    const { data, error } = await supabase
      .schema("drew_portfolio")
      .from("mayu_affirmations")
      .insert({ text: mayuNewText.trim() })
      .select();

    if (error) {
      console.error(error);
      addToast("Failed to add affirmation", "error");
    } else {
      setMayuAffirmations((prev) => [...prev, data[0]]);
      setMayuNewText("");
      addToast("Affirmation added", "success");
    }
  };

  const deleteMayu = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this affirmation? This cannot be undone."
    );
    if (!confirmed) return;

    const { error } = await supabase
      .schema("drew_portfolio")
      .from("mayu_affirmations")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      addToast("Failed to delete affirmation", "error");
    } else {
      setMayuAffirmations((prev) => prev.filter((a) => a.id !== id));
      addToast("Affirmation deleted", "success");
    }
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
        <h4>Mayu (dark mode)</h4>
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
