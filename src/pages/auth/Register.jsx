import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  GraduationCap,
  Mail,
  Lock,
  Github,
  ArrowRight,
  User,
} from "lucide-react";
import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

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
    <div className="min-h-screen bg-background relative flex overflow-hidden">
      {/* Background Design */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-purple-50/50 dark:from-violet-950 dark:via-zinc-900 dark:to-purple-900/10" />
      <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
      <div className="absolute -left-20 top-0 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/30 blur-[100px] dark:from-violet-500/10 dark:to-purple-500/20" />
      <div className="absolute -right-20 bottom-0 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/30 blur-[100px] dark:from-violet-500/10 dark:to-purple-500/20" />

      {/* Content */}
      <div className="flex-1 flex items-center justify-center min-h-screen py-6 px-4 sm:px-6">
        <div className="relative w-full max-w-[420px]">
          <div className="rounded-2xl border bg-background/60 backdrop-blur-lg shadow-sm p-4 sm:p-6 space-y-4">
            {/* Logo */}
            <div className="text-center space-y-1.5">
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
                  Create an account
                </h1>
                <p className="text-sm text-muted-foreground">
                  Enter your details to get started
                </p>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3">
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

            {/* Register Form */}
            <form className="space-y-3">
              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="text-sm font-medium leading-none"
                    >
                      First name
                    </label>
                    <div className="relative mt-1.5">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="firstName"
                        placeholder="John"
                        className="pl-9"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="text-sm font-medium leading-none"
                    >
                      Last name
                    </label>
                    <div className="relative mt-1.5">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        className="pl-9"
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="text-sm font-medium leading-none"
                  >
                    Email
                  </label>
                  <div className="relative mt-1.5">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      className="pl-9"
                      required
                      value={formData.email}
                      onChange={handleChange}
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
                  <div className="relative mt-1.5">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a password"
                      className="pl-9"
                      required
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Must be at least 8 characters long
                  </p>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full group"
                onClick={handleSubmit}
              >
                Create account
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>

            {/* Sign In Link */}
            <div className="text-center space-y-2">
              <div className="text-sm">
                Already have an account?{" "}
                <Link
                  to="/auth/login"
                  className="font-medium text-primary hover:text-primary/90"
                >
                  Sign in
                </Link>
              </div>

              {/* Terms */}
              <p className="text-xs text-muted-foreground">
                By creating an account, you agree to our{" "}
                <Link
                  to="/terms"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Terms
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
