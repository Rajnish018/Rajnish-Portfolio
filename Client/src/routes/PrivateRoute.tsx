import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // console.log("PrivateRoute - isAuthenticated:", isAuthenticated); // Debug log 


  // 🚫 Not authenticated → redirect to correct login route
  if (!isAuthenticated) {
    return (
      <Navigate 
        to="/admin/login"   // ✅ FIXED PATH
        replace 
        state={{ from: location }} // 🔥 optional: for redirect back after login
      />
    );
  }

  // ✅ Authorized → render protected content
  return <>{children}</>;
};

export default PrivateRoute;