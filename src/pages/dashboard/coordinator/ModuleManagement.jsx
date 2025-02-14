import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChevronRight,
  Clock,
  Plus,
  GripVertical,
  Pencil,
  Trash,
  FileText,
  Video,
  Link as LinkIcon,
  ClipboardList,
  MoreVertical,
  LayoutGrid,
  Copy,
  Settings2,
  ChevronDown,
  X,
  Upload,
  Play,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Label as FormLabel } from "@/components/ui/label";
import { Input as FormInput } from "@/components/ui/input";
import { Textarea as FormTextarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  useModules,
  useCreateModule,
  useDeleteModule,
  useReorderModule,
  useAddModuleContent,
  useDeleteModuleContent,
  useReorderModuleContent,
  useUpdateModule,
  useUpdateModuleContent,
  moduleKeys,
} from "@/api/modules";
import { useCourse } from "@/api/courses";
import { useMediaUpload } from "@/api/media";
import { useQueryClient } from "@tanstack/react-query";
import { SecureViewer } from "@/components/SecureViewer";

function StrictModeDroppable({ children, ...props }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));

    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return <Droppable {...props}>{children}</Droppable>;
}

export function ModuleManagement() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedModuleForContent, setSelectedModuleForContent] =
    useState(null);
  const [addContentDialogOpen, setAddContentDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [moduleToEdit, setModuleToEdit] = useState(null);

  const queryClient = useQueryClient();

  // Get course data first
  const {
    data: course,
    isLoading: courseLoading,
    error: courseError,
  } = useCourse(slug);

  // Only fetch modules when we have the course
  const {
    data: modules,
    isLoading: modulesLoading,
    error: modulesError,
  } = useModules(course?._id, {
    enabled: !!course, // Only run query when course exists
  });

  // Setup mutations
  const createModuleMutation = useCreateModule();
  const deleteModuleMutation = useDeleteModule();
  const reorderModuleMutation = useReorderModule();
  const addContentMutation = useAddModuleContent();
  const deleteContentMutation = useDeleteModuleContent();
  const reorderContentMutation = useReorderModuleContent();
  const updateModuleMutation = useUpdateModule();
  const updateContentMutation = useUpdateModuleContent();

  // Handle loading states
  if (courseLoading || modulesLoading) {
    return <ModuleSkeleton />;
  }

  // Handle error states
  if (courseError) {
    return <div>Error loading course: {courseError.message}</div>;
  }

  if (modulesError) {
    return <div>Error loading modules: {modulesError.message}</div>;
  }

  // Handle case where course doesn't exist
  if (!course) {
    return <div>Course not found</div>;
  }

  const handleCreateModule = async (data) => {
    try {
      await createModuleMutation.mutateAsync({
        courseId: course._id,
        moduleData: data,
      });
      toast.success("Module created successfully");
      setCreateDialogOpen(false);
    } catch (error) {
      toast.error("Failed to create module");
    }
  };

  const handleDeleteModule = async () => {
    try {
      await deleteModuleMutation.mutateAsync({
        courseId: course._id,
        moduleId: selectedModule._id,
      });
      toast.success("Module deleted successfully");
      setDeleteDialogOpen(false);
    } catch (error) {
      toast.error("Failed to delete module");
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    try {
      const moduleToMove = modules[sourceIndex];

      // Optimistically update the UI
      const newModules = Array.from(modules);
      newModules.splice(sourceIndex, 1);
      newModules.splice(destinationIndex, 0, moduleToMove);

      // Update the order property of affected modules
      const updatedModules = newModules.map((module, index) => ({
        ...module,
        order: index,
      }));

      // Update the backend
      await reorderModuleMutation.mutateAsync({
        courseId: course._id,
        moduleId: moduleToMove._id,
        newOrder: destinationIndex,
      });

      toast.success("Module order updated");
    } catch (error) {
      toast.error("Failed to reorder modules");
    }
  };

  const handleAddContent = async (moduleId, contentData) => {
    try {
      console.log("Sending content data:", contentData);

      // Find the module by moduleId
      const currentModule = modules.find((m) => m._id === moduleId);
      if (!currentModule) {
        throw new Error("Module not found");
      }

      await addContentMutation.mutateAsync({
        courseId: course._id,
        moduleId,
        contentData: {
          ...contentData,
          order: currentModule.content?.length || 0,
        },
      });

      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: moduleKeys.list(course._id) });

      toast.success("Content added successfully");
      setAddContentDialogOpen(false);
    } catch (error) {
      console.error("Add content error:", error);
      toast.error(error.response?.data?.message || "Failed to add content");
    }
  };

  const handleEditModule = async (data) => {
    try {
      await updateModuleMutation.mutateAsync({
        courseId: course._id,
        moduleId: moduleToEdit._id,
        moduleData: data,
      });
      toast.success("Module updated successfully");
      setEditDialogOpen(false);
      setModuleToEdit(null);
    } catch (error) {
      toast.error("Failed to update module");
    }
  };

  const handleAddContentClick = (moduleId) => {
    setSelectedModuleForContent(moduleId);
    setAddContentDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="border-b dark:border-[#2A3F47] pb-6">
        <div className="container mx-auto space-y-4">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center">
            <nav className="flex items-center text-sm">
              <Link
                to="/dashboard/courses"
                className="text-muted-foreground hover:text-violet-600 dark:hover:text-violet-400 transition-colors flex items-center gap-1.5"
              >
                <BookOpen className="h-4 w-4" />
                <span>Courses</span>
              </Link>

              <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground/50" />

              <Link
                to={`/dashboard/courses/${slug}`}
                className="text-muted-foreground hover:text-violet-600 dark:hover:text-violet-400 transition-colors max-w-[200px] truncate"
              >
                {course.title}
              </Link>

              <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground/50" />

              <span className="text-foreground dark:text-white font-medium flex items-center gap-1.5">
                <LayoutGrid className="h-4 w-4 text-violet-500" />
                Modules
              </span>
            </nav>
          </div>

          {/* Course Info */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground dark:text-zinc-100">
                {course.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground dark:text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <LayoutGrid className="h-4 w-4" />
                  <span>{modules?.length || 0} Modules</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>{course.duration} Weeks</span>
                </div>
                <Badge
                  variant={
                    course.status === "published" ? "success" : "secondary"
                  }
                  className={cn(
                    "text-xs",
                    course.status === "published"
                      ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                      : "bg-zinc-100 dark:bg-zinc-800"
                  )}
                >
                  {course.status === "published" ? "Published" : "Draft"}
                </Badge>
              </div>
            </div>

            {modules?.length > 0 && (
              <Button
                onClick={() => setCreateDialogOpen(true)}
                className="gap-2 bg-violet-600 hover:bg-violet-700 dark:bg-violet-600 dark:hover:bg-violet-700 text-white"
              >
                <Plus className="h-4 w-4" />
                New Module
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Course Info */}
          <div className="col-span-3">
            <Card className="sticky top-6 group relative border dark:border-[#2A3F47] dark:bg-[#202F36] hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg font-medium group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                  Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground dark:text-zinc-400">
                      Total Modules
                    </span>
                    <Badge
                      variant="outline"
                      className="bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-800"
                    >
                      {modules.length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground dark:text-zinc-400">
                      Total Duration
                    </span>
                    <Badge
                      variant="outline"
                      className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                    >
                      {modules.reduce((acc, m) => acc + m.duration, 0)} mins
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground dark:text-zinc-400">
                      Total Lectures
                    </span>
                    <Badge
                      variant="outline"
                      className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                    >
                      {modules.reduce((acc, m) => acc + m.lectureCount, 0)}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground dark:text-zinc-400">
                      Published
                    </span>
                    <Badge
                      variant="outline"
                      className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800"
                    >
                      {modules.filter((m) => m.status === "published").length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground dark:text-zinc-400">
                      Draft
                    </span>
                    <Badge
                      variant="outline"
                      className="bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800"
                    >
                      {modules.filter((m) => m.status === "draft").length}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Module List */}
          <div className="col-span-9 space-y-6">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground dark:text-zinc-100">
                Course Modules
              </h1>
              <p className="text-sm text-muted-foreground dark:text-zinc-400">
                Manage and organize your course modules and their content
              </p>
            </div>

            {/* Module List */}
            <DragDropContext onDragEnd={onDragEnd}>
              <StrictModeDroppable droppableId="modules">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-4"
                  >
                    {modules?.length === 0 ? (
                      <EmptyModules
                        onCreateModule={() => setCreateDialogOpen(true)}
                      />
                    ) : (
                      modules.map((module, index) => (
                        <Draggable
                          key={module._id}
                          draggableId={module._id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={cn(
                                "transition-all duration-150",
                                snapshot.isDragging && "scale-105"
                              )}
                            >
                              <ModuleCard
                                module={module}
                                dragHandleProps={provided.dragHandleProps}
                                onDelete={() => {
                                  setSelectedModule(module);
                                  setDeleteDialogOpen(true);
                                }}
                                onEdit={() => {
                                  setModuleToEdit(module);
                                  setEditDialogOpen(true);
                                }}
                                onAddContent={handleAddContent}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </StrictModeDroppable>
            </DragDropContext>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <CreateModuleDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateModule}
      />

      {selectedModule && (
        <DeleteModuleDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDeleteModule}
          moduleName={selectedModule.title}
        />
      )}

      {selectedModuleForContent && (
        <AddContentDialog
          open={addContentDialogOpen}
          onOpenChange={setAddContentDialogOpen}
          onSubmit={handleAddContent}
          moduleId={selectedModuleForContent}
        />
      )}

      {moduleToEdit && (
        <EditModuleDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSubmit={handleEditModule}
          module={moduleToEdit}
        />
      )}
    </div>
  );
}

function ModuleCard({
  module,
  dragHandleProps,
  onDelete,
  onEdit,
  onAddContent,
}) {
  const { slug } = useParams();
  const { data: course } = useCourse(slug);
  const [isOpen, setIsOpen] = useState(false);
  const [isAddingContent, setIsAddingContent] = useState(false);
  const mediaUpload = useMediaUpload();
  const addContentMutation = useAddModuleContent();
  const reorderContentMutation = useReorderModuleContent();
  const deleteContentMutation = useDeleteModuleContent();
  const [deleteContentDialogOpen, setDeleteContentDialogOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editContentDialogOpen, setEditContentDialogOpen] = useState(false);
  const [editField, setEditField] = useState(null);
  const updateContentMutation = useUpdateModuleContent();

  const handleContentReorder = async (result) => {
    if (!result.destination || !course) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    // Skip if position hasn't changed
    if (sourceIndex === destinationIndex) return;

    try {
      await reorderContentMutation.mutateAsync({
        courseId: course._id,
        moduleId: module._id,
        contentId: result.draggableId,
        newOrder: destinationIndex,
      });

      // Toast success message
      toast.success("Content order updated");
    } catch (error) {
      console.error("Content reorder error:", error);
      toast.error("Failed to reorder content");
    }
  };

  const handleContentDelete = async (moduleId, contentId) => {
    if (!course) return;

    try {
      await deleteContentMutation.mutateAsync({
        courseId: course._id,
        moduleId,
        contentId,
      });
      toast.success("Content deleted successfully");
    } catch (error) {
      toast.error("Failed to delete content");
    }
  };

  const getContentTypeCount = (type) => {
    return (module.content || []).filter((item) => item?.type === type).length;
  };

  const getContentTypeIcon = (type) => {
    if (!type) return null;
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />;
      case "document":
        return <FileText className="h-4 w-4" />;
      case "link":
        return <LinkIcon className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const status = module.status || "draft";
  const isOptional = module.isOptional || false;

  const handleContentSubmit = async (data) => {
    if (!course) return;
    try {
      console.log("Form data received:", data);
      let contentData = {
        title: data.title,
        type: data.type,
        isPreview: data.isPreview,
        uniqueId: data.uniqueId,
      };

      if (data.type === "video") {
        if (!data.mediaId || !data.url) {
          toast.error("Video upload failed or incomplete");
          return;
        }
        contentData.mediaId = data.mediaId;
        contentData.url = data.url;
      } else if (data.type === "document") {
        if (!data.file) {
          toast.error("Please select a document");
          return;
        }
        contentData.file = data.file;
      } else if (data.type === "link") {
        if (!data.url) {
          toast.error("Please enter a valid URL");
          return;
        }
        contentData.url = data.url;
      }

      console.log("Content data being sent:", contentData);
      await onAddContent(module._id, contentData);
      setIsAddingContent(false);
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Failed to add content");
    }
  };

  const handleDeleteContent = async (content) => {
    setSelectedContent(content);
    setDeleteContentDialogOpen(true);
  };

  const confirmDeleteContent = async () => {
    if (!selectedContent || !course) return;

    try {
      setLoading(true);
      await deleteContentMutation.mutateAsync({
        courseId: course._id,
        moduleId: module._id,
        contentId: selectedContent._id,
      });

      // Close dialog first
      setDeleteContentDialogOpen(false);

      // Clear selected content
      setSelectedContent(null);

      // Show success message
      toast.success("Content deleted successfully");
    } catch (error) {
      console.error("Delete content error:", error);
      toast.error("Failed to delete content");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleEditContent = (content, field) => {
    setSelectedContent(content);
    setEditField(field);
    setEditContentDialogOpen(true);
  };

  const handleContentUpdate = async (data) => {
    if (!course || !selectedContent) return;

    try {
      setLoading(true);
      const result = await updateContentMutation.mutateAsync({
        courseId: course._id,
        moduleId: module._id,
        contentId: selectedContent._id,
        contentData: {
          [editField]: data[editField],
        },
      });

      // Close dialog first
      setEditContentDialogOpen(false);

      // Clear selected content
      setSelectedContent(null);

      // Show success message
      toast.success("Content updated successfully");
    } catch (error) {
      console.error("Update content error:", error);
      toast.error("Failed to update content");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const contentDropdownMenu = (content) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-full">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {/* Edit title for all content types */}
        <DropdownMenuItem onClick={() => handleEditContent(content, "title")}>
          <Pencil className="h-4 w-4 mr-2" />
          Edit Title
        </DropdownMenuItem>
        {/* Edit URL for link type only */}
        {content.type === "link" && (
          <DropdownMenuItem onClick={() => handleEditContent(content, "url")}>
            <LinkIcon className="h-4 w-4 mr-2" />
            Edit URL
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => handleDeleteContent(content)}
          className="text-red-600 dark:text-red-400"
        >
          <Trash className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative"
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <Card className="group relative border dark:border-[#2A3F47] dark:bg-[#202F36] hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  {...dragHandleProps}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100/50 dark:bg-violet-900/20 cursor-move"
                >
                  <GripVertical className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-lg font-semibold group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                      {module.title}
                    </CardTitle>
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 hover:bg-violet-100 dark:hover:bg-violet-900/20"
                      >
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform text-violet-600 dark:text-violet-400",
                            {
                              "transform rotate-180": isOpen,
                            }
                          )}
                        />
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl">
                    {module.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    module.status === "published" ? "success" : "secondary"
                  }
                  className={cn(
                    "px-2.5 py-0.5 text-xs font-medium",
                    module.status === "published"
                      ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                      : "bg-zinc-100 dark:bg-zinc-800"
                  )}
                >
                  {module.status === "published" ? (
                    <div className="flex items-center gap-1">
                      <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Published
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <span className="flex h-1.5 w-1.5 rounded-full bg-zinc-500" />
                      Draft
                    </div>
                  )}
                </Badge>

                {module.isOptional && (
                  <Badge
                    variant="outline"
                    className="bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800"
                  >
                    Optional
                  </Badge>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-violet-100 dark:hover:bg-violet-900/20"
                    >
                      <Settings2 className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={onEdit} className="gap-2">
                      <Pencil className="h-4 w-4" /> Edit Module
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2">
                      <Copy className="h-4 w-4" /> Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={onDelete}
                      className="text-red-600 dark:text-red-400 gap-2"
                    >
                      <Trash className="h-4 w-4" /> Delete Module
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Module Stats with minimal design */}
            <div className="mt-4 flex items-center gap-6">
              <div className="flex items-center gap-1.5 text-violet-600 dark:text-violet-400">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {module.calculatedDuration} mins
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-violet-600 dark:text-violet-400">
                <FileText className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {module.calculatedLectureCount} lectures
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-800"
                >
                  <Video className="h-3 w-3 mr-1" />{" "}
                  {getContentTypeCount("video")}
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                >
                  <FileText className="h-3 w-3 mr-1" />{" "}
                  {getContentTypeCount("document")}
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                >
                  <LinkIcon className="h-3 w-3 mr-1" />{" "}
                  {getContentTypeCount("link")}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="space-y-6">
                {/* Move Content Header and Add Content Form to the top */}
                <div className="space-y-4">
                  {/* Content Header */}
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Module Content</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:text-violet-600"
                      onClick={() => setIsAddingContent(!isAddingContent)}
                    >
                      <Plus className="h-4 w-4" />
                      Add Content
                    </Button>
                  </div>

                  {/* Add Content Form - Moved here */}
                  {isAddingContent && (
                    <AddContentForm
                      onSubmit={handleContentSubmit}
                      onCancel={() => setIsAddingContent(false)}
                    />
                  )}
                </div>

                {/* Content List */}
                <div className="space-y-4">
                  {module.content?.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      No content added yet
                    </div>
                  ) : (
                    <DragDropContext onDragEnd={handleContentReorder}>
                      <StrictModeDroppable
                        droppableId={`module-${module._id}-content`}
                      >
                        {(provided) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="space-y-3"
                          >
                            {module.content
                              ?.slice()
                              .sort((a, b) => a.order - b.order)
                              .map((content, index) => (
                                <Draggable
                                  key={content._id}
                                  draggableId={content._id}
                                  index={index}
                                >
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      className={cn(
                                        "group relative rounded-full border dark:border-[#2A3F47] p-2.5",
                                        "transition-all duration-200",
                                        "bg-white dark:bg-[#1F2937]",
                                        "my-1",
                                        snapshot.isDragging &&
                                          "shadow-lg scale-[1.02]",
                                        !snapshot.isDragging &&
                                          "hover:border-violet-200 dark:hover:border-violet-800"
                                      )}
                                    >
                                      <div className="flex items-center gap-3">
                                        {/* Drag Handle */}
                                        <div
                                          {...provided.dragHandleProps}
                                          className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/50 dark:bg-muted/20 cursor-move opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                                        </div>

                                        {/* Content Type Icon */}
                                        <div
                                          className={cn(
                                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                                            content.type === "video" &&
                                              "bg-violet-100/50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400",
                                            content.type === "document" &&
                                              "bg-blue-100/50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
                                            content.type === "link" &&
                                              "bg-emerald-100/50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                                          )}
                                        >
                                          {getContentTypeIcon(content.type)}
                                        </div>

                                        {/* Content Info */}
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center justify-between group/title">
                                            <div className="flex items-center gap-2">
                                              <span className="font-medium">
                                                {content.title}
                                              </span>
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 w-6 p-0 opacity-0 group-hover/title:opacity-100 transition-opacity"
                                                onClick={() =>
                                                  handleEditContent(
                                                    content,
                                                    "title"
                                                  )
                                                }
                                              >
                                                <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                                              </Button>
                                            </div>
                                          </div>
                                          <div className="flex items-center gap-2 mt-0.5">
                                            {content.type === "video" &&
                                              content.duration && (
                                                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                  <Clock className="h-3 w-3" />
                                                  {Math.round(
                                                    content.duration / 60
                                                  )}
                                                  min
                                                </span>
                                              )}
                                            {content.type === "document" &&
                                              content.size && (
                                                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                  <FileText className="h-3 w-3" />
                                                  {Math.round(
                                                    content.size / 1024
                                                  )}
                                                  KB
                                                </span>
                                              )}
                                          </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex items-center gap-1">
                                          {/* Type-specific actions */}
                                          {content.type === "video" && (
                                            <Dialog>
                                              <DialogTrigger asChild>
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  className="h-7 w-7 p-0 rounded-full"
                                                >
                                                  <Play className="h-4 w-4" />
                                                </Button>
                                              </DialogTrigger>
                                              <DialogContent className="sm:max-w-[900px] p-6">
                                                <DialogHeader className="mb-4">
                                                  <DialogTitle>
                                                    {content.title}
                                                  </DialogTitle>
                                                </DialogHeader>
                                                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                                                  <SecureViewer
                                                    contentId={content._id}
                                                    type="video"
                                                    moduleId={module._id}
                                                    courseId={course._id}
                                                  />
                                                </div>
                                              </DialogContent>
                                            </Dialog>
                                          )}
                                          {content.type === "document" && (
                                            <Dialog>
                                              <DialogTrigger asChild>
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  className="h-7 w-7 p-0 rounded-full"
                                                >
                                                  <FileText className="h-4 w-4" />
                                                </Button>
                                              </DialogTrigger>
                                              <DialogContent className="sm:max-w-[800px]">
                                                <DialogHeader>
                                                  <DialogTitle>
                                                    {content.title}
                                                  </DialogTitle>
                                                </DialogHeader>
                                                <div className="mt-4">
                                                  <SecureViewer
                                                    contentId={content._id}
                                                    type="document"
                                                    moduleId={module._id}
                                                    courseId={course._id}
                                                  />
                                                </div>
                                              </DialogContent>
                                            </Dialog>
                                          )}
                                          {content.type === "link" && (
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="h-7 w-7 p-0 rounded-full"
                                              onClick={() =>
                                                window.open(
                                                  content.url,
                                                  "_blank"
                                                )
                                              }
                                            >
                                              <ExternalLink className="h-4 w-4" />
                                            </Button>
                                          )}

                                          {/* More actions dropdown */}
                                          {contentDropdownMenu(content)}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </StrictModeDroppable>
                    </DragDropContext>
                  )}
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Add DeleteContentDialog */}
      {selectedContent && (
        <DeleteContentDialog
          open={deleteContentDialogOpen}
          onOpenChange={setDeleteContentDialogOpen}
          onConfirm={confirmDeleteContent}
          contentTitle={selectedContent.title}
          contentType={selectedContent.type}
        />
      )}

      {selectedContent && (
        <EditContentDialog
          open={editContentDialogOpen}
          onOpenChange={setEditContentDialogOpen}
          onSubmit={handleContentUpdate}
          content={selectedContent}
          editField={editField}
        />
      )}
    </motion.div>
  );
}

function AddContentForm({ onSubmit, onCancel }) {
  const [uploadState, setUploadState] = useState("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoData, setVideoData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const mediaUpload = useMediaUpload();
  const fileInputRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      title: "",
      type: "video",
      isPreview: false,
      uniqueId: Date.now().toString(36) + Math.random().toString(36).substr(2),
      url: "",
    },
  });

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileType = form.watch("type");

    if (fileType === "video") {
      try {
        setUploadState("uploading");
        const uploadedVideo = await mediaUpload.mutateAsync({
          file,
          uploadType: "moduleVideo",
          onProgress: (progress) => setUploadProgress(progress),
        });

        setVideoData(uploadedVideo);
        setUploadState("completed");
        toast.success("Video uploaded successfully");
      } catch (error) {
        console.error("Video upload error:", error);
        setUploadState("error");
        toast.error("Failed to upload video");
      }
    } else if (fileType === "document") {
      setSelectedFile(file);
      toast.success("Document selected");
    }
  };

  const handleSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      let contentData = {
        title: data.title,
        type: data.type,
        isPreview: data.isPreview,
        uniqueId: data.uniqueId,
      };

      if (data.type === "video") {
        if (!videoData || !videoData.url) {
          toast.error("Please upload a video first");
          return;
        }
        contentData = {
          ...contentData,
          mediaId: videoData._id,
          url: videoData.url,
          duration: videoData.duration,
          thumbnail: videoData.thumbnail,
          mimeType: videoData.mimeType,
          size: videoData.size,
        };
      } else if (data.type === "document") {
        if (!selectedFile) {
          toast.error("Please select a document");
          return;
        }
        contentData.file = selectedFile;
      } else if (data.type === "link") {
        if (!data.url) {
          toast.error("Please enter a valid URL");
          return;
        }
        contentData.url = data.url;
      }

      await onSubmit(contentData);
      form.reset();
      setVideoData(null);
      setSelectedFile(null);
      setUploadState("idle");
      setUploadProgress(0);
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Failed to add content");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-dashed dark:border-[#2A3F47]/50">
      <CardContent className="pt-4">
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid gap-4">
            {/* Content Type and Title */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <FormLabel>
                  Type <span className="text-red-500">*</span>
                </FormLabel>
                <Select
                  onValueChange={(value) => {
                    form.setValue("type", value);
                    setVideoData(null);
                    setUploadState("idle");
                  }}
                  defaultValue={form.getValues("type")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Video Lecture</SelectItem>
                    <SelectItem value="document">Document</SelectItem>
                    <SelectItem value="link">External Link</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <FormLabel>
                  Title <span className="text-red-500">*</span>
                </FormLabel>
                <FormInput
                  placeholder="Enter title"
                  {...form.register("title", { required: "Title is required" })}
                />
              </div>
            </div>

            {/* Content Type Specific Inputs */}
            {form.watch("type") === "video" ? (
              <div className="space-y-4">
                {/* Video Upload UI - Same as before */}
                {uploadState === "idle" && (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="relative border-2 border-dashed dark:border-[#2A3F47] rounded-lg p-6 transition-all cursor-pointer hover:bg-muted/50 dark:hover:bg-[#202F36]/50"
                  >
                    <div className="flex flex-col items-center gap-3 text-center">
                      <div className="p-3 rounded-full bg-primary/5 ring-1 ring-primary/10">
                        <Upload className="h-6 w-6 text-primary/70" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-medium">Upload Video</h4>
                        <p className="text-sm text-muted-foreground">
                          MP4 or MOV, max 100MB
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {uploadState === "uploading" && (
                  <div className="space-y-3 p-4 border rounded-lg dark:border-[#2A3F47]">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Uploading...
                      </span>
                      <span className="font-medium">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} />
                  </div>
                )}
                {uploadState === "completed" && videoData && (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-violet-50 dark:bg-violet-900/20">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center">
                        <Video className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {videoData.originalName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Ready to be added
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setVideoData(null);
                        setUploadState("idle");
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                {uploadState === "error" && (
                  <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                    Upload failed. Please try again.
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
            ) : form.watch("type") === "document" ? (
              <div className="space-y-2">
                <FormLabel>
                  File <span className="text-red-500">*</span>
                </FormLabel>
                <FormInput
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                  onChange={handleFileSelect}
                />
                {selectedFile && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {selectedFile.name}
                  </p>
                )}
              </div>
            ) : form.watch("type") === "link" ? (
              <div className="space-y-2">
                <FormLabel>
                  URL <span className="text-red-500">*</span>
                </FormLabel>
                <FormInput
                  type="url"
                  placeholder="Enter URL"
                  {...form.register("url", { required: "URL is required" })}
                />
              </div>
            ) : null}

            {/* Preview Option */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isPreview"
                checked={form.watch("isPreview")}
                onCheckedChange={(checked) =>
                  form.setValue("isPreview", checked)
                }
              />
              <FormLabel htmlFor="isPreview" className="text-sm font-medium">
                Available as preview
              </FormLabel>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="gap-2 bg-violet-600 hover:bg-violet-700"
              disabled={
                isSubmitting ||
                (form.watch("type") === "video" && !videoData) ||
                (form.watch("type") === "document" && !selectedFile)
              }
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Adding Content...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add Content
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function EmptyContent() {
  return (
    <div className="flex flex-col items-center justify-center py-6 text-center">
      <div className="h-12 w-12 rounded-full bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-3">
        <FileText className="h-6 w-6" />
      </div>
      <p className="text-sm font-medium">No content yet</p>
      <p className="text-xs text-muted-foreground mt-1">
        Click "Add Content" to get started
      </p>
    </div>
  );
}

function ModuleSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-[200px] w-full" />
      <Skeleton className="h-[200px] w-full" />
      <Skeleton className="h-[200px] w-full" />
    </div>
  );
}

function EmptyModules({ onCreateModule }) {
  return (
    <div className="relative">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />

      <Card className="relative border dark:border-[#2A3F47] dark:bg-[#202F36]/50 backdrop-blur-sm overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-500/5 dark:from-violet-500/10 dark:to-purple-500/10" />

        <div className="relative px-6 py-16">
          <div className="flex flex-col items-center justify-center text-center space-y-6">
            {/* Icon */}
            <div className="p-4 rounded-full bg-violet-100/50 dark:bg-violet-500/10 ring-1 ring-violet-200/50 dark:ring-violet-500/20">
              <LayoutGrid className="h-10 w-10 text-violet-600 dark:text-violet-400" />
            </div>

            {/* Text Content */}
            <div className="space-y-2 max-w-[400px]">
              <h3 className="text-xl font-semibold tracking-tight text-foreground dark:text-zinc-100">
                Create Your First Module
              </h3>
              <p className="text-sm text-muted-foreground dark:text-zinc-400">
                Start building your course by creating modules. Add videos,
                documents, and quizzes to create engaging learning content.
              </p>
            </div>

            {/* Action Button */}
            <Button
              onClick={onCreateModule}
              className="mt-2 gap-2 bg-violet-600 hover:bg-violet-700 dark:bg-violet-600 dark:hover:bg-violet-700 text-white"
            >
              <Plus className="h-4 w-4" />
              <span>Create Module</span>
            </Button>

            {/* Quick Info */}
            <div className="flex items-center gap-6 text-sm text-muted-foreground dark:text-zinc-400">
              <div className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                <span>Video Lessons</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Documents</span>
              </div>
              <div className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4" />
                <span>Quizzes</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function CreateModuleDialog({ open, onOpenChange, onSubmit }) {
  const [loading, setLoading] = useState(false);
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      isOptional: false,
      status: "draft",
    },
  });

  const handleSubmit = async (data) => {
    try {
      setLoading(true);
      await onSubmit(data);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to create module");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Plus className="h-5 w-5 text-violet-600" />
            Create New Module
          </DialogTitle>
          <DialogDescription>
            Add a new module to organize your course content. All fields marked
            with * are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid gap-6">
            {/* Title Field */}
            <div className="space-y-2">
              <FormLabel htmlFor="title" className="text-sm font-medium">
                Module Title <span className="text-red-500">*</span>
              </FormLabel>
              <FormInput
                id="title"
                placeholder="Enter module title"
                className="w-full"
                {...form.register("title", { required: "Title is required" })}
              />
              {form.formState.errors.title && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <FormLabel htmlFor="description" className="text-sm font-medium">
                Description <span className="text-red-500">*</span>
              </FormLabel>
              <FormTextarea
                id="description"
                placeholder="Enter module description"
                className="w-full min-h-[100px] resize-none"
                {...form.register("description", {
                  required: "Description is required",
                })}
              />
              {form.formState.errors.description && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              {/* Optional Module Checkbox */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isOptional"
                  checked={form.watch("isOptional")}
                  onCheckedChange={(checked) =>
                    form.setValue("isOptional", checked)
                  }
                />
                <FormLabel
                  htmlFor="isOptional"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Optional Module
                </FormLabel>
              </div>

              {/* Status Select */}
              <div className="flex items-center space-x-2">
                <FormLabel className="text-sm font-medium">Status</FormLabel>
                <Select
                  value={form.watch("status")}
                  onValueChange={(value) => form.setValue("status", value)}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">
                      <div className="flex items-center gap-2">
                        <span className="flex h-1.5 w-1.5 rounded-full bg-zinc-500" />
                        Draft
                      </div>
                    </SelectItem>
                    <SelectItem value="published">
                      <div className="flex items-center gap-2">
                        <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Published
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="gap-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="gap-2 bg-violet-600 hover:bg-violet-700"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Create Module
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteModuleDialog({ open, onOpenChange, onConfirm, moduleName }) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm();
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to delete module");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Module</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{moduleName}"? This action cannot
            be undone and will remove all content within this module.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete Module
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function EditModuleDialog({ open, onOpenChange, onSubmit, module }) {
  const [loading, setLoading] = useState(false);
  const form = useForm({
    defaultValues: {
      title: module.title,
      description: module.description,
      isOptional: module.isOptional,
      status: module.status,
    },
  });

  // Reset form when module changes
  useEffect(() => {
    form.reset({
      title: module.title,
      description: module.description,
      isOptional: module.isOptional,
      status: module.status,
    });
  }, [module, form]);

  const handleSubmit = async (data) => {
    try {
      setLoading(true);
      await onSubmit(data);
    } catch (error) {
      toast.error("Failed to update module");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Pencil className="h-5 w-5 text-violet-600" />
            Edit Module
          </DialogTitle>
          <DialogDescription>
            Update module details. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid gap-6">
            {/* Title Field */}
            <div className="space-y-2">
              <FormLabel htmlFor="title" className="text-sm font-medium">
                Module Title <span className="text-red-500">*</span>
              </FormLabel>
              <FormInput
                id="title"
                placeholder="Enter module title"
                className="w-full"
                {...form.register("title", { required: "Title is required" })}
              />
              {form.formState.errors.title && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <FormLabel htmlFor="description" className="text-sm font-medium">
                Description <span className="text-red-500">*</span>
              </FormLabel>
              <FormTextarea
                id="description"
                placeholder="Enter module description"
                className="w-full"
                {...form.register("description", {
                  required: "Description is required",
                })}
              />
              {form.formState.errors.description && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              {/* Optional Module Checkbox */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isOptional"
                  checked={form.watch("isOptional")}
                  onCheckedChange={(checked) =>
                    form.setValue("isOptional", checked)
                  }
                />
                <FormLabel
                  htmlFor="isOptional"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Optional Module
                </FormLabel>
              </div>

              {/* Status Select */}
              <div className="flex items-center space-x-2">
                <FormLabel className="text-sm font-medium">Status</FormLabel>
                <Select
                  value={form.watch("status")}
                  onValueChange={(value) => form.setValue("status", value)}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">
                      <div className="flex items-center gap-2">
                        <span className="flex h-1.5 w-1.5 rounded-full bg-zinc-500" />
                        Draft
                      </div>
                    </SelectItem>
                    <SelectItem value="published">
                      <div className="flex items-center gap-2">
                        <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Published
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="gap-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="gap-2 bg-violet-600 hover:bg-violet-700"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Pencil className="h-4 w-4" />
              )}
              Update Module
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteContentDialog({
  open,
  onOpenChange,
  onConfirm,
  contentTitle,
  contentType,
}) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm();
      // Dialog will be closed by the parent component after the mutation is successful
    } catch (error) {
      console.error("Delete content error:", error);
      toast.error("Failed to delete content");
      setLoading(false); // Only reset loading if there's an error
    }
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={(isOpen) => {
        // Prevent closing dialog while loading
        if (!loading) {
          onOpenChange(isOpen);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Content</AlertDialogTitle>
          <div className="space-y-2">
            <AlertDialogDescription>
              Are you sure you want to delete "{contentTitle}"? This action
              cannot be undone.
            </AlertDialogDescription>
            {contentType === "video" && (
              <AlertDialogDescription className="text-red-600 dark:text-red-400">
                This will also delete the video from storage.
              </AlertDialogDescription>
            )}
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-red-600 hover:bg-red-700 gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash className="h-4 w-4" />
                Delete Content
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function EditContentDialog({
  open,
  onOpenChange,
  onSubmit,
  content,
  editField,
}) {
  const [loading, setLoading] = useState(false);

  // Initialize form with current content value
  const form = useForm({
    defaultValues: {
      [editField]: content[editField] || "",
    },
  });

  // Reset form when dialog opens or content/editField changes
  useEffect(() => {
    if (open) {
      // Make sure we're setting the correct field value from content
      const currentValue = editField === "url" ? content.url : content.title;
      form.reset({
        [editField]: currentValue || "",
      });
    }
  }, [open, content, editField, form]);

  const handleSubmit = async (data) => {
    try {
      setLoading(true);
      await onSubmit({ ...content, [editField]: data[editField] });
      onOpenChange(false);
    } catch (error) {
      toast.error(`Failed to update ${editField}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Edit {editField === "title" ? "Title" : "URL"}
          </DialogTitle>
          <DialogDescription>
            Update the content {editField === "title" ? "title" : "URL"}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div>
            <FormLabel htmlFor={editField}>
              {editField === "title" ? "Title" : "URL"}
            </FormLabel>
            <FormInput
              id={editField}
              type={editField === "url" ? "url" : "text"}
              placeholder={editField === "title" ? "Enter title" : "Enter URL"}
              defaultValue={editField === "url" ? content.url : content.title}
              {...form.register(editField, {
                required: `${editField} is required`,
                pattern:
                  editField === "url"
                    ? {
                        value: /^https?:\/\/.+/,
                        message:
                          "Please enter a valid URL starting with http:// or https://",
                      }
                    : undefined,
              })}
            />
            {form.formState.errors[editField] && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors[editField].message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !form.formState.isDirty}
              className="gap-2 bg-violet-600 hover:bg-violet-700"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Pencil className="h-4 w-4" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ModuleManagement;
