import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { useCategories } from "@/api/categories";
import { useCreateCourse } from "@/api/courses";
import { toast } from "sonner";
import { VideoUploadSection } from "./VideoUploadSection";
import { X, ImageIcon, ArrowUpRight, Monitor, Plus } from "lucide-react";
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
  features: z.array(z.string().min(1, "Feature cannot be empty")).default([]),
  learningOutcomes: z
    .array(z.string().min(1, "Learning outcome cannot be empty"))
    .default([]),
  requirements: z
    .array(z.string().min(1, "Requirement cannot be empty"))
    .default([]),
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

function CreateCourseDialog() {
  const [open, setOpen] = useState(false);
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
    setOpen(false);
    setUploadState("idle");
    setVideoData(null);
    form.reset();
  };

  const onSubmit = async (data) => {
    try {
      // Filter out empty strings from arrays
      const cleanedData = {
        ...data,
        features: data.features.filter((item) => item.trim() !== ""),
        learningOutcomes: data.learningOutcomes.filter(
          (item) => item.trim() !== ""
        ),
        requirements: data.requirements.filter((item) => item.trim() !== ""),
      };

      await createCourseMutation.mutateAsync(cleanedData);
      toast.success("Course created successfully");
      handleDialogClose(); // Close dialog after successful creation
    } catch (error) {
      toast.error("Failed to create course");
      console.error("Course creation error:", error);
    }
  };

  // Add this validation before upload
  const validateImage = (file) => {
    // Check file type
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Please upload a JPEG, PNG, or WebP image");
      return false;
    }

    // Check file size (e.g., 5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return false;
    }

    return true;
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          handleDialogClose();
        }
        setOpen(isOpen);
      }}
    >
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

                                    if (!validateImage(file)) {
                                      e.target.value = "";
                                      return;
                                    }

                                    // Create temporary URL for dimension checking
                                    const tempUrl = URL.createObjectURL(file);
                                    const img = new Image();

                                    img.onload = function () {
                                      URL.revokeObjectURL(tempUrl);
                                      onChange(file);
                                    };

                                    img.onerror = function () {
                                      URL.revokeObjectURL(tempUrl);
                                      toast.error("Failed to load image");
                                      e.target.value = "";
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
                      createCourseMutation.isPending
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

export default CreateCourseDialog;
