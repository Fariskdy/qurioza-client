import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GraduationCap, Mail, Lock, Github, ArrowRight } from "lucide-react";
import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

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
    <div className="min-h-screen bg-background relative flex overflow-hidden">
      {/* Background Design */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-purple-50/50 dark:from-violet-950 dark:via-zinc-900 dark:to-purple-900/10" />
      <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
      <div className="absolute -left-20 top-0 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/30 blur-[100px] dark:from-violet-500/10 dark:to-purple-500/20" />
      <div className="absolute -right-20 bottom-0 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/30 blur-[100px] dark:from-violet-500/10 dark:to-purple-500/20" />

      {/* Content */}
      <div className="flex-1 flex items-center justify-center min-h-screen py-12 px-4 sm:px-6">
        <div className="relative w-full max-w-[420px]">
          <div className="rounded-2xl border bg-background/60 backdrop-blur-lg shadow-sm p-6 sm:p-8 space-y-6">
            {/* Logo */}
            <div className="text-center space-y-2">
              <Link
                to="/"
                className="inline-flex items-center gap-2.5 text-xl font-bold"
              >
                <div className="rounded-xl bg-gradient-to-tr from-primary/20 to-violet-400/20 p-1.5">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary/90 to-violet-600">
                  Qurioza
                </span>
              </Link>
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Welcome back
                </h1>
                <p className="text-sm text-muted-foreground">
                  Enter your credentials to access your account
                </p>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="w-full group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-200/0 via-zinc-200/50 to-zinc-200/0 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-100%] group-hover:translate-x-[100%] duration-1000" />
                <Github className="mr-2 h-4 w-4" />
                Github
              </Button>
              <Button
                variant="outline"
                className="w-full group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-200/0 via-zinc-200/50 to-zinc-200/0 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-100%] group-hover:translate-x-[100%] duration-1000" />
                <GoogleIcon className="mr-2 h-4 w-4" />
                Google
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="text-sm font-medium leading-none"
                  >
                    Email
                  </label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      className="pl-9"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="text-sm font-medium leading-none"
                  >
                    Password
                  </label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      className="pl-9"
                      required
                    />
                  </div>
                </div>
              </div>
              <Button type="submit" className="w-full group" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center space-y-3">
              <div className="text-sm">
                Don't have an account?{" "}
                <Link
                  to="/auth/register"
                  className="font-medium text-primary hover:text-primary/90"
                >
                  Sign up
                </Link>
              </div>

              {/* Terms */}
              <p className="text-xs text-muted-foreground">
                By continuing, you agree to our{" "}
                <Link
                  to="/terms"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
