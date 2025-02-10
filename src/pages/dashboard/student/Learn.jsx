import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEnrolledModules } from "@/api/modules/hooks";
import { useStudentCourses } from "@/api/courses/hooks";
import {
  ChevronLeft,
  ChevronRight,
  PlayCircle,
  FileText,
  CheckCircle,
  Lock,
  Menu,
  X,
  BookOpen,
  ClipboardList,
  PenTool,
  ChevronDown,
  SidebarClose,
  SidebarOpen,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLayout } from "@/contexts/LayoutContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CircularProgress } from "@/components/ui/circular-progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Learn() {
  const { slug: courseSlug } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [activeContentIndex, setActiveContentIndex] = useState(0);
  const { setShowDashboardLayout } = useLayout();

  const { data: studentCourses } = useStudentCourses();

  const currentEnrollment = studentCourses?.courses.find(
    (enrollment) => enrollment.course.slug === courseSlug
  );

  const { data: enrolledModules, isLoading } = useEnrolledModules(
    currentEnrollment?.course._id,
    {
      enabled: !!currentEnrollment,
    }
  );

  useEffect(() => {
    setShowDashboardLayout(false);
    return () => setShowDashboardLayout(true);
  }, [setShowDashboardLayout]);

  if (isLoading || !enrolledModules) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    );
  }

  const activeModule = enrolledModules.modules[activeModuleIndex];

  if (!activeModule) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">
            No module content available
          </p>
        </div>
      </div>
    );
  }

  const activeContent = activeModule.content[activeContentIndex];

  // Mock data for assignments and quizzes
  const assignments = [
    {
      id: 1,
      title: "React Components Exercise",
      dueDate: "2024-03-25",
      status: "pending",
    },
    {
      id: 2,
      title: "State Management Implementation",
      dueDate: "2024-03-28",
      status: "submitted",
    },
  ];

  const quizzes = [
    {
      id: 1,
      title: "React Fundamentals Quiz",
      duration: "30 mins",
      status: "pending",
    },
    {
      id: 2,
      title: "Component Lifecycle Quiz",
      duration: "20 mins",
      status: "completed",
      score: "85%",
    },
  ];

  return (
    <div className="fixed inset-0 flex bg-gray-50 dark:bg-gray-900/50">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-800/50 shadow-lg">
        {/* Content Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-800/50 backdrop-blur-sm">
          {/* Current Content Info */}
          <div>
            <h1 className="font-semibold text-xl text-gray-900 dark:text-gray-100">
              {activeContent?.title}
            </h1>
            <p className="text-sm text-muted-foreground dark:text-gray-400">
              {activeModule?.title} • {activeContent?.duration}
            </p>
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center gap-6">
            {/* Course Info */}
            <div className="flex items-center gap-4 pl-6 border-l border-gray-200 dark:border-gray-700/50">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">
                {currentEnrollment?.course.title}
              </h2>
              <div className="relative">
                <CircularProgress
                  value={currentEnrollment?.progress || 0}
                  size={40}
                  strokeWidth={3}
                  className="text-violet-500 dark:text-violet-400"
                />
                <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-violet-600 dark:text-violet-300">
                  {currentEnrollment?.progress || 0}%
                </span>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-transform duration-200"
            >
              {sidebarOpen ? (
                <SidebarClose className="h-5 w-5" />
              ) : (
                <SidebarOpen className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Content Viewer */}
        <div className="flex-1 bg-black">
          {/* Replace with actual content viewer */}
          <div className="h-full flex items-center justify-center text-white">
            Content Viewer Goes Here
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex-shrink-0 px-6 py-4 border-t border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-800/50 backdrop-blur-sm flex items-center justify-between">
          <Button
            variant="outline"
            className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            disabled={activeContentIndex === 0}
            onClick={() => setActiveContentIndex((prev) => prev - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground dark:text-gray-400">
              {activeModule.content?.length > 0
                ? `${activeContentIndex + 1} of ${activeModule.content.length}`
                : "0 of 0"}
            </span>
          </div>

          <Button
            variant="outline"
            className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            disabled={
              !activeModule.content?.length ||
              activeContentIndex === activeModule.content.length - 1
            }
            onClick={() => setActiveContentIndex((prev) => prev + 1)}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Course Content Sidebar */}
      <div
        className={cn(
          "flex-shrink-0 w-96 bg-gray-50/80 dark:bg-gray-900/50 transition-all duration-300 shadow-lg border-l border-gray-200 dark:border-gray-700/50",
          !sidebarOpen && "w-0"
        )}
      >
        {sidebarOpen && (
          <div className="h-full flex flex-col">
            <Tabs defaultValue="content" className="h-full flex flex-col">
              {/* Sticky Tabs Header */}
              <div className="sticky top-0 z-10 px-4 py-4 bg-gray-50/80 dark:bg-gray-900/50 backdrop-blur-sm">
                <TabsList className="w-full h-16 grid grid-cols-2 p-1.5 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <TabsTrigger
                    value="content"
                    className="w-full h-full flex items-center justify-center gap-2 rounded-md data-[state=active]:bg-violet-50 dark:data-[state=active]:bg-violet-500/10 data-[state=active]:text-violet-700 dark:data-[state=active]:text-violet-300 data-[state=active]:shadow-sm transition-all"
                  >
                    <BookOpen className="h-5 w-5" />
                    <span className="font-semibold text-base">
                      Course Content
                    </span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="activities"
                    className="w-full h-full flex items-center justify-center gap-2 rounded-md data-[state=active]:bg-violet-50 dark:data-[state=active]:bg-violet-500/10 data-[state=active]:text-violet-700 dark:data-[state=active]:text-violet-300 data-[state=active]:shadow-sm transition-all"
                  >
                    <ClipboardList className="h-5 w-5" />
                    <span className="font-semibold text-base">Activities</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Scrollable Content */}
              <ScrollArea className="flex-1">
                <div className="px-4">
                  {/* Course Content Tab */}
                  <TabsContent value="content" className="mt-6">
                    <Accordion type="multiple" className="space-y-1 -mx-4">
                      {enrolledModules.modules?.map((module, moduleIndex) => (
                        <AccordionItem
                          key={module._id}
                          value={`module-${module._id}`}
                          className="border-none w-full"
                        >
                          <AccordionTrigger
                            onClick={() => setActiveModuleIndex(moduleIndex)}
                            className={cn(
                              "flex items-center justify-between w-full py-4 px-6 hover:no-underline text-base",
                              moduleIndex === activeModuleIndex
                                ? "text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-500/10"
                                : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {moduleIndex + 1}.
                              </span>
                              <span className="font-medium text-lg">
                                {module.title}
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="py-1">
                            <div>
                              {module.content?.map((content, contentIndex) => (
                                <button
                                  key={content._id}
                                  onClick={() => {
                                    setActiveModuleIndex(moduleIndex);
                                    setActiveContentIndex(contentIndex);
                                  }}
                                  className={cn(
                                    "w-full flex items-center gap-3 px-6 py-3 text-sm border-l-2",
                                    contentIndex === activeContentIndex &&
                                      moduleIndex === activeModuleIndex
                                      ? "text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-500/10 border-violet-600 dark:border-violet-400"
                                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 border-transparent"
                                  )}
                                >
                                  <div className="flex items-center gap-3 flex-1">
                                    {content.type === "video" ? (
                                      <PlayCircle className="h-4 w-4 flex-shrink-0" />
                                    ) : (
                                      <FileText className="h-4 w-4 flex-shrink-0" />
                                    )}
                                    <span className="flex-1 text-left">
                                      {content.title}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      {content.duration}
                                    </span>
                                    {content.completed && (
                                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                    )}
                                  </div>
                                </button>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </TabsContent>

                  {/* Activities Tab */}
                  <TabsContent value="activities" className="mt-6">
                    <Accordion
                      type="single"
                      className="space-y-1 -mx-4"
                      defaultValue="assignments"
                    >
                      <AccordionItem
                        value="assignments"
                        className="border-none w-full"
                      >
                        <AccordionTrigger
                          className={cn(
                            "flex items-center w-full py-4 px-6 hover:no-underline text-base",
                            "data-[state=open]:bg-violet-50 dark:data-[state=open]:bg-violet-500/10",
                            "data-[state=open]:text-violet-700 dark:data-[state=open]:text-violet-300"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <ClipboardList className="h-5 w-5" />
                            <span className="font-medium text-lg">
                              Assignments
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="py-2">
                          <div className="space-y-1">
                            {assignments.map((assignment) => (
                              <button
                                key={assignment.id}
                                className="w-full flex items-center gap-3 px-6 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300"
                              >
                                <div className="flex-1 text-left">
                                  <p className="line-clamp-2 font-medium">
                                    {assignment.title}
                                  </p>
                                  <p className="text-xs text-muted-foreground dark:text-gray-400">
                                    Due: {assignment.dueDate}
                                  </p>
                                </div>
                                <span
                                  className={cn(
                                    "text-xs px-2 py-1 rounded-full",
                                    assignment.status === "submitted"
                                      ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300"
                                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300"
                                  )}
                                >
                                  {assignment.status}
                                </span>
                              </button>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem
                        value="quizzes"
                        className="border-none w-full"
                      >
                        <AccordionTrigger
                          className={cn(
                            "flex items-center w-full py-4 px-6 hover:no-underline text-base",
                            "data-[state=open]:bg-violet-50 dark:data-[state=open]:bg-violet-500/10",
                            "data-[state=open]:text-violet-700 dark:data-[state=open]:text-violet-300"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <PenTool className="h-5 w-5" />
                            <span className="font-medium text-lg">Quizzes</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="py-2">
                          <div className="space-y-1">
                            {quizzes.map((quiz) => (
                              <button
                                key={quiz.id}
                                className="w-full flex items-center gap-3 px-6 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300"
                              >
                                <div className="flex-1 text-left">
                                  <p className="line-clamp-2 font-medium">
                                    {quiz.title}
                                  </p>
                                  <p className="text-xs text-muted-foreground dark:text-gray-400">
                                    Duration: {quiz.duration}
                                  </p>
                                </div>
                                {quiz.status === "completed" ? (
                                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300">
                                    {quiz.score}
                                  </span>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                                  >
                                    Start
                                  </Button>
                                )}
                              </button>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </TabsContent>
                </div>
              </ScrollArea>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}
