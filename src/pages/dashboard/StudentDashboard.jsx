import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { LoadingFallback } from "@/components/ui/loading-fallback";

// Lazy load components
const StudentOverview = lazy(() => import("./student/StudentOverview"));
const StudentCourses = lazy(() => import("./student/StudentCourses"));
const Learn = lazy(() => import("./student/Learn"));
const StudentAssignments = lazy(() => import("./student/StudentAssignments"));
const BatchAssignments = lazy(() => import("./student/BatchAssignments"));
const StudentQuizzes = lazy(() => import("./student/StudentQuizzes"));
const BatchQuizzes = lazy(() => import("./student/BatchQuizzes"));
const StudentCertificates = lazy(() => import("./student/StudentCertificates"));
const StudentSettings = lazy(() => import("./student/StudentSettings"));
const AssignmentSubmission = lazy(() =>
  import("./student/AssignmentSubmission")
);
const QuizAttempt = lazy(() => import("./student/QuizAttempt"));
const QuizReview = lazy(() => import("./student/QuizReview"));

const Settings = lazy(() => import("./shared/Settings"));

export function StudentDashboard() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route index element={<StudentOverview />} />
        <Route path="courses">
          <Route index element={<StudentCourses />} />
          <Route path=":slug/learn" element={<Learn />} />
        </Route>
        <Route path="assignments">
          <Route index element={<StudentAssignments />} />
          <Route path="batch/:batchId" element={<BatchAssignments />} />
          <Route
            path="batch/:batchId/assignment/:assignmentId"
            element={<AssignmentSubmission />}
          />
        </Route>
        <Route path="quizzes">
          <Route index element={<StudentQuizzes />} />
          <Route path="batch/:batchId" element={<BatchQuizzes />} />
          <Route path=":quizId/attempt" element={<QuizAttempt />} />
        </Route>
        <Route path="certificates" element={<StudentCertificates />} />
        <Route path="quizzes/:quizId/review" element={<QuizReview />} />
        <Route path="settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}
