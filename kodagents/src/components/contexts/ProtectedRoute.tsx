import React, { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

interface ProtectedRouteProps {
  children: ReactNode | ((props: any) => ReactNode);
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoggedIn, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    // console.log('ProtectedRoute: User not logged in, redirecting to /login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{typeof children === "function" ? children({}) : children}</>;
};

export default ProtectedRoute;
