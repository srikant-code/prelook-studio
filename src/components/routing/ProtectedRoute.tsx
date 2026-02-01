import React from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  children: React.ReactNode;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  isAuthenticated,
  children,
  redirectTo = "/",
}) => {
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to home with state to trigger login modal
    return (
      <Navigate
        to={redirectTo}
        state={{ from: location, showLogin: true }}
        replace
      />
    );
  }

  return <>{children}</>;
};
