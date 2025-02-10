import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { LoadingFallback } from "@/components/ui/loading-fallback";

// Fix lazy loading imports
const CoordinatorOverview = lazy(() =>
  import("./coordinator/CoordinatorOverview")
);

const Courses = lazy(() => import("./coordinator/Courses"));

const CourseDetails = lazy(() =>
  import("./coordinator/CourseDetails").then((module) => ({
    default: module.CourseDetails,
  }))
);

const ModuleManagement = lazy(() =>
  import("./coordinator/ModuleManagement").then((module) => ({
    default: module.ModuleManagement,
  }))
);

// Add TeacherManagement lazy import
const TeacherManagement = lazy(() => import("./coordinator/TeacherManagement"));

// Add new lazy imports for batch management
const BatchManagement = lazy(() =>
  import("./coordinator/BatchManagement").then((module) => ({
    default: module.BatchManagement,
  }))
);

const BatchDetails = lazy(() =>
  import("./coordinator/BatchDetails").then((module) => ({
    default: module.BatchDetails,
  }))
);

const Settings = lazy(() => import("./shared/Settings"));

export function CoordinatorDashboard() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route index element={<CoordinatorOverview />} />
        {/* Add TeacherManagement route */}
        <Route path="teachers" element={<TeacherManagement />} />
        <Route path="courses">
          <Route index element={<Courses />} />
          <Route path=":slug" element={<CourseDetails />} />
          <Route path=":slug/modules" element={<ModuleManagement />} />
          {/* Add new routes for batch management */}
          <Route path=":slug/batches">
            <Route index element={<BatchManagement />} />
            <Route path=":batchId" element={<BatchDetails />} />
          </Route>
        </Route>
        <Route path="settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}
