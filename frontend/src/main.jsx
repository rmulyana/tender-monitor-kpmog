import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";
import { TenderProvider } from "./context/TenderContext.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <TenderProvider>
      <App />
    </TenderProvider>
  </StrictMode>
);
