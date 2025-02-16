import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  BookOpen,
  FileText,
  ClipboardList,
  Award,
  Clock,
  BookMarked,
  PenTool,
  Target,
  Bell,
  FileVideo,
  Book,
  Link2,
  HelpCircle,
  ArrowRight,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useLayout } from "@/contexts/LayoutContext";
import PropTypes from "prop-types";

const BentoBox = ({ children, className }) => (
  <motion.div
    whileHover={{
      scale: 1.01,
      transition: { duration: 0.2 },
    }}
    className={cn(
      "rounded-3xl bg-white/90 dark:bg-gray-800/90 p-6 shadow-sm border border-gray-200/50 dark:border-gray-700/30",
      className
    )}
  >
    {children}
  </motion.div>
);

BentoBox.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

const ContentTypeIcon = ({ type, className }) => {
  const icons = {
    video: FileVideo,
    document: Book,
    link: Link2,
    quiz: HelpCircle,
  };
  const Icon = icons[type] || Book;
  return <Icon className={className} />;
};

ContentTypeIcon.propTypes = {
  type: PropTypes.oneOf(["video", "document", "link", "quiz"]).isRequired,
  className: PropTypes.string,
};

const ClassRoom = () => {
  const { setShowDashboardLayout } = useLayout();

  useEffect(() => {
    setShowDashboardLayout(false);
    return () => setShowDashboardLayout(true);
  }, [setShowDashboardLayout]);

  // Aggregated course statistics
  const courseStats = {
    totalModules: 8,
    publishedModules: 6,
    contentStats: {
      video: {
        count: 16,
        totalDuration: "24h 30m",
        label: "Video Lectures",
      },
      document: {
        count: 8,
        totalSize: "156 MB",
        label: "Documents",
      },
      quiz: {
        count: 4,
        totalQuestions: 40,
        label: "Quizzes",
      },
      link: {
        count: 4,
        label: "External Resources",
      },
    },
    totalContent: 32,
    completionStatus: "75%",
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50/50 via-gray-100/50 to-gray-200/50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 overflow-y-auto">
      <div className="min-h-screen p-6 max-w-7xl mx-auto">
        {/* Header - Modified with close button */}
        <div className="sticky top-0 z-10 bg-gradient-to-b from-gray-50/95 via-gray-50/95 to-gray-50/90 dark:from-gray-900/95 dark:via-gray-900/95 dark:to-gray-900/90 backdrop-blur-sm pb-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <BookMarked className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Advanced Web Development
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  <Badge variant="secondary" className="rounded-full">
                    Batch A23
                  </Badge>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Spring 2024
                  </span>
                </div>
              </div>
            </div>

            {/* Creative Close Button - Enhanced */}
            <div className="relative group">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/30 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors group-hover:border-red-200 dark:group-hover:border-red-500/30"
              >
                <XCircle className="w-5 h-5 text-gray-500 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                  Exit Class
                </span>
              </motion.div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/5 to-orange-500/5 dark:from-red-500/10 dark:to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
            </div>
          </div>
        </div>

        {/* Main Grid - Remove fixed height */}
        <div className="grid grid-cols-12 gap-5 mt-6">
          {/* Primary Actions */}
          <div className="col-span-8 grid grid-cols-2 gap-5">
            {/* Announcements - Enhanced */}
            <BentoBox className="col-span-2 bg-gradient-to-br from-blue-500/5 to-cyan-500/5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-blue-500" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Class Communication
                  </h3>
                </div>
                <Button className="gap-2 rounded-xl bg-blue-600 hover:bg-blue-700">
                  <Bell className="w-4 h-4" />
                  New Announcement
                </Button>
              </div>
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/10">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Latest Announcement
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    "Quiz 2 scheduled for next week"
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                    Posted 2 days ago
                  </p>
                </div>
              </div>
            </BentoBox>

            {/* Assignments & Quizzes - Enhanced */}
            <div className="col-span-2 grid grid-cols-2 gap-5">
              <BentoBox className="bg-gradient-to-br from-violet-500/5 to-purple-500/5">
                <div className="flex items-center gap-2 mb-4">
                  <PenTool className="w-5 h-5 text-violet-500" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Assignments
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-violet-500/5 dark:bg-violet-500/10 border border-violet-500/10">
                    <div className="flex justify-between items-center">
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        3
                      </p>
                      <Badge
                        variant="secondary"
                        className="bg-violet-500/10 text-violet-600"
                      >
                        Active
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Active Assignments
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 rounded-xl hover:bg-violet-50 dark:hover:bg-violet-500/10"
                  >
                    <PenTool className="w-4 h-4 text-violet-500" />
                    Create New Assignment
                  </Button>
                </div>
              </BentoBox>

              <BentoBox className="bg-gradient-to-br from-orange-500/5 to-yellow-500/5">
                <div className="flex items-center gap-2 mb-4">
                  <HelpCircle className="w-5 h-5 text-orange-500" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Quizzes
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-orange-500/5 dark:bg-orange-500/10 border border-orange-500/10">
                    <div className="flex justify-between items-center">
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        1
                      </p>
                      <Badge
                        variant="secondary"
                        className="bg-orange-500/10 text-orange-600"
                      >
                        Upcoming
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Scheduled Quiz</p>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-500/10"
                  >
                    <ClipboardList className="w-4 h-4 text-orange-500" />
                    Create New Quiz
                  </Button>
                </div>
              </BentoBox>
            </div>

            {/* Grading Overview - Modified with straight arrow */}
            <BentoBox className="col-span-2 bg-gradient-to-br from-green-500/5 to-emerald-500/5">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-green-500" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Pending Evaluations
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  className="group relative p-4 rounded-xl bg-green-500/5 dark:bg-green-500/10 border border-green-500/10 cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        12
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Pending Submissions
                      </p>
                    </div>
                    <PenTool className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between mt-3 text-sm text-green-600 dark:text-green-400 group-hover:text-green-700 dark:group-hover:text-green-300">
                    <span>Assignment 3</span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Grade</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="group relative p-4 rounded-xl bg-green-500/5 dark:bg-green-500/10 border border-green-500/10 cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        8
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Pending Submissions
                      </p>
                    </div>
                    <ClipboardList className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between mt-3 text-sm text-green-600 dark:text-green-400 group-hover:text-green-700 dark:group-hover:text-green-300">
                    <span>Quiz 1</span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Grade</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </motion.div>
              </div>
            </BentoBox>
          </div>

          {/* Right Sidebar */}
          <div className="col-span-4 flex flex-col gap-5">
            {/* Students List - Enhanced */}
            <BentoBox className="bg-gradient-to-br from-gray-500/5 to-slate-500/5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-500" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Enrolled Students
                  </h3>
                </div>
                <Badge
                  variant="secondary"
                  className="rounded-full bg-gray-500/10 text-gray-600"
                >
                  24 Total
                </Badge>
              </div>
              <div className="p-4 rounded-xl bg-gray-500/5 dark:bg-gray-500/10 border border-gray-500/10 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Class Attendance
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                      92%
                    </p>
                  </div>
                  <p className="text-xs text-gray-500">Last Session</p>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full justify-start gap-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-500/10"
              >
                <Users className="w-4 h-4 text-gray-500" />
                View Student List
              </Button>
            </BentoBox>

            {/* Course Content */}
            <BentoBox className="flex-1 bg-gradient-to-br from-indigo-500/5 to-blue-500/5">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Course Overview
                </h3>
              </div>

              <div className="space-y-6">
                {/* Module Progress */}
                <div className="p-4 rounded-xl bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/10">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Course Completion
                    </p>
                    <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                      {courseStats.completionStatus}
                    </span>
                  </div>
                  <Progress
                    value={75}
                    className="h-2 rounded-full bg-gray-100 dark:bg-gray-700"
                  />
                </div>

                {/* Content Type Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(courseStats.contentStats).map(
                    ([type, data]) => (
                      <div
                        key={type}
                        className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                              {data.count}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {data.label}
                            </p>
                          </div>
                          <ContentTypeIcon
                            type={type}
                            className="w-5 h-5 text-indigo-500"
                          />
                        </div>
                        {data.totalDuration && (
                          <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-2">
                            Total Duration: {data.totalDuration}
                          </p>
                        )}
                        {data.totalSize && (
                          <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-2">
                            Total Size: {data.totalSize}
                          </p>
                        )}
                        {data.totalQuestions && (
                          <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-2">
                            {data.totalQuestions} Questions
                          </p>
                        )}
                      </div>
                    )
                  )}
                </div>

                {/* Action Button */}
                <Button className="w-full gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white">
                  <BookOpen className="w-4 h-4" />
                  View Course Content
                </Button>
              </div>
            </BentoBox>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassRoom;
