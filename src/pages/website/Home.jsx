import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  Sparkles,
  Play,
  Users,
  Trophy,
  Timer,
  Code,
  Medal,
  MessageSquare,
  Check,
  Star,
  BookOpen,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useSwipeable } from "react-swipeable";
import { Link, useNavigate } from "react-router-dom";
import { Footer } from "@/components/Footer";
import {
  useFeaturedCourses,
  usePopularCourses,
  useStats,
} from "@/api/courses/hooks";

export function Home() {
  const [activeCard, setActiveCard] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const { data: featuredCourses, isLoading: featuredLoading } =
    useFeaturedCourses();
  const { data: popularCourses, isLoading: popularLoading } =
    usePopularCourses();
  const { data: stats } = useStats();

  const handleNextCard = useCallback(() => {
    setActiveCard((prev) =>
      prev === featuredCourses?.length - 1 ? 0 : prev + 1
    );
  }, [featuredCourses]);

  const handlePrevCard = useCallback(() => {
    setActiveCard((prev) =>
      prev === 0 ? featuredCourses?.length - 1 : prev - 1
    );
  }, [featuredCourses]);

  // Auto-swipe functionality
  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        handleNextCard();
      }, 5000); // Change card every 5 seconds
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, handleNextCard]);

  // Pause auto-swipe on user interaction
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      setIsAutoPlaying(false);
      handleNextCard();
    },
    onSwipedRight: () => {
      setIsAutoPlaying(false);
      handlePrevCard();
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  const handleCardChange = (index) => {
    setIsAutoPlaying(false);
    setActiveCard(index);
  };

  // Resume auto-play after user inactivity
  useEffect(() => {
    if (!isAutoPlaying) {
      const timeout = setTimeout(() => {
        setIsAutoPlaying(true);
      }, 10000); // Resume auto-play after 10 seconds of inactivity
      return () => clearTimeout(timeout);
    }
  }, [activeCard, isAutoPlaying]);

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 lg:py-20 overflow-hidden bg-gradient-to-br from-violet-50 via-white to-purple-50/50 dark:from-violet-950 dark:via-zinc-900 dark:to-purple-900/10">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] -mt-16" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-[800px] w-[800px] rotate-45 rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/30 blur-[120px] dark:from-violet-500/10 dark:to-purple-500/20" />
        </div>

        {/* Content */}
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12 lg:gap-16 z-10">
          {/* Left Column - Text Content */}
          <div className="flex-1 max-w-2xl mx-auto lg:mx-0 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-100/80 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400 hover:bg-violet-100/80">
              <Badge className="bg-violet-100/80 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400 hover:bg-violet-100/80">
                <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" />
                New: AI Development Course
              </Badge>
            </div>

            <h1 className="text-4xl/tight sm:text-5xl/tight lg:text-6xl/tight font-bold tracking-tight mb-4 sm:mb-6">
              Learn to Code
              <span className="inline-block mt-1 sm:mt-2">
                with{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 via-purple-600 to-violet-600 lg:whitespace-nowrap">
                  Industry Experts
                </span>
              </span>
            </h1>

            <p className="text-lg/relaxed text-muted-foreground mb-6 sm:mb-8 max-w-xl mx-auto lg:mx-0">
              Master modern tech skills with project-based learning. Join 100K+
              developers building their future with Qurioza.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8 sm:mb-10">
              <Button
                size="lg"
                className="w-full sm:w-auto h-12 px-8 text-base"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto h-12 px-8 text-base"
              >
                Browse Courses
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-8 text-sm">
              <div className="flex items-center gap-2.5 text-muted-foreground/90">
                <div className="p-1.5 sm:p-2 rounded-full bg-violet-100 dark:bg-violet-900/50">
                  <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-violet-600" />
                </div>
                <span className="text-xs sm:text-sm">
                  {stats?.totalStudents.toLocaleString()}+ Students
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-muted-foreground/90">
                <div className="p-1.5 sm:p-2 rounded-full bg-amber-100 dark:bg-amber-900/50">
                  <Trophy className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-600" />
                </div>
                <span className="text-xs sm:text-sm">
                  {stats?.successRate}% Success Rate
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-muted-foreground/90">
                <div className="p-1.5 sm:p-2 rounded-full bg-emerald-100 dark:bg-emerald-900/50">
                  <Timer className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600" />
                </div>
                <span className="text-xs sm:text-sm">
                  {stats?.averageRating}/5 Rating
                </span>
              </div>
            </div>
          </div>

          {/* Right Column - Stacked Course Cards */}
          <div className="lg:flex-1 w-full max-w-2xl lg:max-w-none mx-auto">
            <div className="relative w-full">
              {/* Decorative Elements */}
              {/* <div className="absolute -right-32 top-12 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[120px]" />
              <div className="absolute -left-32 bottom-12 w-[400px] h-[400px] bg-violet-500/10 rounded-full blur-[120px]" /> */}

              {/* Stacked Cards */}
              {featuredLoading ? (
                <div className="relative h-[360px] sm:h-[400px] lg:h-[440px]">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
                  </div>
                </div>
              ) : (
                <div
                  {...swipeHandlers}
                  className="relative h-[360px] sm:h-[400px] lg:h-[440px] mb-0 touch-pan-y cursor-grab active:cursor-grabbing perspective-1000"
                >
                  {featuredCourses?.map((course, index) => (
                    <div
                      key={course._id}
                      className={`absolute left-0 right-0 transition-all duration-500 ${
                        index === activeCard
                          ? "opacity-100 translate-y-0 rotate-x-0 z-30"
                          : index === activeCard - 1 ||
                            (activeCard === 0 &&
                              index === featuredCourses.length - 1)
                          ? "opacity-60 translate-y-4 -rotate-x-6 z-20 scale-[0.93] blur-[1px]"
                          : "opacity-30 translate-y-8 -rotate-x-12 z-10 scale-[0.86] blur-[2px]"
                      }`}
                    >
                      <Link to={`/courses/${course.slug}`}>
                        <Card className="relative overflow-hidden border border-violet-500/10 bg-gradient-to-b from-white via-white to-violet-50/50 dark:from-zinc-900 dark:via-zinc-900 dark:to-violet-900/5 shadow-2xl hover:shadow-violet-500/10 transition-all group">
                          <div className="relative">
                            <img
                              src={course.image}
                              alt={course.title}
                              className="w-full h-48 object-cover brightness-[1.02] group-hover:scale-[1.02] transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            <div className="absolute top-4 left-4 flex gap-2">
                              <Badge className="bg-white/95 text-violet-600 backdrop-blur-sm">
                                {course.level}
                              </Badge>
                              {course.stats.enrolledStudents > 1000 && (
                                <Badge className="bg-amber-500/90 text-white backdrop-blur-sm">
                                  Bestseller
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="p-6 space-y-4">
                            <div>
                              <h3 className="text-xl font-semibold mb-2 group-hover:text-violet-600 transition-colors line-clamp-2">
                                {course.title}
                              </h3>
                              <p className="text-muted-foreground text-sm line-clamp-2">
                                {course.description}
                              </p>
                            </div>

                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1.5">
                                <Timer className="h-4 w-4 text-violet-500" />
                                <span>{course.duration} weeks</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Users className="h-4 w-4 text-violet-500" />
                                <span>
                                  {course.stats.enrolledStudents.toLocaleString()}
                                  + students
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                              <div className="flex items-center gap-2">
                                <div className="flex items-center">
                                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                  <span className="ml-1 font-medium">
                                    {course.stats.rating.toFixed(1)}
                                  </span>
                                </div>
                                <span className="text-muted-foreground">
                                  ({course.stats.reviewCount} reviews)
                                </span>
                              </div>
                              <div className="font-semibold text-lg">
                                ₹{course.price}
                              </div>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    </div>
                  ))}
                </div>
              )}

              {/* Navigation Dots */}
              <div className="flex justify-center gap-2 mt-4">
                {featuredCourses?.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleCardChange(index)}
                    className={`w-2 h-2 rounded-full transition-all ring-1 ring-violet-500/20 ${
                      index === activeCard
                        ? "bg-violet-600 w-8 ring-violet-500/50"
                        : "bg-violet-100 hover:bg-violet-200 dark:bg-violet-800/50 dark:hover:bg-violet-700/50"
                    }`}
                    aria-label={`View course ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-violet-50 via-white to-purple-50/50 dark:from-violet-950 dark:via-zinc-900 dark:to-purple-900/10">
        <div className="container px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Everything you need to start coding
            </h2>
            <p className="text-lg text-muted-foreground">
              Our platform provides all the tools and resources you need to
              begin your coding journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: Trophy,
                title: "Project-Based Learning",
                description:
                  "Learn by building real-world projects that you can add to your portfolio",
              },
              {
                icon: Users,
                title: "Expert Mentorship",
                description:
                  "Get guidance from industry professionals with years of experience",
              },
              {
                icon: Timer,
                title: "Flexible Learning",
                description:
                  "Learn at your own pace with lifetime access to all course materials",
              },
              {
                icon: Code,
                title: "Interactive Coding",
                description:
                  "Practice coding with interactive exercises and real-time feedback",
              },
              {
                icon: Medal,
                title: "Certificates",
                description:
                  "Earn industry-recognized certificates upon course completion",
              },
              {
                icon: MessageSquare,
                title: "Community Support",
                description:
                  "Join a community of learners and get help when you need it",
              },
            ].map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="group relative overflow-hidden rounded-lg border bg-card p-6 hover:shadow-lg transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                <div className="relative">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/50">
                    <Icon className="h-6 w-6 text-violet-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-violet-600 transition-colors">
                    {title}
                  </h3>
                  <p className="text-muted-foreground">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Courses Section */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-16">
            <div className="max-w-xl">
              <h2 className="text-3xl font-bold tracking-tight mb-2">
                Most Popular Learning Paths
              </h2>
              <p className="text-lg text-muted-foreground">
                Join thousands of students already learning with us
              </p>
            </div>
            <Button
              variant="outline"
              className="border-violet-200 dark:border-violet-800/50 hover:bg-violet-50 dark:hover:bg-violet-900/50"
              onClick={() => navigate("/courses")}
            >
              Browse All Courses
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          {popularLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse h-[440px]">
                  <div className="h-52 bg-zinc-200 dark:bg-zinc-800" />
                  <div className="p-5 space-y-4">
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
                    <div className="h-16 bg-zinc-200 dark:bg-zinc-800 rounded" />
                    <div className="flex gap-4">
                      <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-20" />
                      <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-20" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {popularCourses?.courses.map((course) => (
                <Link key={course._id} to={`/courses/${course.slug}`}>
                  <Card className="group h-[440px] flex flex-col overflow-hidden hover:shadow-lg transition-all duration-300">
                    {/* Image Section */}
                    <div className="relative h-52">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                      {course.stats.enrolledStudents > 1000 && (
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-amber-500 text-white">
                            Bestseller
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-col flex-grow p-5">
                      {/* Course Info */}
                      <div className="mb-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <Badge
                            variant="secondary"
                            className="bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400"
                          >
                            {course.level}
                          </Badge>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Timer className="h-4 w-4" />
                            {course.duration} weeks
                          </div>
                        </div>
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-violet-600 transition-colors">
                          {course.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                          {course.description}
                        </p>
                      </div>

                      {/* Skills Section */}
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {course.features
                            ?.slice(0, 3)
                            .map((feature, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                              >
                                {feature}
                              </Badge>
                            ))}
                        </div>
                      </div>

                      {/* Stats Section - Push to bottom with flex-grow */}
                      <div className="mt-auto pt-4 border-t">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                              <span className="ml-1 font-medium">
                                {course.stats.rating.toFixed(1)}
                              </span>
                              <span className="text-sm text-muted-foreground ml-1">
                                ({course.stats.reviewCount.toLocaleString()})
                              </span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {course.stats.enrolledStudents.toLocaleString()}+
                              students
                            </span>
                          </div>
                          <div className="text-lg font-semibold text-violet-600">
                            ₹{course.price}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Student Success Section */}
      <section className="py-20 bg-gradient-to-br from-violet-50 via-white to-purple-50/50 dark:from-violet-950 dark:via-zinc-900 dark:to-purple-900/10">
        <div className="container px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Student Success Stories
            </h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of students who have transformed their careers
              through our courses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Chen",
                role: "Full Stack Developer at Google",
                image:
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2787&auto=format&fit=crop",
                content:
                  "The web development bootcamp was a game-changer. I went from knowing basic HTML to landing my dream job in just 6 months.",
                course: "Web Development Bootcamp",
              },
              {
                name: "Michael Park",
                role: "Data Scientist at Netflix",
                image:
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2787&auto=format&fit=crop",
                content:
                  "The Python course gave me a solid foundation in data science. The projects were practical and the mentorship was invaluable.",
                course: "Python for Data Science",
              },
              {
                name: "Emily Rodriguez",
                role: "Cloud Architect at AWS",
                image:
                  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2787&auto=format&fit=crop",
                content:
                  "From a complete beginner to passing my AWS certification, this course provided everything I needed to succeed.",
                course: "AWS Cloud Practitioner",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="relative group rounded-2xl border bg-card p-6 hover:shadow-lg transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <blockquote className="text-muted-foreground mb-4">
                  "{testimonial.content}"
                </blockquote>
                <div className="flex items-center gap-2 text-sm">
                  <Badge
                    variant="secondary"
                    className="bg-violet-100/80 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400 hover:bg-violet-100/80"
                  >
                    {testimonial.course}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mt-20">
            {[
              {
                number: "95%",
                label: "Employment Rate",
                description: "Of graduates find jobs within 6 months",
              },
              {
                number: "300%",
                label: "Salary Increase",
                description: "Average salary boost after completion",
              },
              {
                number: "50K+",
                label: "Graduates",
                description: "Successfully completed our courses",
              },
              {
                number: "4.9/5",
                label: "Student Rating",
                description: "Average rating from our students",
              },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-violet-600 mb-2">
                  {stat.number}
                </div>
                <div className="font-medium mb-1">{stat.label}</div>
                <div className="text-sm text-muted-foreground">
                  {stat.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-purple-50/50 dark:from-violet-950 dark:via-zinc-900 dark:to-purple-900/10" />
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/30 blur-[100px] dark:from-violet-500/10 dark:to-purple-500/20" />

        <div className="relative container px-4 md:px-6">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-violet-100/80 dark:bg-violet-900/30 px-4 py-1.5 mb-8 backdrop-blur-sm">
              <Badge className="bg-violet-100/80 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400 hover:bg-violet-100/80">
                Limited Time Offer
              </Badge>
            </div>

            <h2 className="text-4xl font-bold tracking-tight mb-4">
              Start Your Coding Journey Today
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
              Get unlimited access to all our courses, projects, and resources.
              Join thousands of successful graduates who transformed their
              careers through Qurioza.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button
                size="lg"
                className="h-12 px-8 bg-violet-600 hover:bg-violet-700 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-400/0 via-violet-400/50 to-violet-400/0 opacity-0 group-hover:opacity-20 transition-opacity transform translate-x-[-100%] group-hover:translate-x-[100%] duration-1000" />
                Get Started for Free
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-8 border-violet-200 dark:border-violet-800/50 hover:bg-violet-50 dark:hover:bg-violet-900/50"
              >
                View Pricing
              </Button>
            </div>

            <div className="flex items-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" />
                14-day free trial
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" />
                Cancel anytime
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
