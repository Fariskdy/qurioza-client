import { Routes, Route, useLocation } from "react-router-dom";
import { Home } from "@/pages/Home";
import { Courses } from "@/pages/Courses";
import { CourseDetails } from "@/pages/CourseDetails";
import { MainNav } from "@/components/MainNav";
import { About } from "@/pages/About";
import { Contact } from "@/pages/Contact";
import { FAQ } from "@/pages/FAQ";
import { Privacy } from "@/pages/Privacy";
import { Terms } from "@/pages/Terms";
import { Login } from "@/pages/auth/Login";
import { Register } from "@/pages/auth/Register";
import { ForgotPassword } from "@/pages/auth/ForgotPassword";
import { ResetPassword } from "@/pages/auth/ResetPassword";
import { Dashboard } from "@/pages/dashboard/Dashboard";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { DashboardLayout } from "./components/dashboard/DashboardLayout";

import { StudentDashboard } from "@/pages/dashboard/StudentDashboard";
// studentOverview
import { StudentOverview } from "@/pages/dashboard/student/StudentOverview";
import { StudentCourses } from "@/pages/dashboard/student/StudentCourses";
import { StudentAssignments } from "@/pages/dashboard/student/StudentAssignments";
import { StudentQuizzes } from "@/pages/dashboard/student/StudentQuizzes";
import { StudentCertificates } from "@/pages/dashboard/student/StudentCertificates";
import { StudentSettings } from "@/pages/dashboard/student/StudentSettings";

import { TeacherDashboard } from "@/pages/dashboard/TeacherDashboard";
import { TeacherOverview } from "@/pages/dashboard/teacher/TeacherOverview";
import { TeacherClasses } from "@/pages/dashboard/teacher/TeacherClasses";

import { CoordinatorDashboard } from "@/pages/dashboard/CoordinatorDashboard";
import { CoordinatorOverview } from "@/pages/dashboard/coordinator/CoordinatorOverview";

import { AdminDashboard } from "./pages/dashboard/AdminDashboard";
import { AdminOverview } from "./pages/dashboard/admin/AdminOverview";
import CategoryManagement from "./pages/dashboard/admin/Category";
import CoordinatorManagement from "./pages/dashboard/admin/Coordinator";

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname.startsWith("/auth/");
  const isDashboardPage = location.pathname.startsWith("/dashboard");

  return (
    <AuthProvider>
      <ScrollToTop />
      {!isAuthPage && !isDashboardPage && <MainNav />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:courseId" element={<CourseDetails />} />

        {/* Auth Routes */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />

        {/* Dashboard Routes */}
        <Route
        path="/dashboard/*"
          element={
            <ProtectedRoute>
              <ThemeProvider>
                <DashboardLayout />
              </ThemeProvider>
            </ProtectedRoute>
          }
        >
          {/* <Route path="/dashboard">
          
            <Route path="" element={<StudentDashboard />}>
              <Route index element={<StudentOverview />} />
              <Route path="courses" element={<StudentCourses />} />
              <Route path="assignments" element={<StudentAssignments />} />
              <Route path="quizzes" element={<StudentQuizzes />} />
              <Route path="certificates" element={<StudentCertificates />} />
              <Route path="settings" element={<StudentSettings />} />
            </Route>

           
            <Route path="teacher" element={<TeacherDashboard />}>
              <Route index element={<TeacherOverview />} />
              <Route path="classes" element={<TeacherClasses />} />
            </Route>

            
            <Route path="coordinator" element={<CoordinatorDashboard />}>
              <Route index element={<CoordinatorOverview />} />
            </Route>

            
            <Route path="admin" element={<AdminDashboard />}>
              <Route index element={<AdminOverview />} />
              <Route path="categories" element={<CategoryManagement />} />
              <Route path="coordinators" element={<CoordinatorManagement />} />
            </Route>
          </Route> */}
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
