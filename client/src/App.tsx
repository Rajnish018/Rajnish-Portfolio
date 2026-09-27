import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";

// Layouts & UI
import { Navbar, Footer } from "./components/Layout";
import { CustomCursor } from "./components/UI";
import { AdminLayout } from "./components/AdminLayout";

// Pages
import { Home } from "./pages/public/home/Home";
import { About } from "./pages/public/About";
import { Projects } from "./pages/public/project/Projects";
import { Contact } from "./pages/public/Contact";
import { NotFound } from "./pages/public/NotFound";

import { AdminLogin } from "./pages/public/AdminLogin";
// ➕ IMPORT THE NEW RESET PASSWORD PAGE HERE
import { ResetPassword } from "./pages/admin/ResetPassword"; 

import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminProjects } from "./pages/admin/AdminProjects";
import { AdminSkills } from "./pages/admin/AdminSkills";
import { AdminAnalytics } from "./pages/admin/AdminAnalytics";
import { AdminTeam } from "./pages/admin/AdminTeam";
import { AdminSettings } from "./pages/admin/AdminSetting";
import { AdminExperience } from "./pages/admin/AdminExperience";

import PrivateRoute from "./routes/PrivateRoute";
import { AdminMessages } from "./pages/admin/AdminMessages";
import BackgroundPattern from "./components/BackgroundPattern";
import { AdminLinks } from "./pages/admin/AdminLinks";

// -----------------------------
// Page Transition Wrapper
// -----------------------------
const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// -----------------------------
// Main App Content
// -----------------------------
const AppContent: React.FC = () => {
  const location = useLocation();

  // Render the router immediately. Data-dependent pages own their loading
  // state instead of blocking the entire application behind a timer.
  // Added a check so the public layout drops out for a clean reset interface
  const isAdminRoute = location.pathname.startsWith("/admin") || location.pathname === "/reset-password";

  return (
    <>
      <CustomCursor />

      {/* Public/Admin application layout */}
      {!isAdminRoute && <Navbar />}

      <main>
            <Routes>
              {/* ---------------- PUBLIC ROUTES ---------------- */}
              <Route path="/" element={<PageTransition><Home /></PageTransition>} />
              <Route path="/about" element={<PageTransition><About /></PageTransition>} />
              <Route path="/projects" element={<PageTransition><Projects /></PageTransition>} />
              <Route path="/archive" element={<PageTransition><Projects /></PageTransition>} />
              <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
              <Route path="/back" element={<PageTransition><BackgroundPattern /></PageTransition>} />

              {/* ---------------- PASSWORD RESET LINK ---------------- */}
              {/* ➕ REGISTER THE RESET ROUTE HERE */}
              <Route 
                path="/reset-password" 
                element={
                  <PageTransition>
                    <ResetPassword />
                  </PageTransition>
                } 
              />

              {/* ---------------- ADMIN LOGIN ---------------- */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* ---------------- ADMIN ROUTES ---------------- */}
              <Route
                path="/admin"
                element={
                  <PrivateRoute>
                    <AdminLayout />
                  </PrivateRoute>
                }
              >
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="projects" element={<AdminProjects />} />
                <Route path="team" element={<AdminTeam />} />
                <Route path="skills" element={<AdminSkills />} />
                <Route path="messages" element={<AdminMessages />} /> 
                <Route path="analytics" element={<AdminAnalytics />} />
                <Route path="experience" element={<AdminExperience />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="links" element={<AdminLinks />} />
              </Route>

              {/* ---------------- 404 ---------------- */}
              <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
            </Routes>
      </main>

      {/* Footer only for public */}
      {!isAdminRoute && <Footer />}
    </>
  );
};

export default AppContent;