import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Brain, Calendar, ArrowRight, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function StudentOverview() {
  const { user } = useAuth();

  return (
    <>
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="relative rounded-2xl overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-violet-500/10"
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
                <h2 className="text-2xl font-bold">
                  Welcome back, {user?.username}!
                </h2>
                <p className="text-muted-foreground">
                  Continue your learning journey. You have 3 assignments due
                  this week.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Course Progress Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[
          {
            title: "JavaScript Fundamentals",
            progress: 65,
            lessons: "8/12",
            timeLeft: "2h 30m",
            icon: Brain,
          },
          {
            title: "React Basics",
            progress: 45,
            lessons: "5/10",
            timeLeft: "1h 45m",
            icon: Brain,
          },
          {
            title: "Web Design",
            progress: 25,
            lessons: "3/8",
            timeLeft: "3h 15m",
            icon: Brain,
          },
        ].map((course, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -5 }}
            className="group relative overflow-hidden rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-lg"
          >
            <div className="mb-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-violet-500/10 p-2">
                  <course.icon className="h-5 w-5 text-violet-600" />
                </div>
                <Badge variant="secondary" className="bg-violet-500/20">
                  In Progress
                </Badge>
              </div>
              <Heart className="h-5 w-5 text-muted-foreground/40 hover:text-red-500 transition-colors" />
            </div>

            <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <Calendar className="h-4 w-4" />
              <span>Last accessed today</span>
            </div>

            <Progress value={course.progress} className="mb-2" />
            <div className="flex justify-between text-sm text-muted-foreground mb-4">
              <span>{course.lessons} Lessons</span>
              <span>{course.timeLeft} left</span>
            </div>

            <Button className="w-full bg-violet-600 hover:bg-violet-700 group">
              Continue Learning
              <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        ))}
      </div>
    </>
  );
}
