import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { LoadingFallback } from "@/components/ui/loading-fallback";

// Lazy load components
const StudentOverview = lazy(() => import("./student/StudentOverview"));
const StudentCourses = lazy(() => import("./student/StudentCourses"));
const StudentAssignments = lazy(() => import("./student/StudentAssignments"));
const StudentQuizzes = lazy(() => import("./student/StudentQuizzes"));
const StudentCertificates = lazy(() => import("./student/StudentCertificates"));
const StudentSettings = lazy(() => import("./student/StudentSettings"));

export function StudentDashboard() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route index element={<StudentOverview />} />
        <Route path="courses" element={<StudentCourses />} />
        <Route path="assignments" element={<StudentAssignments />} />
        <Route path="quizzes" element={<StudentQuizzes />} />
        <Route path="certificates" element={<StudentCertificates />} />
        <Route path="settings" element={<StudentSettings />} />
      </Routes>
    </Suspense>
  );
}


