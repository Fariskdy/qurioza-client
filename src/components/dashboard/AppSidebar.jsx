import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { LogOut, ChevronLeft, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import PropTypes from "prop-types";
import { getNavigationConfig } from "@/pages/dashboard/sidebarData";

export function AppSidebar({
  sidebarOpen,
  setSidebarOpen,
  userRole = "Student",
}) {
  const { user, logout } = useAuth();
  const location = useLocation();

  // Get navigation based on user role
  const navigation = getNavigationConfig(userRole);

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className={cn(
        "fixed inset-y-0 z-50 flex w-72 flex-col border-r bg-background transition-transform duration-300 lg:static dark:border-[#202F36]",
        !sidebarOpen && "lg:w-20 lg:items-center",
        !sidebarOpen && "-translate-x-full lg:translate-x-0"
      )}
    >
      {/* Sidebar Header */}
      <div
        className={cn(
          "sticky top-0 z-10 flex h-20 items-center justify-between border-b bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-violet-500/10 px-6 dark:border-zinc-800",
          !sidebarOpen && "lg:justify-center lg:px-0"
        )}
      >
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="rounded-xl bg-violet-500/10 p-2"
          >
            <GraduationCap className="h-8 w-8 text-violet-600" />
          </motion.div>
          {sidebarOpen && (
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-purple-600">
              Qurioza
            </span>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded-xl hover:bg-violet-500/10 hover:text-violet-600 lg:flex hidden dark:text-white dark:hover:bg-white/10 dark:hover:text-white"
        >
          <ChevronLeft
            className={cn(
              "h-5 w-5 transition-transform",
              !sidebarOpen && "rotate-180"
            )}
          />
        </Button>
      </div>

      {/* User Profile Card */}
      <div
        className={cn(
          "flex-1 overflow-y-auto px-4 py-6",
          !sidebarOpen && "lg:px-2"
        )}
      >
        {sidebarOpen ? (
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="mb-8 overflow-hidden"
          >
            <div className="relative rounded-2xl bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-violet-500/10 p-4 dark:bg-[#202F36] dark:border dark:border-[#2A3F47] backdrop-blur-sm">
              <div className="absolute top-0 right-0 p-2">
                <Badge
                  variant="secondary"
                  className="bg-violet-500/20 dark:bg-[#0B4F6C]/50 dark:text-white"
                >
                  {userRole}
                </Badge>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-16 w-16 border-2 border-violet-500 ring-2 ring-violet-500/20">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="text-lg bg-violet-500 text-white">
                      {user?.username
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 rounded-full bg-green-500 p-1.5 ring-2 ring-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground dark:text-white">
                    {user?.username}
                  </h2>
                  <p className="text-sm text-muted-foreground dark:text-zinc-400">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="mb-8 flex justify-center"
          >
            <div className="relative">
              <Avatar className="h-10 w-10 border-2 border-violet-500 ring-2 ring-violet-500/20">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="text-sm bg-violet-500 text-white">
                  {user?.username
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-0.5 -right-0.5 rounded-full bg-green-500 p-1 ring-1 ring-white" />
            </div>
          </motion.div>
        )}

        {/* Navigation */}
        {sidebarOpen ? (
          <nav className="space-y-2">
            {navigation.map((item) => (
              <motion.div
                key={item.name}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all relative overflow-hidden",
                    location.pathname === item.href
                      ? "bg-violet-500/10 text-violet-600 dark:bg-[#0B4F6C] dark:text-white"
                      : "text-muted-foreground hover:bg-violet-500/5 hover:text-violet-600 dark:text-[#E3E5E5] dark:hover:bg-[#202F36] dark:hover:text-white"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                  {location.pathname === item.href && (
                    <motion.div
                      layoutId="activeNav"
                      className="ml-auto h-2 w-2 rounded-full bg-violet-600 dark:bg-white"
                    />
                  )}
                </Link>
              </motion.div>
            ))}
          </nav>
        ) : (
          <nav className="space-y-2">
            {navigation.map((item) => (
              <motion.div
                key={item.name}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={item.href}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl transition-colors",
                    location.pathname === item.href
                      ? "bg-violet-500/10 text-violet-600"
                      : "text-muted-foreground hover:bg-violet-500/5 hover:text-violet-600"
                  )}
                  title={item.name}
                >
                  <item.icon className="h-5 w-5" />
                </Link>
              </motion.div>
            ))}
          </nav>
        )}
      </div>

      {/* Logout button */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className={cn("p-4", !sidebarOpen && "lg:px-2")}
      >
        <Button
          variant="ghost"
          className={cn(
            "text-muted-foreground hover:bg-red-500/10 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400",
            sidebarOpen ? "w-full gap-2" : "w-10 h-10"
          )}
          onClick={logout}
          title="Sign Out"
        >
          <LogOut className="h-4 w-4" />
          {sidebarOpen && "Sign Out"}
        </Button>
      </motion.div>
    </motion.div>
  );
}

AppSidebar.propTypes = {
  sidebarOpen: PropTypes.bool.isRequired,
  setSidebarOpen: PropTypes.func.isRequired,
  userRole: PropTypes.string,
};
