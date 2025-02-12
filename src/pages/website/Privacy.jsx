import { SimpleFooter } from "@/components/SimpleFooter";
import { Button } from "@/components/ui/button";
import { Shield, ArrowRight } from "lucide-react";

export function Privacy() {
  const sections = [
    {
      title: "Introduction",
      content: `This Privacy Policy explains how Qurioza ("we," "us," or "our") collects, uses, and protects your personal information when you use our platform. By using our services, you agree to the collection and use of information in accordance with this policy.`,
    },
    {
      title: "Information We Collect",
      subsections: [
        {
          title: "Personal Information",
          content: [
            "Name and contact details",
            "Email address",
            "Billing information",
            "Profile information",
            "Educational background",
          ],
        },
        {
          title: "Usage Data",
          content: [
            "Learning progress and course completion data",
            "Quiz and assessment results",
            "Course interaction statistics",
            "Time spent on platform",
            "Device and browser information",
          ],
        },
      ],
    },
    {
      title: "How We Use Your Information",
      content: [
        "To provide and maintain our service",
        "To notify you about changes to our service",
        "To provide customer support",
        "To gather analysis or valuable information to improve our service",
        "To monitor the usage of our service",
        "To detect, prevent and address technical issues",
        "To provide you with news, special offers and general information",
      ],
    },
    {
      title: "Data Security",
      content: `We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.`,
    },
    {
      title: "Third-Party Services",
      content: `We may employ third-party companies and individuals to facilitate our service, provide service-related services, or assist us in analyzing how our service is used. These third parties have access to your personal information only to perform these tasks on our behalf.`,
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
              <Shield className="h-4 w-4 text-violet-600" />
              <span className="text-sm font-medium text-violet-600">
                Last Updated: {lastUpdated}
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Privacy Policy
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              We&apos;re committed to protecting your privacy and ensuring the
              security of your personal information.
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
                Questions About Our Privacy Policy?
              </h2>
              <p className="text-lg text-muted-foreground">
                If you have any questions about our Privacy Policy, please don&apos;t
                hesitate to contact us.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  size="lg"
                  className="bg-violet-600 hover:bg-violet-700 group"
                >
                  Contact Privacy Team
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button size="lg" variant="outline">
                  Download Privacy Policy
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
