import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { makeServer } from "./mocks/server";

// This app has no real backend yet, so Mirage JS intercepts fetch() calls
// and stands in for one. The API layer (src/api) talks to it exactly like
// it would talk to a real server — swap this out once a backend exists.
declare global {
  interface Window {
    __mirageServer?: ReturnType<typeof makeServer>;
  }
}

if (!window.__mirageServer) {
  window.__mirageServer = makeServer();
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
