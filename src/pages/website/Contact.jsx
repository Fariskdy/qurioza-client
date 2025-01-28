import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SimpleFooter } from "@/components/SimpleFooter";
import {
  Mail,
  MessageSquare,
  Phone,
  MapPin,
  Clock,
  ArrowRight,
  Globe2,
  MessagesSquare,
  Headphones,
  Building2,
} from "lucide-react";

export function Contact() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative border-b overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-purple-50/50 dark:from-violet-950 dark:via-zinc-900 dark:to-purple-900/10" />
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
        <div className="absolute -left-20 top-0 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/30 blur-[100px] dark:from-violet-500/10 dark:to-purple-500/20" />

        <div className="container relative px-4 md:px-6 py-16 md:py-24">
          <div className="flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-violet-100/80 dark:bg-violet-900/30 px-4 py-1.5 backdrop-blur-sm">
              <MessageSquare className="h-4 w-4 text-violet-600" />
              <span className="text-sm font-medium text-violet-600 dark:text-violet-400">
                24/7 Support Available
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Get in Touch
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Have questions? We're here to help. Contact our support team or
              find answers in our help center.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="container px-4 md:px-6 py-12 md:py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: Headphones,
              title: "Customer Support",
              description: "Get help with your courses and learning experience",
              action: "Chat with Support",
              items: ["24/7 Live Chat", "Email Support", "Help Center"],
            },
            {
              icon: Building2,
              title: "Business Inquiries",
              description: "Partner with us or explore enterprise solutions",
              action: "Contact Sales",
              items: ["Enterprise Plans", "Partnerships", "Custom Solutions"],
            },
            {
              icon: MessagesSquare,
              title: "Media Inquiries",
              description: "Get in touch for media and press related queries",
              action: "Media Kit",
              items: ["Press Releases", "Media Assets", "Brand Guidelines"],
            },
          ].map(({ icon: Icon, title, description, action, items }) => (
            <div
              key={title}
              className="group relative rounded-xl border bg-card p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
              <div className="relative space-y-4">
                <div className="w-12 h-12 rounded-full bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-violet-600" />
                </div>
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="text-muted-foreground">{description}</p>
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm">
                      <ArrowRight className="h-4 w-4 text-violet-600" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button
                  variant="ghost"
                  className="group-hover:text-violet-600 transition-colors p-0"
                >
                  {action}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="border-t">
        <div className="container px-4 md:px-6 py-12 md:py-20">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tight">
                  Send us a Message
                </h2>
                <p className="text-muted-foreground">
                  Fill out the form below and we'll get back to you as soon as
                  possible.
                </p>
              </div>
              <form className="space-y-6">
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
                  <label className="text-sm font-medium" htmlFor="subject">
                    Subject
                  </label>
                  <Input id="subject" placeholder="Enter message subject" />
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
                <Button size="lg" className="bg-violet-600 hover:bg-violet-700">
                  Send Message
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8 lg:pl-12">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tight">
                  Contact Information
                </h2>
                <p className="text-muted-foreground">
                  Find us at our offices or reach out through our various
                  channels.
                </p>
              </div>
              <div className="space-y-6">
                {[
                  {
                    icon: Mail,
                    title: "Email",
                    details: ["support@qurioza.com", "business@qurioza.com"],
                  },
                  {
                    icon: Phone,
                    title: "Phone",
                    details: ["+1 (555) 123-4567", "+1 (555) 765-4321"],
                  },
                  {
                    icon: MapPin,
                    title: "Location",
                    details: [
                      "123 Innovation Drive",
                      "San Francisco, CA 94103",
                      "United States",
                    ],
                  },
                  {
                    icon: Clock,
                    title: "Business Hours",
                    details: [
                      "Monday - Friday: 9:00 AM - 6:00 PM PST",
                      "Weekend: Closed",
                    ],
                  },
                  {
                    icon: Globe2,
                    title: "Global Offices",
                    details: ["London", "Singapore", "Sydney"],
                  },
                ].map(({ icon: Icon, title, details }) => (
                  <div key={title} className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6 text-violet-600" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold">{title}</h3>
                      {details.map((detail) => (
                        <p
                          key={detail}
                          className="text-sm text-muted-foreground"
                        >
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
