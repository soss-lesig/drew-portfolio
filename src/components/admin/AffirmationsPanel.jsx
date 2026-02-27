import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import useToast from "../../hooks/useToast";
import Toast from "../Toast";

export default function AffirmationsPanel() {
  const [affirmations, setAffirmations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newText, setNewText] = useState("");
  const { toasts, addToast } = useToast();

  useEffect(() => {
    const fetchAffirmations = async () => {
      const { data, error } = await supabase
        .schema("drew_portfolio")
        .from("meeko_affirmations")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        console.error(error);
      } else {
        setAffirmations(data);
      }
      setLoading(false);
    };

    fetchAffirmations();
  }, []);

  const toggleActive = async (id, currentActive) => {
    const { error } = await supabase
      .schema("drew_portfolio")
      .from("meeko_affirmations")
      .update({ active: !currentActive })
      .eq("id", id);

    if (error) {
      console.error(error);
      addToast("Failed to update affirmation", "error");
    } else {
      setAffirmations((prev) =>
        prev.map((a) => (a.id === id ? { ...a, active: !currentActive } : a))
      );
      addToast(
        currentActive ? "Affirmation deactivated" : "Affirmation activated",
        "success"
      );
    }
  };

  const addAffirmation = async (e) => {
    e.preventDefault();
    if (!newText.trim()) return;

    const { data, error } = await supabase
      .schema("drew_portfolio")
      .from("meeko_affirmations")
      .insert({ text: newText.trim() })
      .select();

    if (error) {
      console.error(error);
      addToast("Failed to add affirmation", "error");
    } else {
      setAffirmations((prev) => [...prev, data[0]]);
      setNewText("");
      addToast("Affirmation added", "success");
    }
  };

  const deleteAffirmation = async (id) => {
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
      setAffirmations((prev) => prev.filter((a) => a.id !== id));
      addToast("Affirmation deleted", "success");
    }
  };

  return (
    <div className="affirmations-panel">
      <Toast toasts={toasts} />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {affirmations.map((a) => (
            <li key={a.id}>
              <span>{a.text}</span>
              <button onClick={() => toggleActive(a.id, a.active)}>
                {a.active ? "Deactivate" : "Activate"}
              </button>
              <button onClick={() => deleteAffirmation(a.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={addAffirmation}>
        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="New affirmation..."
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}
