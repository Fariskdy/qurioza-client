import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GraduationCap, Lock, ArrowRight } from "lucide-react";

export function ResetPassword() {
  return (
    <div className="min-h-screen bg-background relative flex overflow-hidden">
      {/* Background Design */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-purple-50/50 dark:from-violet-950 dark:via-zinc-900 dark:to-purple-900/10" />
      <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
      <div className="absolute -left-20 top-0 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/30 blur-[100px] dark:from-violet-500/10 dark:to-purple-500/20" />
      <div className="absolute -right-20 bottom-0 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/30 blur-[100px] dark:from-violet-500/10 dark:to-purple-500/20" />

      {/* Content */}
      <div className="flex-1 flex items-center justify-center min-h-screen py-8 px-4 sm:px-6">
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
              <div className="space-y-2">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Reset password
                </h1>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  Enter your new password below
                </p>
              </div>
            </div>

            {/* Form */}
            <form className="space-y-5">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="password"
                    className="text-sm font-medium leading-none"
                  >
                    New password
                  </label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter new password"
                      className="pl-9"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium leading-none"
                  >
                    Confirm password
                  </label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm new password"
                      className="pl-9"
                      required
                    />
                  </div>
                </div>
              </div>
              <Button type="submit" className="w-full group">
                Reset password
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>

            {/* Back to Login */}
            <div className="text-center text-sm pt-2">
              <span className="text-muted-foreground">
                Remember your password?{" "}
              </span>
              <Link
                to="/auth/login"
                className="font-medium text-primary hover:text-primary/90"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
