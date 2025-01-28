import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { LoadingFallback } from "@/components/ui/loading-fallback";

// Lazy load components
const AdminOverview = lazy(() => import("./admin/AdminOverview"));
const CategoryManagement = lazy(() => import("./admin/Category"));
const CoordinatorManagement = lazy(() => import("./admin/Coordinator"));

export function AdminDashboard() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route index element={<AdminOverview />} />
        <Route path="categories" element={<CategoryManagement />} />
        <Route path="coordinators" element={<CoordinatorManagement />} />
      </Routes>
    </Suspense>
  );
}
