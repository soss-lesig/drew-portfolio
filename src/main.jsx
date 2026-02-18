import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../styles.css";
import "../highlight-theme.css";
import "@fontsource-variable/jost";
import App from "./App.jsx";

createRoot(document.getElementById("app")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
