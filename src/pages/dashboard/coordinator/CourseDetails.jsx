import { useParams, Link, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Users,
  Clock,
  Settings2,
  Star,
  Calendar,
  GraduationCap,
  BarChart2,
  Edit,
  Trash,
  ArrowLeft,
  CheckCircle,
  Plus,
  PlayCircle,
  FileText,
  LayoutGrid,
  UserPlus,
  ChevronRight,
  TrendingUp,
  Award,
  Timer,
  X,
  Target,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Play,
  ChevronUp,
  MoreVertical,
  ImageIcon,
  Video,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import {
  useCourse,
  useDeleteCourse,
  usePublishCourse,
  useUpdateCourseImage,
  useUpdateCourseVideo,
} from "@/api/courses";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { VideoPlayer } from "@/components/VideoPlayer";
import DeleteCourseDialog from "@/components/courses/DeleteCourseDialog";
import PublishCourseDialog from "@/components/courses/PublishCourseDialog";
import EditCourseDialog from "@/components/courses/EditCourseDialog";
import { useModules, moduleKeys } from "@/api/modules";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { VideoUploadSection } from "@/components/courses/VideoUploadSection";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export function CourseDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const {
    data: course,
    isLoading: courseLoading,
    error: courseError,
  } = useCourse(slug);
  const deleteMutation = useDeleteCourse();
  const publishMutation = usePublishCourse();
  const updateImageMutation = useUpdateCourseImage();
  const updateVideoMutation = useUpdateCourseVideo();

  const {
    data: modules,
    isLoading: modulesLoading,
    error: modulesError,
  } = useModules(course?._id, {
    enabled: !!course,
  });

  const formatText = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAllModules, setShowAllModules] = useState(false);
  const [uploadState, setUploadState] = useState("idle");
  const [videoData, setVideoData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(course._id);
      toast.success("Course deleted successfully");
      navigate("/dashboard/courses");
    } catch (error) {
      toast.error("Failed to delete course");
    }
  };

  const handlePublish = async () => {
    try {
      await publishMutation.mutateAsync(course._id);
      toast.success("Course published successfully");
      setShowPublishDialog(false);
    } catch (error) {
      toast.error("Failed to publish course");
    }
  };

  const handleImageUpdate = async (file) => {
    try {
      await updateImageMutation.mutateAsync({
        id: course._id,
        image: file,
      });
      toast.success("Course image updated successfully");
    } catch (error) {
      toast.error("Failed to update course image");
      console.error("Image update error:", error);
    }
  };

  const handleVideoUploadComplete = async (data) => {
    if (data) {
      try {
        await updateVideoMutation.mutateAsync({
          id: course._id,
          videoId: data._id,
        });
        toast.success("Course preview video updated successfully");
        setUploadState("idle");
        setVideoData(null);
      } catch (error) {
        toast.error("Failed to update course video");
        console.error("Video update error:", error);
      }
    }
  };

  if (courseLoading || modulesLoading) {
    return <div>Loading...</div>;
  }

  if (courseError || modulesError) {
    return (
      <div>
        Error loading course: {courseError?.message || modulesError?.message}
      </div>
    );
  }

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="border-b dark:border-[#2A3F47] pb-6">
        <div className="container mx-auto space-y-4">
          {/* Course Actions */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Link
                  to="/dashboard/courses"
                  className="text-muted-foreground hover:text-violet-600 dark:hover:text-violet-400 transition-colors flex items-center gap-1.5"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Courses</span>
                </Link>

                <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground/50" />

                <span className="text-foreground dark:text-white font-medium flex items-center gap-1.5">
                  <GraduationCap className="h-4 w-4 text-violet-500" />
                  <span className="truncate max-w-[300px]">{course.title}</span>
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {course.status !== "published" && (
                <Button
                  variant="outline"
                  className="gap-2 dark:border-[#2A3F47] dark:bg-[#202F36] dark:hover:bg-[#2A3F47] dark:text-zinc-300"
                  onClick={() => setShowPublishDialog(true)}
                >
                  <CheckCircle className="h-4 w-4" /> Publish Course
                </Button>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 dark:border-[#2A3F47] dark:bg-[#202F36] dark:hover:bg-[#2A3F47]"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Course
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-red-600 dark:text-red-400"
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Delete Course
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Course Hero Section */}
      <motion.div className="grid grid-cols-3 gap-6" {...fadeIn}>
        <Card className="col-span-2 border dark:border-[#2A3F47] dark:bg-[#202F36] overflow-hidden group">
          <div className="relative aspect-video overflow-hidden">
            <img
              src={course.image}
              alt={course.title}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

            <div className="absolute top-4 right-4 flex gap-2">
              {/* Image Update Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border-0"
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Update Image
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Update Course Image</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Course Image</Label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpdate(file);
                        }}
                        className="dark:border-[#2A3F47] dark:bg-[#202F36]/50"
                      />
                      <p className="text-sm text-muted-foreground">
                        Recommended: 1920x1080 or higher, JPG, PNG or WebP
                      </p>
                    </div>
                    {updateImageMutation.isPending && (
                      <div className="text-sm text-muted-foreground">
                        Updating image...
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              {/* Video Update Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border-0"
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Update Video
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Update Preview Video</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Preview Video</Label>
                      <VideoUploadSection
                        uploadState={uploadState}
                        setUploadState={setUploadState}
                        videoData={videoData}
                        setVideoData={setVideoData}
                        onUploadComplete={handleVideoUploadComplete}
                      />
                      <p className="text-sm text-muted-foreground">
                        Upload a short preview video for your course
                      </p>
                    </div>
                    {updateVideoMutation.isPending && (
                      <div className="text-sm text-muted-foreground">
                        Updating video...
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className={cn(
                      "bg-white/95 dark:bg-black/80 backdrop-blur-sm",
                      course.status === "published"
                        ? "text-green-600 dark:text-green-400 border-green-200 dark:border-green-900/50"
                        : "text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800/50"
                    )}
                  >
                    <div className="flex items-center gap-1.5">
                      <div
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          course.status === "published"
                            ? "bg-green-500 dark:bg-green-400"
                            : "bg-zinc-400 dark:bg-zinc-500"
                        )}
                      />
                      {course.status === "published" ? "Published" : "Draft"}
                    </div>
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-violet-500/20 backdrop-blur-sm border-violet-300/20 text-violet-50 dark:bg-violet-400/10 dark:text-violet-100"
                  >
                    {formatText(course.level)}
                  </Badge>
                </div>
                <h1 className="text-3xl font-bold text-white">
                  {course.title}
                </h1>
                <div className="flex items-center gap-4 text-zinc-200">
                  <span className="flex items-center gap-1">
                    <GraduationCap className="h-4 w-4" />
                    {course.category.name}
                  </span>
                  <Separator
                    orientation="vertical"
                    className="h-4 bg-zinc-500"
                  />
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {course.duration} Weeks
                  </span>
                  <Separator
                    orientation="vertical"
                    className="h-4 bg-zinc-500"
                  />
                  <span className="flex items-center gap-1">
                    <Timer className="h-4 w-4" />
                    {course.totalHours} Total Hours
                  </span>
                </div>
              </div>

              {/* Video Preview Button and Dialog */}
              {course.previewVideo && (
                <Dialog open={showPreview} onOpenChange={setShowPreview}>
                  <DialogTrigger asChild>
                    <Button
                      size="lg"
                      className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border-0"
                    >
                      <PlayCircle className="h-5 w-5 mr-2" /> Watch Preview
                    </Button>
                  </DialogTrigger>
                  <DialogContent
                    className="sm:max-w-4xl p-0 bg-black border-0 rounded-xl overflow-hidden"
                    onInteractOutside={(e) => e.preventDefault()}
                    hideCloseButton
                  >
                    <div className="relative">
                      <VideoPlayer
                        src={course.previewVideo.url}
                        poster={course.image}
                        options={{
                          autoplay: true,
                          ratio: "16:9",
                        }}
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute top-3 right-3 text-white hover:bg-white/20 z-50 rounded-full h-8 w-8"
                        onClick={() => setShowPreview(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </Card>

        {/* Quick Stats Cards */}
        <div className="space-y-4">
          <Card className="border dark:border-[#2A3F47] dark:bg-[#202F36] overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-purple-500 opacity-50" />
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <BarChart2 className="h-4 w-4 text-primary" />
                Course Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30">
                  <Users className="h-4 w-4 text-blue-500" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Enrolled Students
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">
                      {course.stats.enrolledStudents}
                    </span>
                    <span className="text-sm text-emerald-500 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      12%
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-yellow-50 dark:bg-yellow-950/30">
                  <Star className="h-4 w-4 text-yellow-500" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Average Rating
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">
                      {course.stats.rating}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({course.stats.reviewCount} reviews)
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-green-50 dark:bg-green-950/30">
                  <Award className="h-4 w-4 text-green-500" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Completion Rate
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">
                        {course.stats.completionRate}%
                      </span>
                      <span className="text-sm text-emerald-500">↑ 5%</span>
                    </div>
                    <Progress
                      value={course.stats.completionRate}
                      className="h-1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border dark:border-[#2A3F47] dark:bg-[#202F36] overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-purple-500 opacity-50" />
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Settings2 className="h-4 w-4 text-primary" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="h-auto py-4 px-2 flex flex-col items-center gap-1 dark:border-[#2A3F47] dark:bg-[#202F36] dark:hover:bg-[#2A3F47] dark:text-zinc-300 transition-colors"
                onClick={() =>
                  navigate(`/dashboard/courses/${course.slug}/modules`)
                }
              >
                <LayoutGrid className="h-5 w-5 text-blue-500" />
                <span className="text-xs">Manage Modules</span>
              </Button>

              <Button
                variant="outline"
                className="h-auto py-4 px-2 flex flex-col items-center gap-1 dark:border-[#2A3F47] dark:bg-[#202F36] dark:hover:bg-[#2A3F47] dark:text-zinc-300 transition-colors"
                onClick={() =>
                  navigate(`/dashboard/courses/${course.slug}/batches`)
                }
              >
                <Calendar className="h-5 w-5 text-violet-500" />
                <span className="text-xs">Manage Batches</span>
              </Button>

              <Button
                variant="outline"
                className="h-auto py-4 px-2 flex flex-col items-center gap-1 dark:border-[#2A3F47] dark:bg-[#202F36] dark:hover:bg-[#2A3F47] dark:text-zinc-300 transition-colors"
                onClick={() =>
                  navigate(`/dashboard/courses/${course.slug}/students`)
                }
              >
                <UserPlus className="h-5 w-5 text-green-500" />
                <span className="text-xs">Add Students</span>
              </Button>

              <Button
                variant="outline"
                className="h-auto py-4 px-2 flex flex-col items-center gap-1 dark:border-[#2A3F47] dark:bg-[#202F36] dark:hover:bg-[#2A3F47] dark:text-zinc-300 transition-colors"
                onClick={() => window.open(`/courses/${course.slug}`, "_blank")}
              >
                <ExternalLink className="h-5 w-5 text-yellow-500" />
                <span className="text-xs">View Course</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-transparent border-b dark:border-[#2A3F47] rounded-none p-0 h-auto w-full flex justify-start">
          {[
            { value: "overview", label: "Overview", icon: FileText },
            { value: "modules", label: "Modules", icon: LayoutGrid },
            { value: "batches", label: "Batches", icon: Calendar },
          ].map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary dark:text-[#8B949E] dark:data-[state=active]:text-[#E3E5E5] dark:data-[state=active]:border-[#0B4F6C] px-4 py-2 hover:text-primary/80 dark:hover:text-[#E3E5E5] transition-colors"
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview">
          <motion.div
            className="grid grid-cols-3 gap-6 bg-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="col-span-2 space-y-6">
              {/* Course Description */}
              <Card className="border dark:border-[#2A3F47] dark:bg-[#202F36]">
                <CardHeader className="dark:border-b dark:border-[#2A3F47] pb-4">
                  <CardTitle className="text-foreground dark:text-[#E3E5E5]">
                    Course Description
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none dark:text-[#8B949E] pt-6">
                  <p>{course.description}</p>
                </CardContent>
              </Card>

              {/* Learning Outcomes */}
              <Card className="border dark:border-[#2A3F47] dark:bg-[#202F36]">
                <CardHeader className="dark:border-b dark:border-[#2A3F47] pb-4">
                  <CardTitle className="flex items-center gap-2 text-foreground dark:text-[#E3E5E5]">
                    <Target className="h-5 w-5 text-violet-500" />
                    Learning Outcomes
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid gap-2 dark:text-[#8B949E]">
                    {course.learningOutcomes.map((outcome, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <ArrowRight className="h-5 w-5 text-violet-400 mt-0.5 shrink-0" />
                        <span>{outcome}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Course Features */}
              <Card className="border dark:border-[#2A3F47] dark:bg-[#202F36]">
                <CardHeader className="dark:border-b dark:border-[#2A3F47] pb-4">
                  <CardTitle className="flex items-center gap-2 text-foreground dark:text-[#E3E5E5]">
                    <Sparkles className="h-5 w-5 text-violet-500" />
                    Course Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid gap-2 dark:text-[#8B949E]">
                    {course.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-violet-400 mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Content */}
            <div className="space-y-6">
              {/* Requirements */}
              <Card className="border dark:border-[#2A3F47] dark:bg-[#202F36]">
                <CardHeader className="dark:border-b dark:border-[#2A3F47] pb-4">
                  <CardTitle className="text-foreground dark:text-[#E3E5E5]">
                    Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid gap-2 dark:text-[#8B949E]">
                    {course.requirements.map((req, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <ChevronRight className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                        <span>{req}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Course Info */}
              <Card className="border dark:border-[#2A3F47] dark:bg-[#202F36]">
                <CardHeader className="dark:border-b dark:border-[#2A3F47] pb-4">
                  <CardTitle className="text-foreground dark:text-[#E3E5E5]">
                    Course Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid gap-4 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Language</span>
                      <span className="font-medium dark:text-[#E3E5E5]">
                        {course.language}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Certificate</span>
                      <span className="font-medium dark:text-[#E3E5E5]">
                        {course.certificates.isEnabled ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Price</span>
                      <span className="font-medium dark:text-[#E3E5E5]">
                        ${course.price}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        Last Updated
                      </span>
                      <span className="font-medium dark:text-[#E3E5E5]">
                        {new Date(course.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="modules">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold tracking-tight">
                  Course Modules
                </h2>
                <p className="text-sm text-muted-foreground">
                  View and manage your course modules and their content
                </p>
              </div>
              <Button
                onClick={() =>
                  navigate(`/dashboard/courses/${course.slug}/modules`)
                }
                className="gap-2 bg-violet-600 hover:bg-violet-700 dark:bg-violet-600 dark:hover:bg-violet-700 text-white"
              >
                <LayoutGrid className="h-4 w-4" />
                Manage Modules
              </Button>
            </div>

            {/* Modules List */}
            <div className="border rounded-xl divide-y dark:border-[#2A3F47]">
              {modules
                ?.slice(0, showAllModules ? undefined : 3)
                .map((module, index) => (
                  <div key={module._id} className="divide-y">
                    {/* Module Header */}
                    <div className="p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">
                              Module {index + 1}: {module.title}
                            </h3>
                            <Badge
                              variant={
                                module.status === "published"
                                  ? "success"
                                  : "secondary"
                              }
                              className={cn(
                                "text-xs",
                                module.status === "published"
                                  ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                                  : "bg-zinc-100 dark:bg-zinc-800"
                              )}
                            >
                              {module.status === "published"
                                ? "Published"
                                : "Draft"}
                            </Badge>
                            {module.isOptional && (
                              <Badge variant="outline" className="text-xs">
                                Optional
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {module.description}
                          </p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {module.content?.length || 0} lectures •{" "}
                          {module.calculatedDuration || 0} mins
                        </div>
                      </div>
                    </div>

                    {/* Module Content */}
                    <div className="bg-zinc-50/50 dark:bg-zinc-900/50 divide-y">
                      {module.content?.map((content, i) => (
                        <div
                          key={content._id}
                          className="p-4 pl-8 flex items-center gap-3"
                        >
                          {content.type === "video" && (
                            <Play className="h-4 w-4 text-violet-600" />
                          )}
                          {content.type === "document" && (
                            <FileText className="h-4 w-4 text-blue-600" />
                          )}
                          {content.type === "link" && (
                            <ExternalLink className="h-4 w-4 text-emerald-600" />
                          )}
                          <div className="flex-1">
                            <span className="text-sm">{content.title}</span>
                            {content.isPreview && (
                              <Badge
                                variant="secondary"
                                className="ml-2 text-xs"
                              >
                                Preview
                              </Badge>
                            )}
                          </div>
                          {content.duration && (
                            <span className="text-sm text-muted-foreground">
                              {Math.round(content.duration / 60)} min
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>

            {/* Load More Button */}
            {modules && modules.length > 3 && !showAllModules && (
              <Button
                variant="outline"
                className="w-full gap-2 dark:border-[#2A3F47] dark:bg-[#202F36] dark:hover:bg-[#2A3F47] dark:text-zinc-300"
                onClick={() => setShowAllModules(true)}
              >
                <Plus className="h-4 w-4" />
                Show {modules.length - 3} More Modules
              </Button>
            )}

            {/* Show Less Button */}
            {modules && modules.length > 3 && showAllModules && (
              <Button
                variant="outline"
                className="w-full gap-2 dark:border-[#2A3F47] dark:bg-[#202F36] dark:hover:bg-[#2A3F47] dark:text-zinc-300"
                onClick={() => setShowAllModules(false)}
              >
                <ChevronUp className="h-4 w-4" />
                Show Less
              </Button>
            )}

            {/* Empty State */}
            {(!modules || modules.length === 0) && (
              <div className="text-center py-12 border rounded-xl dark:border-[#2A3F47]">
                <div className="space-y-3">
                  <LayoutGrid className="h-12 w-12 text-muted-foreground mx-auto" />
                  <div className="space-y-1">
                    <h3 className="font-medium text-lg">No modules yet</h3>
                    <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                      Start building your course by adding modules and content
                    </p>
                  </div>
                  <Button
                    onClick={() =>
                      navigate(`/dashboard/courses/${course.slug}/modules`)
                    }
                    className="gap-2 bg-violet-600 hover:bg-violet-700"
                  >
                    <Plus className="h-4 w-4" />
                    Add First Module
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </TabsContent>

        <TabsContent value="batches">
          {/* Batch management content */}
        </TabsContent>

        <TabsContent value="students">
          {/* Student management content */}
        </TabsContent>

        <TabsContent value="analytics">{/* Analytics content */}</TabsContent>
      </Tabs>

      <EditCourseDialog
        course={course}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />

      <DeleteCourseDialog
        course={course}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
      />

      <PublishCourseDialog
        course={course}
        open={showPublishDialog}
        onOpenChange={setShowPublishDialog}
        onConfirm={handlePublish}
      />
    </div>
  );
}
