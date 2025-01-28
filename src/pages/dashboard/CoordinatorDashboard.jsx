import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Outlet } from "react-router-dom";

export function CoordinatorDashboard() {
  return (
    <DashboardLayout>
      <div className="container max-w-6xl py-8">
        <Outlet />
      </div>
    </DashboardLayout>
  );
}
