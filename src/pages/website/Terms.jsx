import { SimpleFooter } from "@/components/SimpleFooter";
import { Button } from "@/components/ui/button";
import { ScrollText, ArrowRight } from "lucide-react";

export function Terms() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: `By accessing and using Qurioza's platform and services, you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our services.`,
    },
    {
      title: "2. User Accounts",
      subsections: [
        {
          title: "2.1 Account Creation",
          content: [
            "You must be at least 18 years old to create an account",
            "You must provide accurate and complete information",
            "You are responsible for maintaining account security",
            "You must notify us of any unauthorized account use",
          ],
        },
        {
          title: "2.2 Account Termination",
          content: [
            "We reserve the right to suspend or terminate accounts",
            "You may delete your account at any time",
            "Account termination may result in data deletion",
          ],
        },
      ],
    },
    {
      title: "3. Course Content",
      content: [
        "All course content is protected by copyright",
        "You may not share or distribute course materials",
        "Course completion certificates are non-transferable",
        "We may update or modify course content",
        "Access to courses is subject to payment terms",
      ],
    },
    {
      title: "4. User Conduct",
      content: [
        "You agree to use the platform responsibly",
        "You will not engage in disruptive behavior",
        "You will respect intellectual property rights",
        "You will not attempt to breach platform security",
        "You will not use the platform for unauthorized purposes",
      ],
    },
    {
      title: "5. Payment Terms",
      content: `Course fees are payable in advance. Refunds are available within 30 days of purchase if you're not satisfied with the course. Some restrictions may apply.`,
    },
    {
      title: "6. Limitation of Liability",
      content: `To the maximum extent permitted by law, Qurioza shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues.`,
    },
  ];

  const lastUpdated = "January 15, 2024";

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative border-b overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-purple-50/50" />
        <div className="absolute inset-0 bg-grid-black/[0.02]" />

        <div className="container relative px-4 md:px-6 py-16 md:py-20">
          <div className="flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-violet-100/80 px-4 py-1.5 backdrop-blur-sm">
              <ScrollText className="h-4 w-4 text-violet-600" />
              <span className="text-sm font-medium text-violet-600">
                Last Updated: {lastUpdated}
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Terms of Service
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Please read these terms carefully before using our platform and
              services.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container px-4 md:px-6 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-zinc max-w-none">
            {sections.map((section, index) => (
              <div key={index} className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight mb-4">
                  {section.title}
                </h2>
                {section.content && (
                  <div className="text-muted-foreground space-y-4">
                    {Array.isArray(section.content) ? (
                      <ul className="list-disc pl-6 space-y-2">
                        {section.content.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>{section.content}</p>
                    )}
                  </div>
                )}
                {section.subsections && (
                  <div className="space-y-6 mt-6">
                    {section.subsections.map((subsection, i) => (
                      <div
                        key={i}
                        className="bg-zinc-50 rounded-lg p-6"
                      >
                        <h3 className="text-lg font-semibold mb-4">
                          {subsection.title}
                        </h3>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                          {subsection.content.map((item, j) => (
                            <li key={j}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="border-t pt-12 mt-12">
            <div className="text-center space-y-6">
              <h2 className="text-2xl font-bold tracking-tight">
                Questions About Our Terms?
              </h2>
              <p className="text-lg text-muted-foreground">
                If you have any questions about our Terms of Service, please
                contact our legal team.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  size="lg"
                  className="bg-violet-600 hover:bg-violet-700 group"
                >
                  Contact Legal Team
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button size="lg" variant="outline">
                  Download Terms
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SimpleFooter />
    </div>
  );
}
