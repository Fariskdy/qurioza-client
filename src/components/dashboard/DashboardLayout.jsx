import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Menu, X, Bell, Moon, Sun, Home, Globe } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { AppSidebar } from "./AppSidebar";
import { Dashboard } from "../../pages/dashboard/Dashboard";
import { Toaster } from "@/components/ui/toaster";
import { Link } from "react-router-dom";
import { useLayout } from "@/contexts/LayoutContext";

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const userRole = user?.role;
  const { showDashboardLayout } = useLayout();

  useEffect(() => {
    let timeoutId;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (window.innerWidth >= 1024) {
          setSidebarOpen(true);
        } else {
          setSidebarOpen(false);
        }
      }, 100);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  if (!showDashboardLayout) {
    return (
      <main className="h-screen">
        <Dashboard />
      </main>
    );
  }

  return (
    <div id="dashboard-layout" className="flex h-screen bg-background">
      <AppSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        userRole={userRole}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur-sm dark:border-[#202F36]">
          <div className="flex h-16 items-center justify-between px-6">
            {/* Left side: Mobile Menu Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-foreground dark:text-[#E3E5E5] hover:bg-accent/50 dark:hover:bg-[#202F36]"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>

            {/* Right side buttons */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="h-9 w-9 rounded-lg text-foreground dark:text-[#E3E5E5] hover:bg-accent/50 dark:hover:bg-[#202F36]"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>

              {/* Website Link */}
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-lg text-foreground dark:text-[#E3E5E5] hover:bg-accent/50 dark:hover:bg-[#202F36]"
                asChild
              >
                <Link to="/">
                  <Globe className="h-5 w-5" />
                </Link>
              </Button>

              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-lg text-foreground dark:text-[#E3E5E5] hover:bg-accent/50 dark:hover:bg-[#202F36] relative"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#0B4F6C] dark:bg-[#149ECA] animate-pulse ring-4 ring-background dark:ring-[#131F24]" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-background p-6">
          <div className="mx-auto max-w-7xl">
            <Dashboard />
          </div>
        </main>
      </div>

      {/* Add Toaster inside dashboard layout */}
      <Toaster />
    </div>
  );
}
