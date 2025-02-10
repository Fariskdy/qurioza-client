import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GraduationCap, Mail, Lock, ArrowRight, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import authIllustration from "@/assets/illustrations/auth-illustration.svg";

export function Register() {
  const navigate = useNavigate();
  const { register, error } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    role: "student",
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
      await register({
        username: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        address: formData.address,
      });
      toast.success("Registration successful!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(error || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 via-background to-purple-50/30 dark:from-violet-950/20 dark:via-background dark:to-purple-900/10" />
        <div className="absolute inset-0 bg-grid-black/[0.01] dark:bg-grid-white/[0.01]" />

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
                Create your account
              </h1>
              <p className="mt-2 text-base text-muted-foreground">
                Start your learning journey with Qurioza
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-4">
                {/* Name Fields */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="text-sm font-medium text-foreground"
                    >
                      First name
                    </label>
                    <div className="mt-1.5 relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="firstName"
                        autoComplete="given-name"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="John"
                        className="pl-9 h-11 bg-background border-input/60 hover:border-input focus:border-violet-600 transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="text-sm font-medium text-foreground"
                    >
                      Last name
                    </label>
                    <div className="mt-1.5 relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="lastName"
                        autoComplete="family-name"
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Doe"
                        className="pl-9 h-11 bg-background border-input/60 hover:border-input focus:border-violet-600 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Email Field */}
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

                {/* Password Field */}
                <div>
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-foreground"
                  >
                    Password
                  </label>
                  <div className="mt-1.5 relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a strong password"
                      className="pl-9 h-11 bg-background border-input/60 hover:border-input focus:border-violet-600 transition-colors"
                    />
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Must be at least 8 characters long
                  </p>
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
                    Creating account...
                  </span>
                ) : (
                  "Create account"
                )}
              </Button>
            </form>

            {/* Footer */}
            <div className="space-y-4">
              <p className="text-sm text-center text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/auth/login"
                  className="font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
                >
                  Sign in
                </Link>
              </p>
              <p className="text-xs text-center text-muted-foreground">
                By creating an account, you agree to our{" "}
                <Link
                  to="/terms"
                  className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                >
                  Privacy Policy
                </Link>
              </p>
            </div>
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
              Join Our Learning Community
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              Create an account to access courses, track your progress, and
              connect with other learners
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
