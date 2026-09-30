import { Navigate, useLocation } from "react-router-dom";

import { clearAuth, getToken, getUser } from "../utils/authStorage";
import { isTokenExpired } from "../utils/jwt";

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const token = getToken();
  const user = getUser();

  if (!token || !user) {
    clearAuth();
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (isTokenExpired(token)) {
    clearAuth();
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
}
