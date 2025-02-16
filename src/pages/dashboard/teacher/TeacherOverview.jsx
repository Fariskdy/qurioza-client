import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Users,
  GraduationCap,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  BarChart2,
  BrainCircuit,
  PenTool,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useTeacherCourses } from "@/api/courses/hooks";
import { useTeacherQuizStats } from "@/api/quizzes";
import { useBatchAssignmentStats } from "@/api/assignments/hooks";

export default function TeacherOverview() {
  const {
    data: coursesData,
    isLoading: coursesLoading,
    error: coursesError,
  } = useTeacherCourses();
  const {
    data: quizStats,
    isLoading: quizLoading,
    error: quizError,
  } = useTeacherQuizStats();
  const {
    data: assignmentStats,
    isLoading: assignmentLoading,
    error: assignmentError,
  } = useBatchAssignmentStats();

  const isLoading = coursesLoading || quizLoading || assignmentLoading;
  const error = coursesError || quizError || assignmentError;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-lg font-medium">Error loading dashboard data</p>
        <p className="text-muted-foreground">{error.message}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  // Calculate overview statistics
  const totalStudents = coursesData?.courses.reduce(
    (sum, item) => sum + item.batch.enrollmentCount,
    0
  );
  const activeBatches = coursesData?.courses.filter(
    (item) => item.batch.status === "ongoing"
  ).length;
  const completionRate = Math.round(
    (coursesData?.courses.filter((item) => item.batch.status === "completed")
      .length /
      coursesData?.courses.length) *
      100
  );

  // Quick stats cards data
  const quickStats = [
    {
      title: "Active Batches",
      value: activeBatches || 0,
      icon: BookOpen,
      description: "Currently ongoing batches",
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-500/10",
    },
    {
      title: "Total Students",
      value: totalStudents || 0,
      icon: Users,
      description: "Enrolled across all batches",
      color: "text-violet-600 dark:text-violet-400",
      bg: "bg-violet-50 dark:bg-violet-500/10",
    },
    {
      title: "Completion Rate",
      value: `${completionRate || 0}%`,
      icon: GraduationCap,
      description: "Average batch completion",
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-50 dark:bg-green-500/10",
    },
  ];

  // Recent activity cards
  const recentBatches = coursesData?.courses
    .filter((item) => item.batch.status === "ongoing")
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
      {/* Header Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Teacher Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Overview of your teaching activities
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickStats.map((stat, index) => (
          <Card
            key={index}
            className="bg-white/90 dark:bg-gray-800/90 border-gray-200/50 dark:border-gray-700/30"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {stat.description}
                  </p>
                </div>
                <div
                  className={cn(
                    "p-3 rounded-xl",
                    stat.color,
                    stat.bg,
                    "border border-gray-200/50 dark:border-gray-700/30"
                  )}
                >
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Assessment Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Assignments Overview */}
        <Card className="bg-white/90 dark:bg-gray-800/90 border-gray-200/50 dark:border-gray-700/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PenTool className="w-5 h-5 text-violet-500" />
                Assignment Overview
              </div>
              <Button variant="ghost" size="sm" className="gap-2" asChild>
                <Link to="/dashboard/assignments">
                  View All
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-violet-50 dark:bg-violet-500/10 rounded-lg">
                  <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">
                    {assignmentStats?.active || 0}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Active
                  </p>
                </div>
                <div className="text-center p-3 bg-orange-50 dark:bg-orange-500/10 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {assignmentStats?.pendingGrading || 0}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Need Grading
                  </p>
                </div>
                <div className="text-center p-3 bg-green-50 dark:bg-green-500/10 rounded-lg">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {assignmentStats?.completed || 0}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Completed
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quizzes Overview */}
        <Card className="bg-white/90 dark:bg-gray-800/90 border-gray-200/50 dark:border-gray-700/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-indigo-500" />
                Quiz Overview
              </div>
              <Button variant="ghost" size="sm" className="gap-2" asChild>
                <Link to="/dashboard/quizzes">
                  View All
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg">
                  <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    {quizStats?.totalActive || 0}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Active
                  </p>
                </div>
                <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-500/10 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    {quizStats?.totalPending || 0}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Need Review
                  </p>
                </div>
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {quizStats?.averageScore || 0}%
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Avg. Score
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Batches */}
      <Card className="bg-white/90 dark:bg-gray-800/90 border-gray-200/50 dark:border-gray-700/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              Active Batches
            </div>
            <Button variant="ghost" size="sm" className="gap-2" asChild>
              <Link to="/dashboard/classes">
                View All
                <ChevronRight className="w-4 h-4" />
              </Link>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentBatches?.map((item) => (
              <div
                key={item.batch.id}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-200/50 dark:border-gray-700/30 
                           hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">
                      {item.batch.name}
                    </h3>
                    <Badge
                      variant="secondary"
                      className="bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400"
                    >
                      {item.batch.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {item.course.title}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 
                             dark:text-blue-400 dark:hover:bg-blue-500/10"
                  asChild
                >
                  <Link to={`/dashboard/batches/${item.batch.id}/classroom`}>
                    Enter Classroom
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            ))}

            {/* Empty State */}
            {(!recentBatches || recentBatches.length === 0) && (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No active batches found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
