import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MoreVertical,
  Plus,
  Search,
  Users,
  Clock,
  Star,
  BookOpen,
  ArrowUpRight,
  Sparkles,
  GraduationCap,
  BarChart2,
  TrendingUp,
  X,
  FileText,
  Upload,
  PlayCircle,
  CheckCircle,
  LayoutGrid,
  ImageIcon,
  Monitor,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCategories } from "@/api/categories";
import { useState, useRef, useEffect, useMemo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import {
  useCoordinatorCourses,
  useDeleteCourse,
  usePublishCourse,
  useCreateCourse,
  useUpdateCourse,
} from "@/api/courses";
import { toast } from "sonner";
import { useMediaUpload } from "@/api/media";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Update the form schema to properly handle arrays
const courseFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Please select a category"),
  coordinator: z.string().optional(), // Will be set automatically
  duration: z.number().min(1, "Duration must be at least 1 week"),
  totalHours: z.number().min(1, "Total hours must be at least 1"),
  price: z.number().min(0, "Price cannot be negative"),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]),
  status: z.enum(["draft", "published"]).default("draft"),
  // Ensure these are initialized as empty arrays
  features: z.array(z.string()).default([]),
  learningOutcomes: z.array(z.string()).default([]),
  requirements: z.array(z.string()).default([]),
  image: z.any().optional(),
  previewVideo: z
    .object({
      url: z.string().optional(),
      thumbnail: z.string().optional(),
    })
    .optional(),
  videoId: z.string().optional(),
  stats: z
    .object({
      enrolledStudents: z.number(),
      rating: z.number(),
      reviewCount: z.number(),
      completionRate: z.number(),
    })
    .optional(),
});

function CourseCard({ course }) {
  const deleteMutation = useDeleteCourse();
  const publishMutation = usePublishCourse();
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(course._id);
      toast.success("Course deleted successfully");
    } catch (error) {
      toast.error("Failed to delete course");
    }
  };

  const handlePublish = async () => {
    try {
      await publishMutation.mutateAsync(course._id);
      toast.success("Course published successfully");
    } catch (error) {
      toast.error("Failed to publish course");
    }
  };

  // Add cleanup effect
  useEffect(() => {
    if (!editDialogOpen) {
      document.body.style.pointerEvents = "";
      const overlays = document.querySelectorAll('[role="dialog"]');
      overlays.forEach((overlay) => {
        if (
          !overlay.hasAttribute("data-state") ||
          overlay.getAttribute("data-state") === "closed"
        ) {
          overlay.remove();
        }
      });
    }
  }, [editDialogOpen]);

  const handleEditDialogChange = (isOpen) => {
    setEditDialogOpen(isOpen);
    if (!isOpen) {
      // Ensure cleanup when dialog closes
      document.body.style.pointerEvents = "";
    }
  };

  return (
    <>
      <Card className="group overflow-hidden border dark:border-[#2A3F47] dark:bg-[#202F36] hover:shadow-xl transition-all duration-300">
        {/* Course Image Container */}
        <div className="relative aspect-[16/9] overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-500/5 dark:from-violet-500/10 dark:to-purple-500/10" />
          <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />

          {/* Course Image */}
          <img
            src={course.image || "/placeholder-course.jpg"}
            alt={course.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />

          {/* Top Actions */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <div className="flex gap-2">
              <Badge
                variant={
                  course.status === "published" ? "success" : "secondary"
                }
                className={cn(
                  "bg-white/95 dark:bg-black/80 backdrop-blur-sm shadow-sm",
                  course.status === "published"
                    ? "text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                    : "text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800"
                )}
              >
                <div className="flex items-center gap-1.5">
                  {course.status === "published" ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    <Clock className="h-3 w-3" />
                  )}
                  {course.status === "published" ? "Published" : "Draft"}
                </div>
              </Badge>
              <Badge
                variant="outline"
                className="bg-white/95 dark:bg-black/80 backdrop-blur-sm shadow-sm border-violet-200 text-violet-600 dark:border-violet-800 dark:text-violet-400"
              >
                <div className="flex items-center gap-1.5">
                  <GraduationCap className="h-3 w-3" />
                  {course.level}
                </div>
              </Badge>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 bg-white/95 dark:bg-black/80 backdrop-blur-sm shadow-sm hover:bg-white/90 dark:hover:bg-black/90"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link
                    to={`/dashboard/courses/${course.slug}`}
                    className="flex items-center"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    View Details
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Edit Course
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LayoutGrid className="h-4 w-4 mr-2" />
                  Manage Modules
                </DropdownMenuItem>
                {course.status !== "published" && (
                  <DropdownMenuItem onClick={handlePublish}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Publish
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 dark:text-red-400"
                  onClick={handleDelete}
                >
                  <X className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Course Info */}
            <div className="flex items-center justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <GraduationCap className="h-3.5 w-3.5" />
                  {course.category.name}
                </div>
                <Link
                  to={`/dashboard/courses/${course.slug}`}
                  className="group/title block"
                >
                  <h3 className="font-semibold text-lg line-clamp-1 group-hover/title:text-primary/90 transition-colors dark:text-zinc-100">
                    {course.title}
                  </h3>
                </Link>
              </div>
              <div className="font-semibold text-xl text-primary dark:text-violet-400">
                ${course.price}
              </div>
            </div>

            {/* Compact Stats */}
            <div className="grid grid-cols-4 gap-3 py-3 border-y dark:border-[#2A3F47]">
              {/* Students */}
              <div className="flex items-center gap-1.5">
                <div className="p-1.5 rounded-md bg-blue-50 dark:bg-blue-500/10">
                  <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-sm font-medium">
                    {course.stats.enrolledStudents}
                  </div>
                  <div className="text-xs text-muted-foreground">Students</div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1.5">
                <div className="p-1.5 rounded-md bg-yellow-50 dark:bg-yellow-500/10">
                  <Star className="h-4 w-4 text-yellow-600 dark:text-yellow-400 fill-current" />
                </div>
                <div>
                  <div className="text-sm font-medium">
                    {course.stats.rating.toFixed(1)}
                  </div>
                  <div className="text-xs text-muted-foreground">Rating</div>
                </div>
              </div>

              {/* Duration */}
              <div className="flex items-center gap-1.5">
                <div className="p-1.5 rounded-md bg-violet-50 dark:bg-violet-500/10">
                  <Clock className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <div className="text-sm font-medium">{course.duration}w</div>
                  <div className="text-xs text-muted-foreground">Duration</div>
                </div>
              </div>

              {/* Completion Rate */}
              <div className="flex items-center gap-1.5">
                <div className="p-1.5 rounded-md bg-emerald-50 dark:bg-emerald-500/10">
                  <BarChart2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <div className="text-sm font-medium">
                    {course.stats.completionRate}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Completion
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                className="flex-1 bg-violet-600 hover:bg-violet-700 text-white dark:bg-violet-500 dark:hover:bg-violet-600"
                asChild
              >
                <Link to={`/dashboard/courses/${course.slug}/modules`}>
                  <LayoutGrid className="h-4 w-4 mr-2" />
                  Manage Course
                </Link>
              </Button>
              <Button
                variant="outline"
                className="flex-1 bg-white hover:bg-zinc-50 border-zinc-200 dark:bg-zinc-900/50 dark:hover:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-100"
                asChild
              >
                <Link to={`/dashboard/courses/${course.slug}`}>
                  <BookOpen className="h-4 w-4 mr-2" />
                  View Details
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add EditCourseDialog */}
      <EditCourseDialog
        course={course}
        open={editDialogOpen}
        onOpenChange={handleEditDialogChange}
      />
    </>
  );
}

function VideoUploadSection({
  uploadState,
  setUploadState,
  videoData,
  onUploadComplete,
}) {
  const fileInputRef = useRef(null);
  const mediaUpload = useMediaUpload();
  const [uploadController, setUploadController] = useState(null);

  const handleUpload = async (file) => {
    const maxSize = 100 * 1024 * 1024; // 100MB in bytes
    if (file.size > maxSize) {
      toast.error("File size must be less than 100MB");
      return;
    }

    try {
      setUploadState("uploading");
      const controller = new AbortController();
      setUploadController(controller);

      const uploadedVideo = await mediaUpload.mutateAsync({
        file,
        uploadType: "courseVideo",
        signal: controller.signal,
      });

      onUploadComplete(uploadedVideo);
      setUploadState("completed");
    } catch (error) {
      if (error.name === "AbortError") {
        setUploadState("idle");
        toast.info("Upload cancelled");
      } else {
        setUploadState("error");
        toast.error("Failed to upload video");
        console.error("Video upload error:", error);
      }
    } finally {
      setUploadController(null);
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (file) await handleUpload(file);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!file.type.startsWith("video/")) {
        toast.error("Please upload a video file");
        return;
      }
      await handleUpload(file);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  return (
    <div className="space-y-4">
      <div className="relative">
        {uploadState === "idle" && (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="relative border-2 border-dashed dark:border-[#2A3F47] rounded-xl p-10 transition-all cursor-pointer group hover:bg-muted/50 dark:hover:bg-[#202F36]/50"
          >
            <div className="absolute inset-0 bg-grid-black/[0.1] dark:bg-grid-white/[0.05] rounded-xl" />

            <div className="relative flex flex-col items-center gap-4 text-center">
              <div className="p-4 rounded-full bg-primary/5 ring-1 ring-primary/10 group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-300">
                <Upload className="h-8 w-8 text-primary/70" />
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-xl text-foreground dark:text-white">
                  Upload Preview Video
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Drag and drop your video here, or click to browse your files
                </p>
              </div>

              <div className="grid grid-cols-3 gap-6 mt-2">
                {[
                  { icon: FileText, text: "MP4 format" },
                  { icon: Clock, text: "Max 10 minutes" },
                  { icon: ArrowUpRight, text: "Up to 100MB" },
                ].map(({ icon: Icon, text }, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 dark:bg-[#202F36]/50 px-3 py-2 rounded-lg"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {uploadState === "uploading" && (
          <div className="border dark:border-[#2A3F47] rounded-xl overflow-hidden">
            {/* Upload Progress Header */}
            <div className="bg-muted/50 dark:bg-[#202F36]/50 px-6 py-4 border-b dark:border-[#2A3F47]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Upload className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground dark:text-white">
                      Uploading Video
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {videoData?.originalName || "preview-video.mp4"}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    uploadController?.abort();
                    setUploadController(null);
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </Button>
              </div>
            </div>

            {/* Upload Progress Content */}
            <div className="p-6 space-y-6">
              {/* Progress Visualization */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="h-4 w-4 border-2 border-primary border-r-transparent rounded-full"
                    />
                    <span className="text-muted-foreground">
                      Processing video...
                    </span>
                  </div>
                  <span className="font-medium text-foreground dark:text-white">
                    50%
                  </span>
                </div>

                {/* Animated Progress Bar */}
                <div className="relative h-2 bg-muted dark:bg-[#202F36] rounded-full overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-500 to-purple-500"
                    initial={{ width: "0%" }}
                    animate={{ width: "50%" }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/0"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </div>
              </div>

              {/* Upload Stages */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: Upload, label: "Uploading", status: "completed" },
                  { icon: FileText, label: "Processing", status: "current" },
                  { icon: CheckCircle, label: "Finalizing", status: "pending" },
                ].map(({ icon: Icon, label, status }, index) => (
                  <div
                    key={index}
                    className={cn(
                      "relative p-4 rounded-lg border dark:border-[#2A3F47]",
                      status === "completed" &&
                        "bg-green-500/10 border-green-500/20",
                      status === "current" && "bg-primary/5 border-primary/20",
                      status === "pending" && "bg-muted/50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "h-8 w-8 rounded-full flex items-center justify-center",
                          status === "completed" && "bg-green-500",
                          status === "current" && "bg-primary",
                          status === "pending" && "bg-muted-foreground/20"
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-4 w-4",
                            status === "completed" && "text-white",
                            status === "current" && "text-white",
                            status === "pending" && "text-muted-foreground"
                          )}
                        />
                      </div>
                      <div>
                        <p
                          className={cn(
                            "font-medium",
                            status === "completed" &&
                              "text-green-600 dark:text-green-400",
                            status === "current" &&
                              "text-foreground dark:text-white",
                            status === "pending" && "text-muted-foreground"
                          )}
                        >
                          {label}
                        </p>
                        {status === "current" && (
                          <motion.p
                            className="text-xs text-muted-foreground"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            Optimizing video quality...
                          </motion.p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Processing Details */}
              <div className="p-4 rounded-lg bg-muted/50 dark:bg-[#202F36]/50 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">File size</span>
                  <span className="font-medium text-foreground dark:text-white">
                    24.5 MB
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Time remaining</span>
                  <span className="font-medium text-foreground dark:text-white">
                    ~2 mins
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Upload speed</span>
                  <span className="font-medium text-foreground dark:text-white">
                    2.1 MB/s
                  </span>
                </div>
              </div>

              {/* Help Text */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="h-1.5 w-1.5 rounded-full bg-primary"
                />
                <p>
                  You can continue editing the course while the video processes
                </p>
              </div>
            </div>
          </div>
        )}

        {uploadState === "completed" && videoData && (
          <div className="border dark:border-[#2A3F47] rounded-xl overflow-hidden">
            {/* Success Banner */}
            <div className="bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-green-500/10 dark:from-green-500/20 dark:via-emerald-500/20 dark:to-green-500/20 px-6 py-4 border-b dark:border-[#2A3F47]">
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                  }}
                  className="relative"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-500/40 to-emerald-500/40 rounded-full blur-sm" />
                  <div className="relative h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex-1"
                >
                  <h4 className="font-medium text-green-700 dark:text-green-300">
                    Upload Complete
                  </h4>
                  <p className="text-sm text-green-600/80 dark:text-green-300/80">
                    Your video has been uploaded successfully
                  </p>
                </motion.div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setUploadState("idle");
                          setVideoData(null);
                          onUploadComplete(null);
                        }}
                        className="text-green-700 dark:text-green-300 hover:text-green-800 dark:hover:text-green-200 hover:bg-green-500/10"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Remove video</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {/* Video Preview */}
            <div className="p-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Video Details */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-violet-500/10 dark:bg-violet-500/20 flex items-center justify-center">
                      <PlayCircle className="h-5 w-5 text-violet-500 dark:text-violet-400" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground dark:text-white">
                        {videoData.originalName || "Preview Video"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {(videoData.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-muted/50">
                    Preview
                  </Badge>
                </div>

                {/* Thumbnail Preview */}
                {videoData.thumbnail && (
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="absolute inset-0"
                    >
                      <img
                        src={videoData.thumbnail}
                        alt="Video thumbnail"
                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                      />
                      {/* Overlay with Play Button */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                          >
                            <PlayCircle className="h-8 w-8 text-white" />
                          </motion.div>
                        </div>
                      </div>
                      {/* Video Duration */}
                      <div className="absolute bottom-3 right-3 px-2 py-1 rounded-md bg-black/70 backdrop-blur-sm text-white text-xs font-medium">
                        {videoData.duration}
                      </div>
                      {/* Video Quality Badge */}
                      <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-black/70 backdrop-blur-sm text-white text-xs font-medium">
                        HD
                      </div>
                    </motion.div>
                  </div>
                )}

                {/* Video Info */}
                <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/50 dark:bg-[#202F36]/50">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-medium text-foreground dark:text-white flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-green-500" />
                      Ready to use
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Processing</p>
                    <p className="font-medium text-foreground dark:text-white">
                      Completed
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {uploadState === "error" && (
          <div className="border border-destructive/20 dark:border-destructive/30 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute -inset-1 bg-red-500/20 rounded-full blur-sm" />
                <div className="relative p-3 rounded-full bg-destructive/10">
                  <X className="h-6 w-6 text-destructive" />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-destructive">Upload Failed</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  There was an error uploading your video. Please try again.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setUploadState("idle")}
              >
                Try Again
              </Button>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4,video/quicktime"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>
    </div>
  );
}

function CreateCourseDialog() {
  const createCourseMutation = useCreateCourse();
  const [uploadState, setUploadState] = useState("idle");
  const [videoData, setVideoData] = useState(null);

  const form = useForm({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      duration: 1,
      totalHours: 1,
      price: 0,
      level: "Beginner",
      features: [],
      learningOutcomes: [],
      requirements: [],
      status: "draft",
      stats: {
        enrolledStudents: 0,
        rating: 0,
        reviewCount: 0,
        completionRate: 0,
      },
    },
  });

  const { data: categories, isLoading: isCategoriesLoading } = useCategories();

  const handleVideoUploadComplete = (data) => {
    if (data) {
      setVideoData(data);
      form.setValue("previewVideo", {
        url: data.url,
        thumbnail: data.thumbnail,
      });
      form.setValue("videoId", data._id);
      setUploadState("completed");
    } else {
      setVideoData(null);
      form.setValue("previewVideo", null);
      form.setValue("videoId", null);
      setUploadState("idle");
    }
  };

  const handleDialogClose = () => {
    setUploadState("idle");
    setVideoData(null);
    form.reset();
  };

  const onSubmit = async (data) => {
    try {
      await createCourseMutation.mutateAsync(data);

      toast.success("Course created successfully");
      form.reset();
    } catch (error) {
      toast.error("Failed to create course");
      console.error("Course creation error:", error);
    }
  };

  return (
    <Dialog onOpenChange={(open) => !open && handleDialogClose()}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-violet-500 to-purple-500 dark:from-violet-600 dark:to-purple-600 text-white hover:from-violet-600 hover:to-purple-600 dark:hover:from-violet-700 dark:hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-300 gap-2">
          <Plus className="h-4 w-4" />
          Create Course
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>Create New Course</DialogTitle>
          <DialogDescription>
            Add a new course to your curriculum
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="flex-1 flex flex-col min-h-0">
          <TabsList className="w-full px-6 border-b">
            <TabsTrigger value="basic" className="flex-1">
              Basic Information
            </TabsTrigger>
            <TabsTrigger value="media" className="flex-1">
              Media
            </TabsTrigger>
            <TabsTrigger value="curriculum" className="flex-1">
              Curriculum
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 p-6"
              >
                <TabsContent value="basic" className="mt-0 space-y-6">
                  <div className="grid gap-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground dark:text-zinc-200">
                            Course Title
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter course title"
                              className="dark:border-[#2A3F47] dark:bg-[#202F36]/50 dark:placeholder:text-zinc-500"
                            />
                          </FormControl>
                          <FormMessage className="dark:text-red-400" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground dark:text-zinc-200">
                            Description
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Enter course description"
                              className="h-32 dark:border-[#2A3F47] dark:bg-[#202F36]/50 dark:placeholder:text-zinc-500"
                            />
                          </FormControl>
                          <FormMessage className="dark:text-red-400" />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground dark:text-zinc-200">
                              Category
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              disabled={isCategoriesLoading}
                            >
                              <FormControl>
                                <SelectTrigger className="dark:border-[#2A3F47] dark:bg-[#202F36]/50">
                                  <SelectValue
                                    placeholder="Select category"
                                    className="dark:text-zinc-400"
                                  />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="dark:border-[#2A3F47] dark:bg-[#202F36]">
                                {categories?.map((category) => (
                                  <SelectItem
                                    key={category._id}
                                    value={category._id}
                                    className="dark:text-zinc-300 dark:focus:bg-[#2A3F47]/70"
                                  >
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription className="dark:text-zinc-400">
                              Choose the category for your course
                            </FormDescription>
                            <FormMessage className="dark:text-red-400" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="level"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground dark:text-zinc-200">
                              Level
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="dark:border-[#2A3F47] dark:bg-[#202F36]/50">
                                  <SelectValue
                                    placeholder="Select level"
                                    className="dark:text-zinc-300"
                                  />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="dark:border-[#2A3F47] dark:bg-[#202F36]">
                                {["Beginner", "Intermediate", "Advanced"].map(
                                  (level) => (
                                    <SelectItem
                                      key={level}
                                      value={level}
                                      className="dark:text-zinc-300 dark:focus:bg-[#2A3F47]/70"
                                    >
                                      {level}
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage className="dark:text-red-400" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground dark:text-zinc-200">
                              Duration (weeks)
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                                className="dark:border-[#2A3F47] dark:bg-[#202F36]/50 dark:placeholder:text-zinc-500"
                              />
                            </FormControl>
                            <FormMessage className="dark:text-red-400" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="totalHours"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground dark:text-zinc-200">
                              Total Hours
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                                className="dark:border-[#2A3F47] dark:bg-[#202F36]/50 dark:placeholder:text-zinc-500"
                              />
                            </FormControl>
                            <FormMessage className="dark:text-red-400" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground dark:text-zinc-200">
                              Price ($)
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                                className="dark:border-[#2A3F47] dark:bg-[#202F36]/50 dark:placeholder:text-zinc-500"
                              />
                            </FormControl>
                            <FormMessage className="dark:text-red-400" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="media" className="mt-0">
                  <div className="grid gap-6">
                    <FormField
                      control={form.control}
                      name="image"
                      render={({ field: { value, onChange, ...field } }) => (
                        <FormItem>
                          <FormLabel className="text-foreground dark:text-zinc-200">
                            Course Cover Image
                          </FormLabel>
                          <FormControl>
                            <div className="space-y-4">
                              {/* Image Preview */}
                              {value && (
                                <motion.div
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="relative aspect-video w-full rounded-lg overflow-hidden bg-muted"
                                >
                                  <img
                                    src={
                                      value instanceof File
                                        ? URL.createObjectURL(value)
                                        : value
                                    }
                                    alt="Cover preview"
                                    className="object-cover w-full h-full"
                                    onLoad={(e) => {
                                      if (value instanceof File) {
                                        URL.revokeObjectURL(e.target.src);
                                      }
                                    }}
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                  <Button
                                    type="button"
                                    size="icon"
                                    variant="destructive"
                                    className="absolute top-2 right-2"
                                    onClick={() => onChange(null)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </motion.div>
                              )}

                              {/* Upload Area */}
                              <div
                                onClick={() =>
                                  document
                                    .getElementById("cover-image-input")
                                    .click()
                                }
                                className={cn(
                                  "relative border-2 border-dashed dark:border-[#2A3F47] rounded-lg transition-all cursor-pointer",
                                  "hover:bg-muted/50 dark:hover:bg-[#202F36]/50",
                                  value ? "p-4" : "p-8"
                                )}
                              >
                                <div className="absolute inset-0 bg-grid-black/[0.1] dark:bg-grid-white/[0.05] rounded-lg" />

                                <div className="relative flex flex-col items-center gap-4 text-center">
                                  <div className="p-4 rounded-full bg-primary/5 ring-1 ring-primary/10 group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-300">
                                    <ImageIcon className="h-6 w-6 text-primary/70" />
                                  </div>

                                  <div className="space-y-2">
                                    <h3 className="font-medium text-foreground dark:text-white">
                                      {value
                                        ? "Change Cover Image"
                                        : "Upload Cover Image"}
                                    </h3>
                                    <p className="text-sm text-muted-foreground max-w-sm">
                                      Drag and drop your image here, or click to
                                      browse
                                    </p>
                                  </div>

                                  {!value && (
                                    <div className="grid grid-cols-3 gap-4 mt-2">
                                      {[
                                        {
                                          icon: ImageIcon,
                                          text: "JPG, PNG, WebP",
                                        },
                                        {
                                          icon: ArrowUpRight,
                                          text: "Up to 5MB",
                                        },
                                        {
                                          icon: Monitor,
                                          text: "1920x1080 or higher",
                                        },
                                      ].map(({ icon: Icon, text }, i) => (
                                        <div
                                          key={i}
                                          className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 dark:bg-[#202F36]/50 px-3 py-2 rounded-lg"
                                        >
                                          <Icon className="h-4 w-4" />
                                          <span>{text}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                <input
                                  id="cover-image-input"
                                  type="file"
                                  accept="image/jpeg,image/png,image/webp"
                                  className="hidden"
                                  {...field}
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;

                                    // Validate file size
                                    if (file.size > 5 * 1024 * 1024) {
                                      toast.error(
                                        "Image must be less than 5MB"
                                      );
                                      return;
                                    }

                                    // Validate file type
                                    if (
                                      ![
                                        "image/jpeg",
                                        "image/png",
                                        "image/webp",
                                      ].includes(file.type)
                                    ) {
                                      toast.error(
                                        "Please upload a valid image file (JPG, PNG, or WebP)"
                                      );
                                      return;
                                    }

                                    // Create temporary URL for dimension checking
                                    const tempUrl = URL.createObjectURL(file);
                                    const img = new Image();

                                    img.onload = function () {
                                      URL.revokeObjectURL(tempUrl);
                                      if (
                                        this.width < 1920 ||
                                        this.height < 1080
                                      ) {
                                        toast.error(
                                          "Image resolution should be 1920x1080 or higher"
                                        );
                                        return;
                                      }
                                      onChange(file);
                                    };

                                    img.onerror = function () {
                                      URL.revokeObjectURL(tempUrl);
                                      toast.error("Failed to load image");
                                    };

                                    img.src = tempUrl;
                                  }}
                                />
                              </div>
                            </div>
                          </FormControl>
                          <FormDescription className="text-muted-foreground dark:text-zinc-400">
                            Upload a high-quality cover image to make your
                            course stand out
                          </FormDescription>
                          <FormMessage className="dark:text-red-400" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="previewVideo"
                      render={() => (
                        <FormItem>
                          <FormLabel>Preview Video</FormLabel>
                          <VideoUploadSection
                            uploadState={uploadState}
                            setUploadState={setUploadState}
                            videoData={videoData}
                            onUploadComplete={handleVideoUploadComplete}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="curriculum" className="mt-0">
                  <Accordion type="single" collapsible defaultValue="features">
                    <AccordionItem value="features" className="border-b-0">
                      <AccordionTrigger className="text-foreground dark:text-zinc-200 hover:no-underline">
                        Course Features
                      </AccordionTrigger>
                      <AccordionContent>
                        <FormField
                          control={form.control}
                          name="features"
                          render={({ field }) => (
                            <FormItem className="space-y-1">
                              <FormDescription className="text-muted-foreground dark:text-zinc-400">
                                List the key features of your course
                              </FormDescription>
                              <div className="space-y-2">
                                {field.value.map((_, index) => (
                                  <div key={index} className="flex gap-2">
                                    <Input
                                      value={field.value[index]}
                                      onChange={(e) => {
                                        const newFeatures = [...field.value];
                                        newFeatures[index] = e.target.value;
                                        field.onChange(newFeatures);
                                      }}
                                      placeholder="e.g., Hands-on Projects"
                                      className="dark:border-[#2A3F47] dark:bg-[#202F36]/50 dark:placeholder:text-zinc-500 dark:text-zinc-300"
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      onClick={() => {
                                        const newFeatures = field.value.filter(
                                          (_, i) => i !== index
                                        );
                                        field.onChange(newFeatures);
                                      }}
                                      className="dark:border-[#2A3F47] dark:bg-transparent dark:hover:bg-[#2A3F47]/50 dark:text-zinc-400 hover:dark:text-zinc-300"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    field.onChange([...field.value, ""])
                                  }
                                  className="dark:border-[#2A3F47] dark:bg-transparent dark:hover:bg-[#2A3F47]/50 dark:text-zinc-300"
                                >
                                  Add Feature
                                </Button>
                              </div>
                              <FormMessage className="dark:text-red-400" />
                            </FormItem>
                          )}
                        />
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="outcomes" className="border-b-0">
                      <AccordionTrigger className="text-foreground dark:text-zinc-200 hover:no-underline">
                        Learning Outcomes
                      </AccordionTrigger>
                      <AccordionContent>
                        <FormField
                          control={form.control}
                          name="learningOutcomes"
                          render={({ field }) => (
                            <FormItem className="space-y-1">
                              <FormDescription className="text-muted-foreground dark:text-zinc-400">
                                What will students learn from this course?
                              </FormDescription>
                              <div className="space-y-2">
                                {field.value.map((_, index) => (
                                  <div key={index} className="flex gap-2">
                                    <Input
                                      value={field.value[index]}
                                      onChange={(e) => {
                                        const newOutcomes = [...field.value];
                                        newOutcomes[index] = e.target.value;
                                        field.onChange(newOutcomes);
                                      }}
                                      placeholder="e.g., Build full-stack applications"
                                      className="dark:border-[#2A3F47] dark:bg-[#202F36]/50 dark:placeholder:text-zinc-500 dark:text-zinc-300"
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      onClick={() => {
                                        const newOutcomes = field.value.filter(
                                          (_, i) => i !== index
                                        );
                                        field.onChange(newOutcomes);
                                      }}
                                      className="dark:border-[#2A3F47] dark:bg-transparent dark:hover:bg-[#2A3F47]/50 dark:text-zinc-400 hover:dark:text-zinc-300"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    field.onChange([...field.value, ""])
                                  }
                                  className="dark:border-[#2A3F47] dark:bg-transparent dark:hover:bg-[#2A3F47]/50 dark:text-zinc-300"
                                >
                                  Add Learning Outcome
                                </Button>
                              </div>
                              <FormMessage className="dark:text-red-400" />
                            </FormItem>
                          )}
                        />
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="requirements" className="border-0">
                      <AccordionTrigger className="text-foreground dark:text-zinc-200 hover:no-underline">
                        Course Requirements
                      </AccordionTrigger>
                      <AccordionContent>
                        <FormField
                          control={form.control}
                          name="requirements"
                          render={({ field }) => (
                            <FormItem className="space-y-1">
                              <FormDescription className="text-muted-foreground dark:text-zinc-400">
                                What prerequisites do students need?
                              </FormDescription>
                              <div className="space-y-2">
                                {field.value.map((_, index) => (
                                  <div key={index} className="flex gap-2">
                                    <Input
                                      value={field.value[index]}
                                      onChange={(e) => {
                                        const newRequirements = [
                                          ...field.value,
                                        ];
                                        newRequirements[index] = e.target.value;
                                        field.onChange(newRequirements);
                                      }}
                                      placeholder="e.g., Basic JavaScript knowledge"
                                      className="dark:border-[#2A3F47] dark:bg-[#202F36]/50 dark:placeholder:text-zinc-500 dark:text-zinc-300"
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      onClick={() => {
                                        const newRequirements =
                                          field.value.filter(
                                            (_, i) => i !== index
                                          );
                                        field.onChange(newRequirements);
                                      }}
                                      className="dark:border-[#2A3F47] dark:bg-transparent dark:hover:bg-[#2A3F47]/50 dark:text-zinc-400 hover:dark:text-zinc-300"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    field.onChange([...field.value, ""])
                                  }
                                  className="dark:border-[#2A3F47] dark:bg-transparent dark:hover:bg-[#2A3F47]/50 dark:text-zinc-300"
                                >
                                  Add Requirement
                                </Button>
                              </div>
                              <FormMessage className="dark:text-red-400" />
                            </FormItem>
                          )}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </TabsContent>

                <div className="flex justify-end gap-2 pt-6 border-t dark:border-[#2A3F47] sticky bottom-0 bg-background dark:bg-[#202F36]/95 backdrop-blur-sm">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleDialogClose}
                    className="dark:border-[#2A3F47] dark:bg-transparent dark:hover:bg-[#2A3F47]/50 dark:text-zinc-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      uploadState === "uploading" ||
                      createCourseMutation.isPending ||
                      uploadState !== "completed"
                    }
                    className="bg-violet-600 hover:bg-violet-700 text-white dark:bg-violet-500 dark:hover:bg-violet-600"
                  >
                    {createCourseMutation.isPending
                      ? "Creating..."
                      : "Create Course"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function EditCourseDialog({ course, open, onOpenChange }) {
  const updateCourseMutation = useUpdateCourse();
  const [uploadState, setUploadState] = useState("idle");
  const [videoData, setVideoData] = useState(course?.previewVideo || null);
  const { data: categories } = useCategories(); // Add this line

  // Update the form's defaultValues to correctly set the category
  const form = useForm({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: course?.title || "",
      description: course?.description || "",
      category: course?.category?._id || "", // Make sure to use _id
      duration: course?.duration || 1,
      totalHours: course?.totalHours || 1,
      price: course?.price || 0,
      level: course?.level || "Beginner",
      features: course?.features || [],
      learningOutcomes: course?.learningOutcomes || [],
      requirements: course?.requirements || [],
      status: course?.status || "draft",
      previewVideo: course?.previewVideo || null,
      image: course?.image || null,
    },
  });

  const handleVideoUploadComplete = (data) => {
    if (data) {
      setVideoData(data);
      form.setValue("previewVideo", {
        url: data.url,
        thumbnail: data.thumbnail,
      });
      form.setValue("videoId", data._id);
      setUploadState("completed");
    } else {
      setVideoData(null);
      form.setValue("previewVideo", null);
      form.setValue("videoId", null);
      setUploadState("idle");
    }
  };

  // Add cleanup effect
  useEffect(() => {
    if (!open) {
      // Clean up when dialog closes
      document.body.style.pointerEvents = ""; // Reset pointer events
      const overlays = document.querySelectorAll('[role="dialog"]');
      overlays.forEach((overlay) => {
        if (
          !overlay.hasAttribute("data-state") ||
          overlay.getAttribute("data-state") === "closed"
        ) {
          overlay.remove();
        }
      });
    }
  }, [open]);

  const handleDialogClose = () => {
    setUploadState("idle");
    setVideoData(null);
    form.reset();
    // Ensure body pointer events are reset
    document.body.style.pointerEvents = "";
    onOpenChange(false);
  };

  const onSubmit = async (data) => {
    try {
      await updateCourseMutation.mutateAsync({
        id: course._id,
        ...data,
      });

      toast.success("Course updated successfully");
      handleDialogClose();
    } catch (error) {
      toast.error("Failed to update course");
      console.error("Course update error:", error);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          handleDialogClose();
        }
        onOpenChange(isOpen);
      }}
      // Add these props to ensure proper cleanup
      modal={true}
      onEscapeKeyDown={handleDialogClose}
      onInteractOutside={handleDialogClose}
    >
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>Edit Course</DialogTitle>
          <DialogDescription>Update your course information</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="flex-1 flex flex-col min-h-0">
          <TabsList className="w-full px-6 border-b">
            <TabsTrigger value="basic" className="flex-1">
              Basic Information
            </TabsTrigger>
            <TabsTrigger value="media" className="flex-1">
              Media
            </TabsTrigger>
            <TabsTrigger value="curriculum" className="flex-1">
              Curriculum
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 p-6"
              >
                <TabsContent value="basic" className="mt-0 space-y-6">
                  <div className="grid gap-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground dark:text-zinc-200">
                            Course Title
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter course title"
                              className="dark:border-[#2A3F47] dark:bg-[#202F36]/50 dark:placeholder:text-zinc-500"
                            />
                          </FormControl>
                          <FormMessage className="dark:text-red-400" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground dark:text-zinc-200">
                            Description
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Enter course description"
                              className="h-32 dark:border-[#2A3F47] dark:bg-[#202F36]/50 dark:placeholder:text-zinc-500"
                            />
                          </FormControl>
                          <FormMessage className="dark:text-red-400" />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground dark:text-zinc-200">
                              Category
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="dark:border-[#2A3F47] dark:bg-[#202F36]/50">
                                  <SelectValue
                                    placeholder="Select category"
                                    className="dark:text-zinc-400"
                                  />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="dark:border-[#2A3F47] dark:bg-[#202F36]">
                                {/* Map through categories from useCategories hook */}
                                {categories?.map((category) => (
                                  <SelectItem
                                    key={category._id}
                                    value={category._id}
                                    className="dark:text-zinc-300 dark:focus:bg-[#2A3F47]/70"
                                  >
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription className="dark:text-zinc-400">
                              Choose the category for your course
                            </FormDescription>
                            <FormMessage className="dark:text-red-400" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="level"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground dark:text-zinc-200">
                              Level
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="dark:border-[#2A3F47] dark:bg-[#202F36]/50">
                                  <div className="flex items-center gap-2">
                                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                                    <SelectValue
                                      placeholder="Select level"
                                      className="dark:text-zinc-400"
                                    />
                                  </div>
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Beginner">
                                  Beginner
                                </SelectItem>
                                <SelectItem value="Intermediate">
                                  Intermediate
                                </SelectItem>
                                <SelectItem value="Advanced">
                                  Advanced
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage className="dark:text-red-400" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground dark:text-zinc-200">
                              Duration (weeks)
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                                className="dark:border-[#2A3F47] dark:bg-[#202F36]/50 dark:placeholder:text-zinc-500"
                              />
                            </FormControl>
                            <FormMessage className="dark:text-red-400" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="totalHours"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground dark:text-zinc-200">
                              Total Hours
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                                className="dark:border-[#2A3F47] dark:bg-[#202F36]/50 dark:placeholder:text-zinc-500"
                              />
                            </FormControl>
                            <FormMessage className="dark:text-red-400" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground dark:text-zinc-200">
                              Price ($)
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                                className="dark:border-[#2A3F47] dark:bg-[#202F36]/50 dark:placeholder:text-zinc-500"
                              />
                            </FormControl>
                            <FormMessage className="dark:text-red-400" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="media" className="mt-0">
                  <div className="grid gap-6">
                    <FormField
                      control={form.control}
                      name="image"
                      render={({ field: { value, onChange, ...field } }) => (
                        <FormItem>
                          <FormLabel className="text-foreground dark:text-zinc-200">
                            Course Cover Image
                          </FormLabel>
                          <FormControl>
                            <div className="space-y-4">
                              {/* Image Preview */}
                              {value && (
                                <motion.div
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="relative aspect-video w-full rounded-lg overflow-hidden bg-muted"
                                >
                                  <img
                                    src={
                                      value instanceof File
                                        ? URL.createObjectURL(value)
                                        : value
                                    }
                                    alt="Cover preview"
                                    className="object-cover w-full h-full"
                                    onLoad={(e) => {
                                      if (value instanceof File) {
                                        URL.revokeObjectURL(e.target.src);
                                      }
                                    }}
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                  <Button
                                    type="button"
                                    size="icon"
                                    variant="destructive"
                                    className="absolute top-2 right-2"
                                    onClick={() => onChange(null)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </motion.div>
                              )}

                              {/* Upload Area */}
                              <div
                                onClick={() =>
                                  document
                                    .getElementById("cover-image-input")
                                    .click()
                                }
                                className={cn(
                                  "relative border-2 border-dashed dark:border-[#2A3F47] rounded-lg transition-all cursor-pointer",
                                  "hover:bg-muted/50 dark:hover:bg-[#202F36]/50",
                                  value ? "p-4" : "p-8"
                                )}
                              >
                                <div className="absolute inset-0 bg-grid-black/[0.1] dark:bg-grid-white/[0.05] rounded-lg" />

                                <div className="relative flex flex-col items-center gap-4 text-center">
                                  <div className="p-4 rounded-full bg-primary/5 ring-1 ring-primary/10 group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-300">
                                    <ImageIcon className="h-6 w-6 text-primary/70" />
                                  </div>

                                  <div className="space-y-2">
                                    <h3 className="font-medium text-foreground dark:text-white">
                                      {value
                                        ? "Change Cover Image"
                                        : "Upload Cover Image"}
                                    </h3>
                                    <p className="text-sm text-muted-foreground max-w-sm">
                                      Drag and drop your image here, or click to
                                      browse
                                    </p>
                                  </div>

                                  {!value && (
                                    <div className="grid grid-cols-3 gap-4 mt-2">
                                      {[
                                        {
                                          icon: ImageIcon,
                                          text: "JPG, PNG, WebP",
                                        },
                                        {
                                          icon: ArrowUpRight,
                                          text: "Up to 5MB",
                                        },
                                        {
                                          icon: Monitor,
                                          text: "1920x1080 or higher",
                                        },
                                      ].map(({ icon: Icon, text }, i) => (
                                        <div
                                          key={i}
                                          className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 dark:bg-[#202F36]/50 px-3 py-2 rounded-lg"
                                        >
                                          <Icon className="h-4 w-4" />
                                          <span>{text}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                <input
                                  id="cover-image-input"
                                  type="file"
                                  accept="image/jpeg,image/png,image/webp"
                                  className="hidden"
                                  {...field}
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;

                                    // Validate file size
                                    if (file.size > 5 * 1024 * 1024) {
                                      toast.error(
                                        "Image must be less than 5MB"
                                      );
                                      return;
                                    }

                                    // Validate file type
                                    if (
                                      ![
                                        "image/jpeg",
                                        "image/png",
                                        "image/webp",
                                      ].includes(file.type)
                                    ) {
                                      toast.error(
                                        "Please upload a valid image file (JPG, PNG, or WebP)"
                                      );
                                      return;
                                    }

                                    // Create temporary URL for dimension checking
                                    const tempUrl = URL.createObjectURL(file);
                                    const img = new Image();

                                    img.onload = function () {
                                      URL.revokeObjectURL(tempUrl);
                                      if (
                                        this.width < 1920 ||
                                        this.height < 1080
                                      ) {
                                        toast.error(
                                          "Image resolution should be 1920x1080 or higher"
                                        );
                                        return;
                                      }
                                      onChange(file);
                                    };

                                    img.onerror = function () {
                                      URL.revokeObjectURL(tempUrl);
                                      toast.error("Failed to load image");
                                    };

                                    img.src = tempUrl;
                                  }}
                                />
                              </div>
                            </div>
                          </FormControl>
                          <FormDescription className="text-muted-foreground dark:text-zinc-400">
                            Upload a high-quality cover image to make your
                            course stand out
                          </FormDescription>
                          <FormMessage className="dark:text-red-400" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="previewVideo"
                      render={() => (
                        <FormItem>
                          <FormLabel>Preview Video</FormLabel>
                          <VideoUploadSection
                            uploadState={uploadState}
                            setUploadState={setUploadState}
                            videoData={videoData}
                            onUploadComplete={handleVideoUploadComplete}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="curriculum" className="mt-0">
                  <Accordion type="single" collapsible defaultValue="features">
                    <AccordionItem value="features" className="border-b-0">
                      <AccordionTrigger className="text-foreground dark:text-zinc-200 hover:no-underline">
                        Course Features
                      </AccordionTrigger>
                      <AccordionContent>
                        <FormField
                          control={form.control}
                          name="features"
                          render={({ field }) => (
                            <FormItem className="space-y-1">
                              <FormDescription className="text-muted-foreground dark:text-zinc-400">
                                List the key features of your course
                              </FormDescription>
                              <div className="space-y-2">
                                {field.value.map((_, index) => (
                                  <div key={index} className="flex gap-2">
                                    <Input
                                      value={field.value[index]}
                                      onChange={(e) => {
                                        const newFeatures = [...field.value];
                                        newFeatures[index] = e.target.value;
                                        field.onChange(newFeatures);
                                      }}
                                      placeholder="e.g., Hands-on Projects"
                                      className="dark:border-[#2A3F47] dark:bg-[#202F36]/50 dark:placeholder:text-zinc-500 dark:text-zinc-300"
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      onClick={() => {
                                        const newFeatures = field.value.filter(
                                          (_, i) => i !== index
                                        );
                                        field.onChange(newFeatures);
                                      }}
                                      className="dark:border-[#2A3F47] dark:bg-transparent dark:hover:bg-[#2A3F47]/50 dark:text-zinc-400 hover:dark:text-zinc-300"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    field.onChange([...field.value, ""])
                                  }
                                  className="dark:border-[#2A3F47] dark:bg-transparent dark:hover:bg-[#2A3F47]/50 dark:text-zinc-300"
                                >
                                  Add Feature
                                </Button>
                              </div>
                              <FormMessage className="dark:text-red-400" />
                            </FormItem>
                          )}
                        />
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="outcomes" className="border-b-0">
                      <AccordionTrigger className="text-foreground dark:text-zinc-200 hover:no-underline">
                        Learning Outcomes
                      </AccordionTrigger>
                      <AccordionContent>
                        <FormField
                          control={form.control}
                          name="learningOutcomes"
                          render={({ field }) => (
                            <FormItem className="space-y-1">
                              <FormDescription className="text-muted-foreground dark:text-zinc-400">
                                What will students learn from this course?
                              </FormDescription>
                              <div className="space-y-2">
                                {field.value.map((_, index) => (
                                  <div key={index} className="flex gap-2">
                                    <Input
                                      value={field.value[index]}
                                      onChange={(e) => {
                                        const newOutcomes = [...field.value];
                                        newOutcomes[index] = e.target.value;
                                        field.onChange(newOutcomes);
                                      }}
                                      placeholder="e.g., Build full-stack applications"
                                      className="dark:border-[#2A3F47] dark:bg-[#202F36]/50 dark:placeholder:text-zinc-500 dark:text-zinc-300"
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      onClick={() => {
                                        const newOutcomes = field.value.filter(
                                          (_, i) => i !== index
                                        );
                                        field.onChange(newOutcomes);
                                      }}
                                      className="dark:border-[#2A3F47] dark:bg-transparent dark:hover:bg-[#2A3F47]/50 dark:text-zinc-400 hover:dark:text-zinc-300"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    field.onChange([...field.value, ""])
                                  }
                                  className="dark:border-[#2A3F47] dark:bg-transparent dark:hover:bg-[#2A3F47]/50 dark:text-zinc-300"
                                >
                                  Add Learning Outcome
                                </Button>
                              </div>
                              <FormMessage className="dark:text-red-400" />
                            </FormItem>
                          )}
                        />
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="requirements" className="border-0">
                      <AccordionTrigger className="text-foreground dark:text-zinc-200 hover:no-underline">
                        Course Requirements
                      </AccordionTrigger>
                      <AccordionContent>
                        <FormField
                          control={form.control}
                          name="requirements"
                          render={({ field }) => (
                            <FormItem className="space-y-1">
                              <FormDescription className="text-muted-foreground dark:text-zinc-400">
                                What prerequisites do students need?
                              </FormDescription>
                              <div className="space-y-2">
                                {field.value.map((_, index) => (
                                  <div key={index} className="flex gap-2">
                                    <Input
                                      value={field.value[index]}
                                      onChange={(e) => {
                                        const newRequirements = [
                                          ...field.value,
                                        ];
                                        newRequirements[index] = e.target.value;
                                        field.onChange(newRequirements);
                                      }}
                                      placeholder="e.g., Basic JavaScript knowledge"
                                      className="dark:border-[#2A3F47] dark:bg-[#202F36]/50 dark:placeholder:text-zinc-500 dark:text-zinc-300"
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      onClick={() => {
                                        const newRequirements =
                                          field.value.filter(
                                            (_, i) => i !== index
                                          );
                                        field.onChange(newRequirements);
                                      }}
                                      className="dark:border-[#2A3F47] dark:bg-transparent dark:hover:bg-[#2A3F47]/50 dark:text-zinc-400 hover:dark:text-zinc-300"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    field.onChange([...field.value, ""])
                                  }
                                  className="dark:border-[#2A3F47] dark:bg-transparent dark:hover:bg-[#2A3F47]/50 dark:text-zinc-300"
                                >
                                  Add Requirement
                                </Button>
                              </div>
                              <FormMessage className="dark:text-red-400" />
                            </FormItem>
                          )}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </TabsContent>

                <div className="flex justify-end gap-2 pt-6 border-t dark:border-[#2A3F47] sticky bottom-0 bg-background dark:bg-[#202F36]/95 backdrop-blur-sm">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleDialogClose}
                    className="dark:border-[#2A3F47] dark:bg-transparent dark:hover:bg-[#2A3F47]/50 dark:text-zinc-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={updateCourseMutation.isPending}
                    className="bg-violet-600 hover:bg-violet-700 text-white dark:bg-violet-500 dark:hover:bg-violet-600"
                  >
                    {updateCourseMutation.isPending
                      ? "Updating..."
                      : "Update Course"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function StatsDialog() {
  const { data: coursesData } = useCoordinatorCourses();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="icon"
          className="group fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 p-0 shadow-lg transition-all duration-500 hover:scale-110 hover:shadow-xl dark:from-violet-600 dark:to-purple-600"
        >
          {/* Animated background effects */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-400/0 to-purple-400/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0deg_180deg,white_180deg_360deg)] opacity-10 blur-xl animate-spin-slow" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-t from-white/20 to-transparent" />
          </div>

          {/* Pulsing ring effect */}
          <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 opacity-0 blur transition-all duration-500 group-hover:opacity-30 group-hover:blur-md" />

          {/* Icon container */}
          <div className="relative flex h-full w-full items-center justify-center">
            {/* Main icon */}
            <BarChart2 className="h-6 w-6 text-white transition-transform duration-500 group-hover:scale-110" />

            {/* Floating particles */}
            <div className="absolute inset-0">
              <div className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 group-hover:animate-particle-1" />
              <div className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 group-hover:animate-particle-2" />
              <div className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 group-hover:animate-particle-3" />
            </div>

            {/* Ripple effect */}
            <div className="absolute inset-0 animate-ping rounded-full bg-white/20 duration-1000" />
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] p-0 gap-0 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border-zinc-200/50 dark:border-zinc-800/50">
        <div className="p-6 pb-0">
          <DialogHeader>
            <DialogTitle className="text-2xl tracking-tight dark:text-zinc-100">
              Course Analytics
            </DialogTitle>
            <DialogDescription className="text-base dark:text-zinc-400">
              Real-time insights into your course performance
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6">
          <motion.div
            className="grid grid-cols-3 gap-6"
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            {/* Total Courses */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500/[0.07] to-purple-500/[0.07] dark:from-violet-500/[0.15] dark:to-purple-500/[0.15] p-6 hover:from-violet-500/[0.12] hover:to-purple-500/[0.12] dark:hover:from-violet-500/[0.2] dark:hover:to-purple-500/[0.2] transition-all duration-300"
            >
              <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-violet-500/10 blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-4">
                  <div className="p-2 w-fit rounded-xl bg-violet-500/10 dark:bg-violet-500/20">
                    <BookOpen className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                      Total Courses
                    </p>
                    <div className="flex items-center gap-2">
                      <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
                      >
                        {coursesData?.courses?.length || 0}
                      </motion.span>
                      <span className="flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        12%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="h-1 w-full bg-violet-500/10 dark:bg-violet-500/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-violet-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "60%" }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Active Students */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/[0.07] to-cyan-500/[0.07] dark:from-blue-500/[0.15] dark:to-cyan-500/[0.15] p-6 hover:from-blue-500/[0.12] hover:to-cyan-500/[0.12] dark:hover:from-blue-500/[0.2] dark:hover:to-cyan-500/[0.2] transition-all duration-300"
            >
              <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-4">
                  <div className="p-2 w-fit rounded-xl bg-blue-500/10 dark:bg-blue-500/20">
                    <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                      Active Students
                    </p>
                    <div className="flex items-center gap-2">
                      <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
                      >
                        479
                      </motion.span>
                      <span className="flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        20.1%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="h-1 w-full bg-blue-500/10 dark:bg-blue-500/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-blue-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "80%" }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Average Rating */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-500/[0.07] to-orange-500/[0.07] dark:from-yellow-500/[0.15] dark:to-orange-500/[0.15] p-6 hover:from-yellow-500/[0.12] hover:to-orange-500/[0.12] dark:hover:from-yellow-500/[0.2] dark:hover:to-orange-500/[0.2] transition-all duration-300"
            >
              <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-yellow-500/10 blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-4">
                  <div className="p-2 w-fit rounded-xl bg-yellow-500/10 dark:bg-yellow-500/20">
                    <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                      Average Rating
                    </p>
                    <div className="flex items-center gap-2">
                      <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
                      >
                        4.8
                      </motion.span>
                      <span className="flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        0.5%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="h-1 w-full bg-yellow-500/10 dark:bg-yellow-500/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-yellow-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "95%" }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Add this after your imports
const cleanupModalEffects = () => {
  // Reset body pointer events
  document.body.style.pointerEvents = "";

  // Remove any lingering overlays
  const overlays = document.querySelectorAll('[role="dialog"]');
  overlays.forEach((overlay) => {
    if (
      !overlay.hasAttribute("data-state") ||
      overlay.getAttribute("data-state") === "closed"
    ) {
      overlay.remove();
    }
  });

  // Remove any lingering backdrops
  const backdrops = document.querySelectorAll("[data-radix-portal]");
  backdrops.forEach((backdrop) => {
    if (!backdrop.hasChildNodes()) {
      backdrop.remove();
    }
  });
};

function Courses() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [level, setLevel] = useState("all");

  const { data: coursesData, isLoading, error } = useCoordinatorCourses();

  // Filter courses based on search, status, and level
  const filteredCourses = useMemo(() => {
    if (!coursesData?.courses) return [];

    return coursesData.courses.filter((course) => {
      const matchesSearch = course.title
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus = status === "all" || course.status === status;
      const matchesLevel = level === "all" || course.level === level;

      return matchesSearch && matchesStatus && matchesLevel;
    });
  }, [coursesData?.courses, search, status, level]);

  useEffect(() => {
    // Cleanup on component mount and unmount
    cleanupModalEffects();
    return () => {
      cleanupModalEffects();
    };
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading courses: {error.message}</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-6">
        {/* Title and Create Button */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground dark:text-white">
              Courses
            </h1>
            <p className="text-muted-foreground dark:text-[#8B949E]">
              Manage and monitor your courses
            </p>
          </div>
          <CreateCourseDialog />
        </div>

        {/* Search and Filters Row */}
        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses by title..."
              className="pl-10 w-full bg-white/50 dark:bg-[#202F36]/50 backdrop-blur-sm border-zinc-200 dark:border-[#2A3F47] dark:text-zinc-100 dark:placeholder:text-zinc-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[130px] bg-white/50 dark:bg-[#202F36]/50 backdrop-blur-sm border-zinc-200 dark:border-[#2A3F47] dark:text-zinc-100">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "h-2 w-2 rounded-full",
                      status === "published"
                        ? "bg-emerald-500"
                        : status === "draft"
                        ? "bg-zinc-400"
                        : "bg-blue-500"
                    )}
                  />
                  <SelectValue
                    placeholder="Status"
                    className="dark:text-zinc-400"
                  />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>

            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger className="w-[130px] bg-white/50 dark:bg-[#202F36]/50 backdrop-blur-sm border-zinc-200 dark:border-[#2A3F47] dark:text-zinc-100">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <SelectValue
                    placeholder="Level"
                    className="dark:text-zinc-400"
                  />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.map((course) => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>

      <StatsDialog />
    </div>
  );
}

export default Courses;
