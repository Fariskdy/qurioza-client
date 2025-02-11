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
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ModernVideoPlayer } from "@/components/ModernVideoPlayer";
import "./VideoPlayer.css";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/axios";

export default function Learn() {
  const { slug: courseSlug } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [activeContentIndex, setActiveContentIndex] = useState(0);
  const { setShowDashboardLayout } = useLayout();

  // Move these hooks to component level
  const [secureUrl, setSecureUrl] = useState(null);
  const [isLoadingUrl, setIsLoadingUrl] = useState(true);
  const [error, setError] = useState(null);

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

  const activeModule = enrolledModules?.modules[activeModuleIndex];
  const activeContent = activeModule?.content[activeContentIndex];

  // Update secure URL query with better loading state management
  const { data: secureUrlData, isLoading: isLoadingSecureUrl } = useQuery({
    queryKey: ["secureUrl", activeContent?._id],
    queryFn: async () => {
      if (!activeContent || activeContent.type !== "video") return null;
      const response = await api.get(
        `/courses/${currentEnrollment?.course._id}/modules/${activeModule._id}/content/${activeContent._id}/secure-view`
      );
      return response.data;
    },
    enabled:
      !!activeContent &&
      activeContent.type === "video" &&
      !!currentEnrollment?.course._id,
    onSuccess: (data) => {
      if (data?.url) {
        setSecureUrl(data.url);
        setIsLoadingUrl(false);
      }
    },
    onError: (err) => {
      console.error("Error fetching secure URL:", err);
      setError(err.message);
      setIsLoadingUrl(false);
    },
  });

  // Reset states when content changes
  useEffect(() => {
    if (activeContent?.type === "video") {
      setIsLoadingUrl(true);
      setError(null);
      if (secureUrlData?.url) {
        setSecureUrl(secureUrlData.url);
        setIsLoadingUrl(false);
      }
    }
  }, [activeContent, secureUrlData]);

  useEffect(() => {
    setShowDashboardLayout(false);
    return () => setShowDashboardLayout(true);
  }, [setShowDashboardLayout]);

  // Add this function near the other state declarations in Learn component
  const handleReady = () => {
    setIsLoadingUrl(false);
    setError(null);
  };

  const handleVideoError = (error) => {
    console.error("Video error:", error);
    setError(error?.message || "Failed to load video");
    setIsLoadingUrl(false);
  };

  if (isLoading || !enrolledModules) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    );
  }

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

  const renderContent = () => {
    if (!activeContent) return null;

    switch (activeContent.type) {
      case "video":
        if (isLoadingSecureUrl || isLoadingUrl) {
          return (
            <div className="flex items-center justify-center h-full bg-zinc-900">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                <p className="text-white text-sm">Loading video...</p>
              </div>
            </div>
          );
        }

        if (error || !secureUrlData?.url) {
          return (
            <div className="flex items-center justify-center h-full bg-zinc-900 text-white">
              <div className="text-center">
                <p className="mb-2">
                  Error loading video: {error || "No video URL available"}
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setError(null);
                    setIsLoadingUrl(true);
                  }}
                >
                  Retry
                </Button>
              </div>
            </div>
          );
        }

        return (
          <div className="relative w-full h-full bg-black">
            <div
              className={cn(
                "absolute inset-0 transition-all duration-300 ease-in-out",
                // Add padding when sidebar is open for larger screens
                sidebarOpen ? "lg:pl-0" : "lg:pl-0"
              )}
            >
              <ModernVideoPlayer
                src={secureUrlData.url}
                poster={activeContent.thumbnail}
                title={activeContent.title}
                onReady={handleReady}
                onError={handleVideoError}
                className={cn(
                  "w-full h-full",
                  sidebarOpen ? "lg:pl-0" : "lg:pl-0"
                )}
              />
            </div>
          </div>
        );

      case "document":
        return (
          <div className="flex items-center justify-center h-full bg-zinc-900 text-white">
            Document Viewer Coming Soon
          </div>
        );

      case "quiz":
        return (
          <div className="flex items-center justify-center h-full bg-zinc-900 text-white">
            Quiz Interface Coming Soon
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-full bg-zinc-900 text-white">
            Content type not supported
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 flex bg-gray-50 dark:bg-gray-900/50">
      {/* Main Content Area */}
      <div
        className={cn(
          "flex-1 flex flex-col bg-white dark:bg-gray-800/50 shadow-lg transition-all duration-300",
          // Add margin when sidebar is open
          sidebarOpen ? "lg:mr-[400px]" : "lg:mr-0"
        )}
      >
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
        <div className="flex-1 bg-black overflow-hidden">{renderContent()}</div>

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
          "fixed top-0 right-0 h-full bg-background border-l border-border transition-all duration-300 ease-in-out",
          sidebarOpen ? "w-[400px]" : "w-0"
        )}
      >
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="h-full"
          >
            <Tabs defaultValue="content" className="h-full">
              {/* Sticky Tabs Header */}
              <div className="sticky top-0 z-10 bg-background border-b border-border">
                <div className="px-4 py-3">
                  <TabsList className="w-full">
                    <TabsTrigger value="content" className="flex-1">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        <span>Content</span>
                      </div>
                    </TabsTrigger>
                    <TabsTrigger value="activities" className="flex-1">
                      <div className="flex items-center gap-2">
                        <ClipboardList className="h-4 w-4" />
                        <span>Activities</span>
                      </div>
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>

              {/* Tab Content */}
              <div className="h-[calc(100%-56px)] overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="px-4 py-3">
                    {/* Course Content Tab */}
                    <TabsContent value="content" className="mt-0">
                      <Accordion type="multiple" className="space-y-2">
                        {enrolledModules.modules?.map((module, moduleIndex) => (
                          <AccordionItem
                            key={module._id}
                            value={`module-${module._id}`}
                            className="border border-module-border rounded-lg overflow-hidden transition-colors"
                          >
                            <AccordionTrigger
                              className={cn(
                                "px-4 py-3 hover:no-underline transition-colors",
                                moduleIndex === activeModuleIndex
                                  ? "bg-module-active"
                                  : "hover:bg-module-hover"
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-module-primary text-module-text font-medium">
                                  {moduleIndex + 1}
                                </div>
                                <div className="flex flex-col items-start">
                                  <span className="text-sm font-medium text-foreground">
                                    {module.title}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {module.content?.length || 0} lessons
                                  </span>
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="bg-module-secondary">
                              <div className="p-2 space-y-1">
                                {module.content?.map(
                                  (content, contentIndex) => (
                                    <button
                                      key={content._id}
                                      onClick={() => {
                                        setActiveModuleIndex(moduleIndex);
                                        setActiveContentIndex(contentIndex);
                                      }}
                                      className={cn(
                                        "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors",
                                        contentIndex === activeContentIndex &&
                                          moduleIndex === activeModuleIndex
                                          ? "bg-module-active shadow-sm"
                                          : "hover:bg-module-hover"
                                      )}
                                    >
                                      <div className="flex items-center gap-3 flex-1 min-w-0">
                                        {content.type === "video" ? (
                                          <div className="relative flex-shrink-0">
                                            <PlayCircle className="h-4 w-4 text-content-video" />
                                            {content.duration && (
                                              <Badge
                                                variant="secondary"
                                                className="absolute -top-2 -right-2 px-1 py-0 text-[10px] bg-content-video/10 text-content-video"
                                              >
                                                {Math.round(
                                                  content.duration / 60
                                                )}
                                                m
                                              </Badge>
                                            )}
                                          </div>
                                        ) : content.type === "quiz" ? (
                                          <PenTool className="h-4 w-4 flex-shrink-0 text-content-quiz" />
                                        ) : (
                                          <FileText className="h-4 w-4 flex-shrink-0 text-content-document" />
                                        )}
                                        <span className="truncate text-foreground">
                                          {content.title}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2 flex-shrink-0">
                                        {content.isPreview && (
                                          <Badge
                                            variant="outline"
                                            className="text-[10px] px-1 py-0 border-module-border text-module-text"
                                          >
                                            Preview
                                          </Badge>
                                        )}
                                        {content.completed ? (
                                          <CheckCircle className="h-4 w-4 text-content-quiz" />
                                        ) : (
                                          <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30" />
                                        )}
                                      </div>
                                    </button>
                                  )
                                )}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </TabsContent>

                    {/* Activities Tab */}
                    <TabsContent value="activities" className="mt-0">
                      <Accordion type="single" className="space-y-2">
                        {/* Assignments Section */}
                        <AccordionItem
                          value="assignments"
                          className="border-none w-full"
                        >
                          <AccordionTrigger
                            className={cn(
                              "flex items-center w-full py-4 px-6 hover:no-underline rounded-lg",
                              "data-[state=open]:bg-violet-50/80 dark:data-[state=open]:bg-violet-500/10",
                              "data-[state=open]:text-violet-700 dark:data-[state=open]:text-violet-300"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-500/20">
                                <ClipboardList className="h-5 w-5 text-orange-600 dark:text-orange-300" />
                              </div>
                              <span className="font-medium text-lg">
                                Assignments
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="py-2">
                            <div className="space-y-2">
                              {assignments.map((assignment) => (
                                <button
                                  key={assignment.id}
                                  className="w-full flex items-center gap-3 px-6 py-4 text-sm hover:bg-gray-100/50 dark:hover:bg-gray-700/30 rounded-lg text-gray-700 dark:text-gray-300"
                                >
                                  <div className="flex-1 text-left">
                                    <p className="font-medium text-base">
                                      {assignment.title}
                                    </p>
                                    <p className="text-xs text-muted-foreground dark:text-gray-400 mt-1">
                                      Due: {assignment.dueDate}
                                    </p>
                                  </div>
                                  <Badge
                                    variant={
                                      assignment.status === "submitted"
                                        ? "success"
                                        : "warning"
                                    }
                                    className="capitalize"
                                  >
                                    {assignment.status}
                                  </Badge>
                                </button>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        {/* Quizzes Section */}
                        <AccordionItem
                          value="quizzes"
                          className="border-none w-full"
                        >
                          <AccordionTrigger
                            className={cn(
                              "flex items-center w-full py-4 px-6 hover:no-underline rounded-lg",
                              "data-[state=open]:bg-violet-50/80 dark:data-[state=open]:bg-violet-500/10",
                              "data-[state=open]:text-violet-700 dark:data-[state=open]:text-violet-300"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-500/20">
                                <PenTool className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                              </div>
                              <span className="font-medium text-lg">
                                Quizzes
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="py-2">
                            <div className="space-y-2">
                              {quizzes.map((quiz) => (
                                <button
                                  key={quiz.id}
                                  className="w-full flex items-center gap-3 px-6 py-4 text-sm hover:bg-gray-100/50 dark:hover:bg-gray-700/30 rounded-lg text-gray-700 dark:text-gray-300"
                                >
                                  <div className="flex-1 text-left">
                                    <p className="font-medium text-base">
                                      {quiz.title}
                                    </p>
                                    <p className="text-xs text-muted-foreground dark:text-gray-400 mt-1">
                                      Duration: {quiz.duration}
                                    </p>
                                  </div>
                                  {quiz.status === "completed" ? (
                                    <Badge
                                      variant="success"
                                      className="font-medium"
                                    >
                                      {quiz.score}
                                    </Badge>
                                  ) : (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                                    >
                                      Start Quiz
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
              </div>
            </Tabs>
          </motion.div>
        )}
      </div>
    </div>
  );
}
