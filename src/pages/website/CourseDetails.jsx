import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Timer,
  Users,
  Star,
  CheckCircle2,
  BarChart2,
  GraduationCap,
  Globe2,
  BookOpen,
  MessageSquare,
  Award,
  Download,
  MonitorPlay,
  FileText,
  ArrowRight,
  Twitter,
  Github,
  Linkedin,
  Youtube,
} from "lucide-react";
import { SimpleFooter } from "@/components/SimpleFooter";
import { useAuth } from "@/contexts/AuthContext";

export function CourseDetails() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Mock data based on courseId
  const mockCourses = {
    "web-development-1": {
      title: "Complete Web Development Bootcamp",
      description:
        "Master modern web development with a comprehensive curriculum covering frontend, backend, and deployment.",
      instructor: {
        name: "Sarah Johnson",
        role: "Senior Web Developer",
        image:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&auto=format&fit=crop",
      },
      stats: {
        students: "15,000+",
        rating: 4.9,
        reviews: 2800,
        lastUpdated: "December 2023",
      },
      price: 599,
      level: "Beginner",
      duration: "12 weeks",
      features: [
        "60+ hours of HD video",
        "150+ coding exercises",
        "12 real-world projects",
        "Lifetime access",
        "Certificate of completion",
        "1-on-1 mentorship",
      ],
    },
    "python-data-science": {
      title: "Python for Data Science",
      description: "Master Python and Data Science fundamentals...",
      price: 499,
      // ... other data
    },
  };

  const courseData = mockCourses[courseId] || mockCourses["web-development-1"];

  const handlePurchase = () => {
    if (!user) {
      // Redirect to login with return URL
      navigate("/auth/login", {
        state: { from: location.pathname },
      });
      return;
    }
    // Handle purchase logic
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative border-b bg-zinc-50/50 dark:bg-zinc-900/50">
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
        <div className="container relative px-4 md:px-6 py-8 md:py-12">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Left Column - Course Info */}
            <div className="flex flex-col justify-center">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-violet-500/10 text-violet-600 dark:text-violet-400 hover:bg-violet-500/20">
                    Bestseller
                  </Badge>
                  <Badge variant="secondary">Most Popular</Badge>
                </div>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  {courseData.title}
                </h1>
                <p className="text-xl text-muted-foreground">
                  {courseData.description}
                </p>

                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-lg">
                        {courseData.stats.rating}
                      </span>
                      <span className="text-muted-foreground">
                        ({courseData.stats.reviews.toLocaleString()} reviews)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <span>{courseData.stats.students} enrolled</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Timer className="h-5 w-5 text-muted-foreground" />
                    <span>{courseData.duration}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={courseData.instructor.image}
                    alt={courseData.instructor.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm text-muted-foreground">Created by</p>
                    <p className="font-medium text-violet-600 dark:text-violet-400">
                      {courseData.instructor.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <Button
                    onClick={handlePurchase}
                    className="bg-violet-600 hover:bg-violet-700"
                  >
                    {user ? "Enroll Now" : "Sign in to Enroll"}
                  </Button>
                  <Button size="lg" variant="outline">
                    Try for Free
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Column - Preview Video */}
            <div>
              <div className="relative aspect-video rounded-xl overflow-hidden border shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop"
                  alt="Course preview"
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                  <Button
                    size="icon"
                    className="h-20 w-20 rounded-full bg-violet-600 hover:bg-violet-700 text-white shadow-xl"
                  >
                    <Play className="h-10 w-10" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <div className="container px-4 md:px-6 py-12">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* What You'll Learn */}
            <section className="rounded-xl border bg-card p-6 space-y-6">
              <div className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-violet-600" />
                <h2 className="text-2xl font-semibold">What you'll learn</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  "Build modern responsive websites",
                  "Master JavaScript and React",
                  "Create backend APIs with Node.js",
                  "Work with databases and authentication",
                  "Deploy applications to the cloud",
                  "Implement security best practices",
                  "Build a professional portfolio",
                  "Prepare for technical interviews",
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-[15px] leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Course Content */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-6 w-6 text-violet-600" />
                  <h2 className="text-2xl font-semibold">Course content</h2>
                </div>
                <div className="text-sm text-muted-foreground">
                  15 sections • 148 lectures • 21h 5m total length
                </div>
              </div>
              <div className="border rounded-xl divide-y">
                {[
                  {
                    title: "Getting Started with Web Development",
                    lectures: 6,
                    duration: "45min",
                    items: [
                      "Introduction to HTML",
                      "CSS Fundamentals",
                      "JavaScript Basics",
                    ],
                  },
                  {
                    title: "Advanced JavaScript Concepts",
                    lectures: 8,
                    duration: "1h 15min",
                    items: [
                      "ES6+ Features",
                      "Async Programming",
                      "Error Handling",
                    ],
                  },
                  {
                    title: "React Fundamentals",
                    lectures: 10,
                    duration: "2h 30min",
                    items: [
                      "Components and Props",
                      "State Management",
                      "Hooks in Depth",
                    ],
                  },
                ].map((section, index) => (
                  <div key={index} className="divide-y">
                    <div className="p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium flex items-center gap-2">
                          <span>
                            Section {index + 1}: {section.title}
                          </span>
                          {index === 0 && (
                            <Badge variant="secondary" className="ml-2">
                              Current
                            </Badge>
                          )}
                        </h3>
                        <span className="text-sm text-muted-foreground">
                          {section.lectures} lectures • {section.duration}
                        </span>
                      </div>
                    </div>
                    <div className="bg-zinc-50/50 dark:bg-zinc-900/50 divide-y">
                      {section.items.map((item, i) => (
                        <div
                          key={i}
                          className="p-4 pl-8 flex items-center gap-3"
                        >
                          <Play className="h-4 w-4 text-violet-600" />
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full">
                Show all sections
              </Button>
            </section>

            {/* Requirements */}
            <section className="rounded-xl border bg-card p-6 space-y-6">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-violet-600" />
                <h2 className="text-2xl font-semibold">Requirements</h2>
              </div>
              <ul className="space-y-3 text-[15px] leading-relaxed">
                <li>• Basic understanding of HTML and CSS</li>
                <li>
                  • Familiarity with any programming language is helpful but not
                  required
                </li>
                <li>• A computer with internet access</li>
                <li>• Enthusiasm to learn and build real projects</li>
              </ul>
            </section>

            {/* Description */}
            <section className="rounded-xl border bg-card p-6 space-y-6">
              <div className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-violet-600" />
                <h2 className="text-2xl font-semibold">Description</h2>
              </div>
              <div className="space-y-4 text-[15px] leading-relaxed">
                <p>
                  This comprehensive course will take you from absolute beginner
                  to professional web developer. You'll learn all the tools and
                  technologies you need to build real-world websites and web
                  applications.
                </p>
                <p>
                  Through hands-on projects and real-world examples, you'll gain
                  practical experience with:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Modern HTML5, CSS3, and JavaScript</li>
                  <li>React.js and modern frontend development</li>
                  <li>Node.js, Express, and backend development</li>
                  <li>Databases including MongoDB and SQL</li>
                  <li>Authentication, APIs, and deployment</li>
                </ul>
              </div>
            </section>

            {/* Instructor */}
            <section className="rounded-xl border bg-card p-6 space-y-6">
              <div className="flex items-center gap-2">
                <Users className="h-6 w-6 text-violet-600" />
                <h2 className="text-2xl font-semibold">Instructor</h2>
              </div>
              <div className="flex items-start gap-4">
                <img
                  src={courseData.instructor.image}
                  alt={courseData.instructor.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg">
                    {courseData.instructor.name}
                  </h3>
                  <p className="text-muted-foreground">
                    {courseData.instructor.role}
                  </p>
                  <div className="flex items-center gap-4 text-sm pt-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span>4.9 Instructor Rating</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="h-4 w-4 text-violet-600" />
                      <span>2,800+ Reviews</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-violet-600" />
                      <span>15,000+ Students</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Student Feedback */}
            <section className="rounded-xl border bg-card p-6 space-y-6">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-6 w-6 text-violet-600" />
                <h2 className="text-2xl font-semibold">Student Feedback</h2>
              </div>
              <div className="space-y-6">
                {[
                  {
                    name: "Alex Thompson",
                    rating: 5,
                    comment:
                      "This course exceeded my expectations. The projects are practical and the explanations are clear.",
                    date: "2 weeks ago",
                  },
                  {
                    name: "Maria Garcia",
                    rating: 5,
                    comment:
                      "Great course structure and content. The instructor is very knowledgeable and explains complex concepts well.",
                    date: "1 month ago",
                  },
                ].map((review, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-full bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center">
                          <span className="font-medium text-violet-600">
                            {review.name[0]}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{review.name}</p>
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? "fill-amber-400 text-amber-400"
                                      : "fill-zinc-200 text-zinc-200"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {review.date}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-[15px] leading-relaxed pl-12">
                      {review.comment}
                    </p>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  Show all reviews
                </Button>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="sticky top-20">
              <div className="rounded-xl border bg-card shadow-sm p-6 space-y-6">
                <div className="text-3xl font-bold">${courseData.price}</div>
                <Button className="w-full bg-violet-600 hover:bg-violet-700 h-11">
                  Enroll Now
                </Button>
                <div className="space-y-4">
                  {[
                    { icon: MonitorPlay, text: "60+ hours of HD video" },
                    { icon: FileText, text: "150+ coding exercises" },
                    { icon: Download, text: "Downloadable resources" },
                    { icon: Award, text: "Certificate of completion" },
                    { icon: MessageSquare, text: "1-on-1 mentorship" },
                    { icon: Globe2, text: "Lifetime access" },
                  ].map(({ icon: Icon, text }, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-violet-600" />
                      <span className="text-sm">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="border-t bg-zinc-50/50 dark:bg-zinc-900/50">
        <div className="container px-4 md:px-6 py-12 md:py-16">
          {/* Related Courses */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Related Courses</h2>
              <Button variant="ghost" className="text-violet-600">
                View All Courses
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Advanced React Development",
                  image:
                    "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800&auto=format&fit=crop",
                  price: "$499",
                  rating: 4.8,
                  students: "10,000+",
                },
                {
                  title: "Node.js Backend Mastery",
                  image:
                    "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&auto=format&fit=crop",
                  price: "$449",
                  rating: 4.9,
                  students: "8,000+",
                },
                {
                  title: "Full Stack Development",
                  image:
                    "https://images.unsplash.com/photo-1633366438669-8a782e584975?w=800&auto=format&fit=crop",
                  price: "$699",
                  rating: 4.9,
                  students: "12,000+",
                },
              ].map((course, index) => (
                <div
                  key={index}
                  className="group rounded-xl border bg-card overflow-hidden hover:shadow-lg transition-all"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-lg font-semibold text-white">
                        {course.title}
                      </h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-medium">
                          {course.rating}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {course.students} students
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-violet-600">
                        {course.price}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-violet-600"
                      >
                        Learn More
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <div className="max-w-2xl mx-auto space-y-4">
              <h2 className="text-2xl font-semibold">
                Ready to Start Your Learning Journey?
              </h2>
              <p className="text-muted-foreground">
                Join thousands of students who have already taken the first step
                towards their career goals.
              </p>
              <div className="flex items-center justify-center gap-4 pt-4">
                <Button size="lg" className="bg-violet-600 hover:bg-violet-700">
                  Enroll Now
                </Button>
                <Button size="lg" variant="outline">
                  View Curriculum
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
