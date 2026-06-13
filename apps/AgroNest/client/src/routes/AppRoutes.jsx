import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AdminRoutes from "./AdminRoutes";
import ProtectedRoute from "./ProtectedRoute";

import AdminLogin from "../pages/AdminLogin";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminRoutes />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}