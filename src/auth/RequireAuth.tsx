import { Navigate, useLocation } from 'react-router-dom';
import type {JSX} from "react";
import {useAuth} from "@/auth/useAuth";
import {ROUTES} from "@/routes";

export function RequireAuth({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.auth.login.path} state={{ from: location }} replace />;
  }

  return children;
}