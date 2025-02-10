import {
  Routes,
  Route,
  useLocation,
  Navigate,
  BrowserRouter,
} from "react-router-dom";
import { Home } from "@/pages/website/Home";
import { Courses } from "@/pages/website/Courses";
import { CourseDetails } from "@/pages/website/CourseDetails";
import { MainNav } from "@/components/MainNav";
import { About } from "@/pages/website/About";
import { Contact } from "@/pages/website/Contact";
import { FAQ } from "@/pages/website/FAQ";
import { Privacy } from "@/pages/website/Privacy";
import { Terms } from "@/pages/website/Terms";
import { Login } from "@/pages/auth/Login";
import { Register } from "@/pages/auth/Register";
import { ForgotPassword } from "@/pages/auth/ForgotPassword";
import { ResetPassword } from "@/pages/auth/ResetPassword";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { DashboardLayout } from "./components/dashboard/DashboardLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LayoutProvider } from "@/contexts/LayoutContext";

// Only import DevTools in development
const ReactQueryDevtools = import.meta.env.DEV
  ? (await import("@tanstack/react-query-devtools")).ReactQueryDevtools
  : null;

// New component for protected auth routes
function AuthRoute({ children }) {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" replace /> : children;
}

// Create QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname.startsWith("/auth/");
  const isDashboardPage = location.pathname.startsWith("/dashboard");

  return (
    <LayoutProvider>
      <QueryClientProvider client={queryClient}>
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
            <Route path="/courses/:slug" element={<CourseDetails />} />

            {/* Auth Routes */}
            <Route
              path="/auth/login"
              element={
                <AuthRoute>
                  <Login />
                </AuthRoute>
              }
            />
            <Route
              path="/auth/register"
              element={
                <AuthRoute>
                  <Register />
                </AuthRoute>
              }
            />
            <Route
              path="/auth/forgot-password"
              element={
                <AuthRoute>
                  <ForgotPassword />
                </AuthRoute>
              }
            />
            <Route
              path="/auth/reset-password"
              element={
                <AuthRoute>
                  <ResetPassword />
                </AuthRoute>
              }
            />

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
            />
          </Routes>
          {/* {ReactQueryDevtools && <ReactQueryDevtools initialIsOpen={false} />} */}
        </AuthProvider>
      </QueryClientProvider>
    </LayoutProvider>
  );
}

export default App;
