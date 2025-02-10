import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SimpleFooter } from "@/components/SimpleFooter";
import { Mail, Phone, MapPin, ArrowRight, MessageSquare } from "lucide-react";

export function Contact() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative border-b overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-purple-50/50 dark:from-violet-950 dark:via-zinc-900 dark:to-purple-900/10" />
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />

        <div className="container relative px-4 md:px-6 py-16">
          <div className="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-violet-100/80 dark:bg-violet-900/30 px-4 py-1.5 backdrop-blur-sm">
              <MessageSquare className="h-4 w-4 text-violet-600" />
              <span className="text-sm font-medium text-violet-600 dark:text-violet-400">
                24/7 Support Available
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Get in Touch
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Have questions? We&apos;re here to help. Contact our support team
              or find answers in our help center.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section>
        <div className="container px-4 md:px-6 py-12">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="space-y-6">
              <form className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="first-name">
                      First name
                    </label>
                    <Input
                      id="first-name"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="last-name">
                      Last name
                    </label>
                    <Input id="last-name" placeholder="Enter your last name" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="email">
                    Email
                  </label>
                  <Input
                    id="email"
                    placeholder="Enter your email"
                    type="email"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="message">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Enter your message"
                    className="min-h-[150px]"
                  />
                </div>
                <Button
                  size="lg"
                  className="w-full bg-violet-600 hover:bg-violet-700"
                >
                  Send Message
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-6 lg:pl-12">
              <div className="space-y-6">
                {[
                  {
                    icon: Mail,
                    title: "Email",
                    details: ["support@qurioza.com"],
                  },
                  {
                    icon: Phone,
                    title: "Phone",
                    details: ["+1 (555) 123-4567"],
                  },
                  {
                    icon: MapPin,
                    title: "Location",
                    details: [
                      "123 Innovation Drive",
                      "San Francisco, CA 94103",
                    ],
                  },
                ].map(({ icon: Icon, title, details }) => (
                  <div key={title} className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6 text-violet-600" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold">{title}</h3>
                      {details.map((detail) => (
                        <p key={detail} className="text-muted-foreground">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <SimpleFooter />
    </div>
  );
}
