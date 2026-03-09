import { Outlet } from "react-router";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import VaultTransitionOverlay from "./VaultTransitionOverlay.jsx";
import { VaultTransitionProvider } from "../hooks/useVaultTransition.jsx";

export default function Layout() {
  return (
    <VaultTransitionProvider>
      <Header />
      <main>
        <div id="app">
          <Outlet />
        </div>
      </main>
      <Footer />
      <VaultTransitionOverlay />
    </VaultTransitionProvider>
  );
}
