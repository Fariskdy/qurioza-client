import { useAuth } from "@/contexts/AuthContext";
import { StudentDashboard } from "@/pages/dashboard/StudentDashboard";
import { TeacherDashboard } from "@/pages/dashboard/TeacherDashboard";
import { CoordinatorDashboard } from "@/pages/dashboard/CoordinatorDashboard";
import { AdminDashboard } from "@/pages/dashboard/AdminDashboard";

export function Dashboard() {
  const { user } = useAuth();

  // Handle case when no role is selected
  if (!user?.role) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <h2 className="text-xl font-semibold mb-2">No Active Role</h2>
        <p className="text-muted-foreground">
          You don&apos;t have any active role. Please contact your
          administrator.
        </p>
      </div>
    );
  }

  // Redirect based on user role
  let dashboard;
  switch (user.role.toUpperCase()) {
    case "ADMIN":
      dashboard = <AdminDashboard />;
      break;
    case "TEACHER":
      dashboard = <TeacherDashboard />;
      break;
    case "COURSE COORDINATOR":
      dashboard = <CoordinatorDashboard />;
      break;
    case "STUDENT":
      dashboard = <StudentDashboard />;
      break;
    default:
      dashboard = (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
          <h2 className="text-xl font-semibold mb-2">Unknown Role</h2>
          <p className="text-muted-foreground">
            The selected role type is not recognized.
          </p>
        </div>
      );
  }

  return <div className="pb-8">{dashboard}</div>;
}
