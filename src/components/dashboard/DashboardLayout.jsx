import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Menu, X, Bell, Search, Moon, Sun } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/contexts/ThemeContext";
import { AppSidebar } from "./AppSidebar";
import { Dashboard } from "../../pages/dashboard/Dashboard";

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const userRole = user?.role;

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
            {/* Mobile Menu Toggle */}
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

            {/* Search */}
            <div className="flex-1 max-w-md ml-4">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary dark:group-focus-within:text-[#149ECA]" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-10 bg-accent/50 border-input dark:border-[#2A3F47] dark:bg-[#202F36] dark:placeholder:text-[#8B949E] focus:ring-2 focus:ring-primary/20 dark:focus:ring-[#149ECA]/20 transition-all"
                />
              </div>
            </div>

            {/* Right side buttons */}
            <div className="flex items-center gap-2 ml-6">
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
    </div>
  );
}
