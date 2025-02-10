import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GraduationCap, Mail, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import authIllustration from "@/assets/illustrations/auth-illustration.svg";

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, error } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      toast.success("Login successful!");
      const returnUrl = location.state?.from || "/dashboard";
      navigate(returnUrl);
    } catch (err) {
      toast.error(error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-violet-50/50 via-background to-background dark:from-violet-950/20 dark:via-background dark:to-background" />

        {/* Content */}
        <div className="w-full max-w-[440px] relative">
          {/* Logo Section */}
          <div className="mb-16">
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 text-xl font-bold"
            >
              <div className="rounded-xl bg-violet-600 p-2 shadow-lg shadow-violet-500/20">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-foreground">Qurioza</span>
            </Link>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
                Welcome back
              </h1>
              <p className="mt-2 text-base text-muted-foreground">
                Continue your learning journey where you left off
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-foreground"
                  >
                    Email address
                  </label>
                  <div className="mt-1.5 relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      className="pl-9 h-11 bg-background border-input/60 hover:border-input focus:border-violet-600 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-sm font-medium text-foreground"
                    >
                      Password
                    </label>
                    <Link
                      to="/auth/forgot-password"
                      className="text-sm font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="mt-1.5 relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      className="pl-9 h-11 bg-background border-input/60 hover:border-input focus:border-violet-600 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-violet-600 hover:bg-violet-700 text-white transition-colors"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 border-2 border-white/20 border-t-white animate-spin rounded-full" />
                    Signing in...
                  </span>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>

            {/* Footer */}
            <p className="text-sm text-center text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/auth/register"
                className="font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-violet-50/50 via-white to-purple-50/50 dark:from-violet-950 dark:via-zinc-900 dark:to-purple-900/10">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/20 dark:to-black/20" />

        <div className="relative w-full flex flex-col items-center justify-center p-8">
          {/* Illustration */}
          <div className="w-full max-w-[640px] h-auto px-8">
            <img
              src={authIllustration}
              alt="Learning Platform Interface"
              className="w-full h-full object-contain drop-shadow-xl"
            />
          </div>

          {/* Text Content */}
          <div className="mt-12 text-center max-w-[440px] relative z-10">
            <h2 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-violet-500 dark:from-violet-400 dark:to-violet-300 mb-4">
              Start Your Learning Journey
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              Join thousands of students and educators on our platform for an
              enhanced learning experience
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
