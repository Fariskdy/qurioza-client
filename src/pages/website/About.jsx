import { Button } from "@/components/ui/button";
import { SimpleFooter } from "@/components/SimpleFooter";
import {
  Users,
  GraduationCap,
  Target,
  Globe2,
  Award,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative border-b overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-purple-50/50 dark:from-violet-950 dark:via-zinc-900 dark:to-purple-900/10" />
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
        <div className="absolute -left-20 top-0 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/30 blur-[100px] dark:from-violet-500/10 dark:to-purple-500/20" />
        <div className="absolute -right-20 bottom-0 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/30 blur-[100px] dark:from-violet-500/10 dark:to-purple-500/20" />

        <div className="container relative px-4 md:px-6 py-20 md:py-28">
          <div className="flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-violet-100/80 dark:bg-violet-900/30 px-4 py-1.5 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-violet-600" />
              <span className="text-sm font-medium text-violet-600 dark:text-violet-400">
                Transforming Tech Education
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Empowering the Next Generation of{" "}
              <span className="relative">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-violet-400">
                  Tech Leaders
                </span>
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-violet-600/0 via-violet-600/50 to-violet-600/0" />
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              We're on a mission to provide world-class technology education
              that's accessible, affordable, and focused on real-world skills.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container px-4 md:px-6 py-12 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Active Students", value: "100K+", icon: Users },
            {
              label: "Course Completion Rate",
              value: "94%",
              icon: CheckCircle2,
            },
            { label: "Total Courses", value: "500+", icon: BookOpen },
            { label: "Countries Reached", value: "150+", icon: Globe2 },
          ].map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="group relative rounded-xl border bg-card p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
              <div className="relative space-y-2 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-violet-600" />
                </div>
                <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-violet-400">
                  {value}
                </div>
                <div className="text-sm text-muted-foreground">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission Section */}
      <section className="relative border-y overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-purple-50/50 dark:from-violet-950 dark:via-zinc-900 dark:to-purple-900/10" />
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />

        <div className="container relative px-4 md:px-6 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-violet-100/80 dark:bg-violet-900/30 px-4 py-1.5 backdrop-blur-sm">
                <Target className="h-4 w-4 text-violet-600" />
                <span className="text-sm font-medium text-violet-600 dark:text-violet-400">
                  Our Mission
                </span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight">
                Revolutionizing Tech Education
              </h2>
              <p className="text-lg text-muted-foreground">
                At Qurioza, we believe that quality education should be
                accessible to everyone. Our platform combines expert-led
                instruction, hands-on projects, and a supportive community to
                create an unparalleled learning experience.
              </p>
              <div className="space-y-4">
                {[
                  "Industry-relevant curriculum",
                  "Expert instructors",
                  "Hands-on learning approach",
                  "Career-focused outcomes",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors"
                  >
                    <div className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 p-1">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-purple-500/20 blur-[32px] -z-10" />
              <div className="grid grid-cols-2 gap-4">
                {[
                  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=800&auto=format&fit=crop",
                  "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=800&auto=format&fit=crop",
                  "https://images.unsplash.com/photo-1513258496099-48168024aec0?w=800&h=800&auto=format&fit=crop",
                  "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=800&auto=format&fit=crop",
                ].map((src, index) => (
                  <div
                    key={index}
                    className={`relative rounded-xl overflow-hidden group ${
                      index % 2 === 0 ? "translate-y-4" : "-translate-y-4"
                    }`}
                  >
                    <img
                      src={src}
                      alt={`About us ${index + 1}`}
                      className="object-cover w-full h-48 group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="container px-4 md:px-6 py-12 md:py-20">
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-violet-100/80 dark:bg-violet-900/30 px-4 py-1.5 backdrop-blur-sm">
            <Award className="h-4 w-4 text-violet-600" />
            <span className="text-sm font-medium text-violet-600 dark:text-violet-400">
              Our Values
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight">
            Guiding Principles
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            These core values guide everything we do at Qurioza, from course
            creation to student support.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: Target,
              title: "Excellence",
              description:
                "We strive for excellence in everything we do, from course quality to student support.",
            },
            {
              icon: Users,
              title: "Community",
              description:
                "We believe in the power of community learning and peer support.",
            },
            {
              icon: GraduationCap,
              title: "Innovation",
              description:
                "We continuously innovate our teaching methods and curriculum.",
            },
          ].map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group relative rounded-xl border bg-card p-6 space-y-4 hover:shadow-lg transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-violet-600" />
                </div>
                <h3 className="text-xl font-semibold mt-4">{title}</h3>
                <p className="text-muted-foreground">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative border-t overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-purple-50/50 dark:from-violet-950 dark:via-zinc-900 dark:to-purple-900/10" />
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />

        <div className="container relative px-4 md:px-6 py-12 md:py-20">
          <div className="text-center space-y-6 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-violet-100/80 dark:bg-violet-900/30 px-4 py-1.5 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-violet-600" />
              <span className="text-sm font-medium text-violet-600 dark:text-violet-400">
                Join Our Community
              </span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">
              Ready to Start Your Journey?
            </h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of students who are already learning and growing
              with Qurioza.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                size="lg"
                className="bg-violet-600 hover:bg-violet-700 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-400/0 via-violet-400/50 to-violet-400/0 opacity-0 group-hover:opacity-20 transition-opacity transform translate-x-[-100%] group-hover:translate-x-[100%] duration-1000" />
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="group hover:border-violet-500/50"
              >
                View Courses
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <SimpleFooter />
    </div>
  );
}
