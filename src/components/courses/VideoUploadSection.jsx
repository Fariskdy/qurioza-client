import PropTypes from "prop-types";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMediaUpload } from "@/api/media";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Upload,
  Clock,
  ArrowUpRight,
  FileText,
  X,
  PlayCircle,
  CheckCircle,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function VideoUploadSection({
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

VideoUploadSection.propTypes = {
  uploadState: PropTypes.oneOf(["idle", "uploading", "completed", "error"])
    .isRequired,
  setUploadState: PropTypes.func.isRequired,
  videoData: PropTypes.shape({
    _id: PropTypes.string,
    url: PropTypes.string,
    thumbnail: PropTypes.string,
    originalName: PropTypes.string,
    size: PropTypes.number,
    duration: PropTypes.string,
  }),
  onUploadComplete: PropTypes.func.isRequired,
};

export default VideoUploadSection;
