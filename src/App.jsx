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
  const { loading: authLoading } = useAuth();
  const isAuthPage = location.pathname.startsWith("/auth/");
  const isDashboardPage = location.pathname.startsWith("/dashboard");

  if (authLoading && isDashboardPage) {
    return <div>Loading...</div>;
  }

  return (
    <LayoutProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ScrollToTop />
          {!isAuthPage && !isDashboardPage && <MainNav />}
          <Routes>
            {/* Public Routes - No auth check needed */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:slug" element={<CourseDetails />} />

            {/* Auth Routes - Redirect if logged in */}
            <Route
              path="/auth/*"
              element={
                <AuthRoute>
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                  </Routes>
                </AuthRoute>
              }
            />

            {/* Protected Routes - Require auth */}
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
