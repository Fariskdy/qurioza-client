import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { LoadingFallback } from "@/components/ui/loading-fallback";

// Lazy load components
const TeacherOverview = lazy(() => import("./teacher/TeacherOverview"));
const TeacherClasses = lazy(() => import("./teacher/TeacherClasses"));
const ClassRoom = lazy(() => import("./teacher/ClassRoom"));
const Assignments = lazy(() => import("./teacher/Assignments"));
const TeacherAssignments = lazy(() => import("./teacher/TeacherAssignments"));
const TeacherQuizzes = lazy(() => import("./teacher/TeacherQuizzes"));
const Quizzes = lazy(() => import("./teacher/Quizzes"));
const AssignmentSubmissions = lazy(() =>
  import("./teacher/AssignmentSubmissions")
);

export function TeacherDashboard() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route index element={<TeacherOverview />} />
        <Route path="classes" element={<TeacherClasses />} />
        <Route path="batches/:batchId/classroom" element={<ClassRoom />} />
        <Route path="assignments" element={<TeacherAssignments />} />
        <Route path="quizzes" element={<TeacherQuizzes />} />
        <Route path="batches/:batchId/assignments" element={<Assignments />} />
        <Route path="batches/:batchId/quizzes" element={<Quizzes />} />
        <Route
          path="batches/:batchId/assignments/:assignmentId/submissions"
          element={<AssignmentSubmissions />}
        />
      </Routes>
    </Suspense>
  );
}
