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
import PropTypes from "prop-types";
import { PaymentSuccess } from "@/pages/website/PaymentSuccess";
import { PaymentCancel } from "@/pages/website/PaymentCancel";

// Only import DevTools in development
const ReactQueryDevtools = import.meta.env.DEV
  ? (await import("@tanstack/react-query-devtools")).ReactQueryDevtools
  : null;

// New component for protected auth routes
function AuthRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (user) {
    // Get the redirect path from state, or default to dashboard
    const from = location.state?.from || "/dashboard";
    return <Navigate to={from} replace />;
  }

  return children;
}

AuthRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

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
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ScrollToTop />
        {!isAuthPage && !isDashboardPage && <MainNav />}
        <Routes>
          {/* Public Routes - No Auth Required */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:slug" element={<CourseDetails />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/cancel" element={<PaymentCancel />} />

          {/* Auth Routes - Redirect if authenticated */}
          <Route
            path="/auth/*"
            element={
              <AuthRoute>
                <Routes>
                  <Route path="login" element={<Login />} />
                  <Route path="register" element={<Register />} />
                  <Route path="forgot-password" element={<ForgotPassword />} />
                  <Route path="reset-password" element={<ResetPassword />} />
                </Routes>
              </AuthRoute>
            }
          />

          {/* Protected Routes - Require authentication */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <ThemeProvider>
                  <LayoutProvider>
                    <DashboardLayout />
                  </LayoutProvider>
                </ThemeProvider>
              </ProtectedRoute>
            }
          />
        </Routes>
        {/* {ReactQueryDevtools && <ReactQueryDevtools initialIsOpen={false} />} */}
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
