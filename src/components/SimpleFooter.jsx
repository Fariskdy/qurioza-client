import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  Twitter,
  Github,
  Linkedin,
  Youtube,
} from "lucide-react";

export function SimpleFooter() {
  return (
    <footer className="border-t">
      <div className="container px-4 md:px-6 py-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo & Description */}
          <div className="space-y-4">
            <Link
              to="/"
              className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
            >
              <div className="rounded-xl bg-gradient-to-tr from-violet-500/20 to-violet-400/20 p-1.5">
                <GraduationCap className="h-6 w-6 text-violet-600" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-violet-400">
                Qurioza
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Empowering learners worldwide with industry-leading tech education
              and hands-on projects.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Learning</h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: "All Courses", href: "/courses" },
                { label: "Free Tutorials", href: "/tutorials" },
                { label: "Learning Paths", href: "/paths" },
                { label: "Student Projects", href: "/projects" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link to={href}>
                    <Button
                      variant="link"
                      className="h-auto p-0 text-muted-foreground hover:text-violet-600"
                    >
                      {label}
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Help Center", href: "/help" },
                { label: "FAQ", href: "/faq" },
                { label: "Contact Us", href: "/contact" },
                { label: "About Us", href: "/about" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link to={href}>
                    <Button
                      variant="link"
                      className="h-auto p-0 text-muted-foreground hover:text-violet-600"
                    >
                      {label}
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Terms of Service", href: "/terms" },
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Cookie Policy", href: "/cookies" },
                { label: "Accessibility", href: "/accessibility" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link to={href}>
                    <Button
                      variant="link"
                      className="h-auto p-0 text-muted-foreground hover:text-violet-600"
                    >
                      {label}
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 mt-8 border-t">
          <p className="text-sm text-muted-foreground">
            © 2024 Qurioza. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
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
                className="text-muted-foreground hover:text-violet-600 transition-colors"
              >
                <Icon className="h-4 w-4" />
                <span className="sr-only">{label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
