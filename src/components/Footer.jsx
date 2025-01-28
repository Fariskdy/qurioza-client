import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Twitter,
  Github,
  Linkedin,
  Youtube,
  Globe2,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-zinc-50/50 dark:bg-zinc-900/50">
      <div className="container px-4 md:px-6">
        {/* Main Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12">
          {/* Brand Section */}
          <div className="space-y-4">
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
            <p className="text-sm text-muted-foreground">
              Empowering the next generation of developers with industry-leading
              education and mentorship.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Twitter, label: "Twitter", href: "#" },
                { icon: Github, label: "GitHub", href: "#" },
                { icon: Linkedin, label: "LinkedIn", href: "#" },
                { icon: Youtube, label: "YouTube", href: "#" },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Icon className="h-4 w-4" />
                  <span className="sr-only">{label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Learning */}
          <div>
            <h3 className="font-semibold mb-4">Learning</h3>
            <ul className="space-y-2.5">
              {[
                { label: "All Courses", href: "/courses" },
                { label: "Learning Paths", href: "/paths" },
                { label: "Free Tutorials", href: "/tutorials" },
                { label: "Student Projects", href: "/projects" },
                { label: "Certificates", href: "/certificates" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link to={href}>
                    <Button
                      variant="link"
                      className="h-auto p-0 text-muted-foreground hover:text-primary"
                    >
                      {label}
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2.5">
              {[
                { label: "Help Center", href: "/help" },
                { label: "FAQ", href: "/faq" },
                { label: "Community", href: "/community" },
                { label: "Blog", href: "/blog" },
                { label: "For Enterprise", href: "/enterprise" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link to={href}>
                    <Button
                      variant="link"
                      className="h-auto p-0 text-muted-foreground hover:text-primary"
                    >
                      {label}
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2.5">
              {[
                { label: "About Us", href: "/about" },
                { label: "Contact Us", href: "/contact" },
                { label: "Terms of Service", href: "/terms" },
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Cookie Settings", href: "/cookies" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link to={href}>
                    <Button
                      variant="link"
                      className="h-auto p-0 text-muted-foreground hover:text-primary"
                    >
                      {label}
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t py-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div className="flex flex-wrap justify-center sm:justify-start gap-4">
            <span>© 2024 Qurioza. All rights reserved.</span>
            <Link to="/privacy">
              <Button variant="link" className="h-auto p-0">
                Privacy Policy
              </Button>
            </Link>
            <Link to="/terms">
              <Button variant="link" className="h-auto p-0">
                Terms of Service
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Globe2 className="h-4 w-4" />
            <select className="bg-transparent text-sm font-medium focus:outline-none focus:ring-0">
              <option>English (US)</option>
              <option>Español</option>
              <option>Français</option>
            </select>
          </div>
        </div>
      </div>
    </footer>
  );
}
