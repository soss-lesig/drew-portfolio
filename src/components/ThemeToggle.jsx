import { useTheme } from "../hooks/useTheme";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      className="theme-toggle"
      onClick={toggle}
      aria-label={
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      }
    >
      <div className="portrait-wrapper theme-toggle-portrait">
        <img
          src={theme === "dark" ? "/images/mayu.jpg" : "/images/meeks.jpg"}
          alt={theme === "dark" ? "Mayu" : "Meeko"}
          className="portrait-img"
        />
        <span className="portrait-label">
          {theme === "dark" ? "mayu." : "meeko."}
        </span>
      </div>
    </button>
  );
}
