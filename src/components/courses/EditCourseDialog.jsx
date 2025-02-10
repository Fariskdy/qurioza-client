import PropTypes from "prop-types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { useState, useEffect } from "react";
import { useCategories } from "@/api/categories";
import { useUpdateCourse } from "@/api/courses";
import { toast } from "sonner";
import { VideoUploadSection } from "./VideoUploadSection";
import {
  GraduationCap,
  X,
  ImageIcon,
  ArrowUpRight,
  Monitor,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Course form schema
const courseFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Please select a category"),
  coordinator: z.string().optional(),
  duration: z.number().min(1, "Duration must be at least 1 week"),
  totalHours: z.number().min(1, "Total hours must be at least 1"),
  price: z.number().min(0, "Price cannot be negative"),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]),
  status: z.enum(["draft", "published"]).default("draft"),
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
});

function EditCourseDialog({ course, open, onOpenChange }) {
  const updateCourseMutation = useUpdateCourse();
  const { data: categories } = useCategories();

  const form = useForm({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: course?.title || "",
      description: course?.description || "",
      category: course?.category?._id || "",
      duration: course?.duration || 1,
      totalHours: course?.totalHours || 1,
      price: course?.price || 0,
      level: course?.level || "Beginner",
      features: course?.features || [],
      learningOutcomes: course?.learningOutcomes || [],
      requirements: course?.requirements || [],
      status: course?.status || "draft",
    },
  });

  const onSubmit = async (data) => {
    try {
      await updateCourseMutation.mutateAsync({
        id: course._id,
        ...data,
      });
      toast.success("Course updated successfully");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to update course");
      console.error("Course update error:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>Edit Course</DialogTitle>
          <DialogDescription>Update your course information</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="flex-1 flex flex-col min-h-0">
          <TabsList className="w-full px-6 border-b dark:border-[#2A3F47]">
            <TabsTrigger
              value="basic"
              className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary dark:text-[#8B949E] dark:data-[state=active]:text-[#E3E5E5] dark:data-[state=active]:border-[#0B4F6C] px-4 py-2 hover:text-primary/80 dark:hover:text-[#E3E5E5] transition-colors"
            >
              Basic Information
            </TabsTrigger>
            <TabsTrigger
              value="curriculum"
              className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary dark:text-[#8B949E] dark:data-[state=active]:text-[#E3E5E5] dark:data-[state=active]:border-[#0B4F6C] px-4 py-2 hover:text-primary/80 dark:hover:text-[#E3E5E5] transition-colors"
            >
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
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="dark:border-[#2A3F47] dark:bg-[#202F36]/50">
                                  <SelectValue
                                    placeholder="Select level"
                                    className="dark:text-zinc-400"
                                  />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="dark:border-[#2A3F47] dark:bg-[#202F36]">
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
                              <FormDescription>
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
                                      className="dark:border-[#2A3F47] dark:bg-[#202F36]/50 dark:placeholder:text-zinc-500"
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      className="dark:border-[#2A3F47] dark:bg-transparent dark:hover:bg-[#2A3F47]/50 dark:text-zinc-400 hover:dark:text-zinc-300"
                                      onClick={() => {
                                        const newFeatures = field.value.filter(
                                          (_, i) => i !== index
                                        );
                                        field.onChange(newFeatures);
                                      }}
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
                              <FormDescription>
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
                                      className="dark:border-[#2A3F47] dark:bg-[#202F36]/50 dark:placeholder:text-zinc-500"
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      className="dark:border-[#2A3F47] dark:bg-transparent dark:hover:bg-[#2A3F47]/50 dark:text-zinc-400 hover:dark:text-zinc-300"
                                      onClick={() => {
                                        const newOutcomes = field.value.filter(
                                          (_, i) => i !== index
                                        );
                                        field.onChange(newOutcomes);
                                      }}
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
                              <FormDescription>
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
                                      className="dark:border-[#2A3F47] dark:bg-[#202F36]/50 dark:placeholder:text-zinc-500"
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      className="dark:border-[#2A3F47] dark:bg-transparent dark:hover:bg-[#2A3F47]/50 dark:text-zinc-400 hover:dark:text-zinc-300"
                                      onClick={() => {
                                        const newRequirements =
                                          field.value.filter(
                                            (_, i) => i !== index
                                          );
                                        field.onChange(newRequirements);
                                      }}
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
                    onClick={() => onOpenChange(false)}
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

EditCourseDialog.propTypes = {
  course: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
};

export default EditCourseDialog;
