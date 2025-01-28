import { Outlet } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";


export function TeacherDashboard() {

    return (
      <DashboardLayout >
        <div className="container max-w-6xl py-8">
          <Outlet />
        </div>
      </DashboardLayout>
    );
}
