import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  ChevronDown,
  Menu,
  X,
  GraduationCap,
  User,
  LogOut,
  Settings,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

export function MainNav() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigation = [
    {
      label: "Courses",
      href: "/courses",
      children: [
        {
          label: "Browse All Courses",
          description: "Explore our complete course catalog",
          href: "/courses",
        },
        {
          label: "Web Development",
          description: "Frontend, Backend & Full Stack",
          href: "/courses?category=web-development",
        },
        {
          label: "Data Science",
          description: "Python, ML & Analytics",
          href: "/courses?category=data-science",
        },
        {
          label: "Cloud Computing",
          description: "AWS, Azure & DevOps",
          href: "/courses?category=cloud-computing",
        },
      ],
    },
    {
      label: "About",
      href: "/about",
    },
    {
      label: "Contact",
      href: "/contact",
    },
  ];

  const handleLogout = async () => {
    await logout();
    // Optionally redirect to home or login page
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        isScrolled && "shadow-sm"
      )}
    >
      <nav className="container px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo, Brand & Navigation */}
          <div className="flex items-center gap-8">
            {/* Logo & Brand */}
            <Link
              to="/"
              className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
            >
              <div className="rounded-xl bg-gradient-to-tr from-primary/20 to-violet-400/20 p-1.5">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary/90 to-violet-600">
                Qurioza
              </span>
            </Link>

            {/* Desktop Navigation - Hidden on Mobile */}
            <div className="hidden md:flex items-center space-x-4">
              {navigation.map((item) =>
                item.children ? (
                  <DropdownMenu key={item.label}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className={cn(
                          "text-[15px] font-medium px-4 h-9 gap-1.5",
                          location.pathname === item.href
                            ? "text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {item.label}
                        <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      className="w-80 bg-background/95 backdrop-blur-sm"
                    >
                      {item.children.map((child) => (
                        <Link key={child.href} to={child.href}>
                          <DropdownMenuItem className="py-3 cursor-pointer">
                            <div>
                              <div className="font-medium mb-1">
                                {child.label}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {child.description}
                              </div>
                            </div>
                          </DropdownMenuItem>
                        </Link>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link key={item.href} to={item.href}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "text-[15px] font-medium px-4 h-9",
                        location.pathname === item.href
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {item.label}
                    </Button>
                  </Link>
                )
              )}
            </div>
          </div>

          {/* Search and Auth - Hidden on Mobile */}
          <div className="hidden md:flex items-center gap-4">
            <div className="relative w-60">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search courses..."
                className="pl-10 bg-secondary/40"
              />
            </div>

            {/* Auth Buttons or User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.username} />
                      <AvatarFallback>
                        {user.username
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.username}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600 focus:text-red-600"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/auth/login">
                  <Button variant="ghost">Sign in</Button>
                </Link>
                <Link to="/auth/register">
                  <Button>Get started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0 top-16 z-50 md:hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

          {/* Content */}
          <div className="relative bg-background border-t">
            <div className="container h-[calc(100vh-4rem)] overflow-y-auto py-6 px-4">
              {/* Mobile Search */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search courses..."
                  className="pl-10 w-full"
                />
              </div>

              {/* Mobile Navigation */}
              <nav className="space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="block py-2 text-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* Mobile Auth */}
              <div className="mt-6 pt-6 border-t space-y-4">
                {user ? (
                  <>
                    <div className="flex items-center gap-4 mb-6">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} alt={user.username} />
                        <AvatarFallback>
                          {user.username
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.username}</p>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2 py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      Dashboard
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center gap-2 py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-2 py-2 text-red-600 w-full"
                    >
                      <LogOut className="h-4 w-4" />
                      Log out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/auth/login"
                      className="w-full"
                      onClick={() => setIsOpen(false)}
                    >
                      <Button variant="ghost" className="w-full">
                        Sign in
                      </Button>
                    </Link>
                    <Link
                      to="/auth/register"
                      className="w-full"
                      onClick={() => setIsOpen(false)}
                    >
                      <Button className="w-full">Get started</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
