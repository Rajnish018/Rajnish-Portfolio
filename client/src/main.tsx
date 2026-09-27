import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";
import { prefetchProjects } from "./hooks/useProjects.ts";
import "./index.css";

import { AuthProvider } from "./contexts/AuthContext.tsx";
import { ToastProvider } from "./contexts/ToastContext";


import { HelmetProvider } from "react-helmet-async";

// Start the public project request immediately, before route components mount.
// This removes the Home -> Projects fetch race on a cold production visit.
prefetchProjects();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <AuthProvider>
        <ToastProvider> 
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </HelmetProvider>
  </StrictMode>
);