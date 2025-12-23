import { Navigate, useLocation } from 'react-router-dom';
import type {JSX} from "react";
import {useAuth} from "@/auth/useAuth";

export function RequireAuth({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}