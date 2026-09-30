import { Spin } from "antd";
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./modules/auth/components/ProtectedRoute";

const LoginPage = lazy(() => import("./modules/auth/pages/LoginPage"));
const MainLayout = lazy(() => import("./shared/layouts/MainLayout"));

const routeLoadingStyle = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  background: "#f8fafc",
};

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div style={routeLoadingStyle}><Spin size="large" /></div>}>
        <Routes>
          <Route path="/" element={<LoginPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
