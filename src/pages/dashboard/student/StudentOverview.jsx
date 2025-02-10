import { useAuth } from "@/contexts/AuthContext";
import { useStudentCourses } from "@/api/courses/hooks";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  Calendar,
  ArrowRight,
  Heart,
  ClipboardCheck,
  PenTool,
  GraduationCap,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function StudentOverview() {
  const { user } = useAuth();
  const { data: coursesData, isLoading: isLoadingCourses } =
    useStudentCourses();

  // Mock data for assignments
  const assignments = [
    {
      title: "JavaScript Arrays Exercise",
      course: "JavaScript Fundamentals",
      dueDate: "2024-03-20",
      status: "pending",
    },
    {
      title: "React Components Project",
      course: "React Basics",
      dueDate: "2024-03-22",
      status: "submitted",
    },
    {
      title: "CSS Layout Challenge",
      course: "Web Design",
      dueDate: "2024-03-25",
      status: "pending",
    },
  ];

  // Mock data for quizzes
  const quizzes = [
    {
      title: "JavaScript Basics Quiz",
      course: "JavaScript Fundamentals",
      deadline: "2024-03-21",
      score: null,
    },
    {
      title: "React State Management",
      course: "React Basics",
      deadline: "2024-03-23",
      score: "85%",
    },
  ];

  // Mock data for certificates
  const certificates = [
    {
      title: "HTML & CSS Mastery",
      issueDate: "2024-02-15",
      credential: "CERT-123-456",
    },
    {
      title: "JavaScript Basics",
      issueDate: "2024-01-20",
      credential: "CERT-123-457",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section - Enhanced dark mode */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="relative rounded-2xl overflow-hidden bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-violet-500/10 
                       dark:from-violet-500/20 dark:via-purple-500/20 dark:to-violet-500/20"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ backgroundSize: "200% 200%" }}
          />
          <div className="relative p-8">
            <div className="flex flex-col">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Welcome back, {user?.username}!
                </h2>
                <p className="text-muted-foreground dark:text-gray-300">
                  Continue your learning journey. You have 3 assignments due
                  this week.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Continue Learning Section - Now with real data */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Continue Learning
          </h2>
          <Button
            variant="ghost"
            className="text-violet-600 hover:text-violet-700 dark:text-violet-400 
                     dark:hover:text-violet-300 transition-colors"
            asChild
          >
            <Link to="/dashboard/courses">View All Courses</Link>
          </Button>
        </div>

        {isLoadingCourses ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <Loader2 className="h-8 w-8 animate-spin text-violet-600 dark:text-violet-400" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {coursesData?.courses
              .filter((enrollment) => enrollment.enrollmentStatus === "active")
              .slice(0, 3)
              .map((enrollment) => (
                <motion.div
                  key={enrollment.course._id}
                  whileHover={{ y: -5 }}
                  className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700/50 
                           bg-white dark:bg-gray-800/50 p-6 shadow-sm transition-all hover:shadow-lg 
                           backdrop-blur-sm"
                >
                  <div className="mb-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-violet-500/10 dark:bg-violet-500/20 p-2">
                        <Brain className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-violet-500/20 dark:bg-violet-500/30 
                                text-violet-700 dark:text-violet-300"
                      >
                        In Progress
                      </Badge>
                    </div>
                    <Heart
                      className="h-5 w-5 text-muted-foreground/40 dark:text-gray-400/40 
                               hover:text-red-500 dark:hover:text-red-400 transition-colors"
                    />
                  </div>

                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    {enrollment.course.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-gray-400 mb-3">
                    <Calendar className="h-4 w-4" />
                    <span>Batch: {enrollment.batch.name}</span>
                  </div>

                  <div className="mb-2">
                    <Progress
                      value={enrollment.progress}
                      className="h-2 dark:bg-gray-700"
                      indicatorClassName="bg-violet-600 dark:bg-violet-500"
                    />
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground dark:text-gray-400 mb-4">
                    <span>{enrollment.progress}% Complete</span>
                    <span>{enrollment.course.duration} weeks</span>
                  </div>

                  <Button
                    className="w-full bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 
                             dark:hover:bg-violet-600 dark:text-white group"
                    asChild
                  >
                    <Link to={`/dashboard/courses/${enrollment.course.slug}/learn`}>
                      Continue Learning
                      <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </motion.div>
              ))}
          </div>
        )}

        {coursesData?.courses.length === 0 && (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              No courses yet
            </h3>
            <p className="text-muted-foreground dark:text-gray-400 mt-1">
              Start your learning journey by enrolling in a course
            </p>
            <Button asChild className="mt-4">
              <Link to="/courses">Browse Courses</Link>
            </Button>
          </div>
        )}
      </section>

      {/* Activity Section - Enhanced dark mode */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Learning Activities
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Assignments Card - Simplified */}
          <Card className="border-none shadow-md bg-white dark:bg-gray-800/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-violet-100 dark:bg-violet-500/20">
                    <ClipboardCheck className="h-4 w-4 text-violet-600 dark:text-violet-300" />
                  </div>
                  <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">
                    Assignments Due
                  </CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-violet-600 hover:text-violet-700 dark:text-violet-400 
                           dark:hover:text-violet-300"
                  asChild
                >
                  <Link to="/dashboard/assignments">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {assignments.map((assignment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 hover:bg-gray-50/50 
                             dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                  >
                    <div>
                      <p className="font-medium text-sm text-gray-900 dark:text-white">
                        {assignment.title}
                      </p>
                      <p className="text-xs text-muted-foreground dark:text-gray-400">
                        Due {new Date(assignment.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className={
                        assignment.status === "submitted"
                          ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300"
                      }
                    >
                      {assignment.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quizzes Card - Simplified */}
          <Card className="border-none shadow-md bg-white dark:bg-gray-800/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-500/10">
                    <PenTool className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">
                    Recent Quizzes
                  </CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 
                           dark:hover:text-blue-300"
                  asChild
                >
                  <Link to="/dashboard/quizzes">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {quizzes.map((quiz, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 hover:bg-gray-50/50 
                             dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                  >
                    <div>
                      <p className="font-medium text-sm text-gray-900 dark:text-white">
                        {quiz.title}
                      </p>
                      <p className="text-xs text-muted-foreground dark:text-gray-400">
                        {quiz.course}
                      </p>
                    </div>
                    {quiz.score ? (
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300">
                        {quiz.score}
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 
                                 dark:hover:text-blue-300"
                      >
                        Start
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Certificates Card - Simplified */}
        <Card className="border-none shadow-md bg-white dark:bg-gray-800/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-green-100 dark:bg-green-500/20">
                  <GraduationCap className="h-4 w-4 text-green-600 dark:text-green-300" />
                </div>
                <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">
                  Certificates Earned
                </CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-green-600 hover:text-green-700 dark:text-green-400 
                         dark:hover:text-green-300"
                asChild
              >
                <Link to="/dashboard/certificates">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 md:grid-cols-2">
              {certificates.map((cert, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 hover:bg-gray-50/50 
                           dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                >
                  <div>
                    <p className="font-medium text-sm text-gray-900 dark:text-white">
                      {cert.title}
                    </p>
                    <p className="text-xs text-muted-foreground dark:text-gray-400">
                      Issued: {new Date(cert.issueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-green-600 hover:text-green-700 dark:text-green-400 
                             dark:hover:text-green-300"
                  >
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
