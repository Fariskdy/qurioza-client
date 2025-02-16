import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Edit2,
  Trash2,
  Plus,
  ChevronUp,
  BookOpen,
  Layers,
  BarChart2,
  Clock,
  Image as ImageIcon,
  Sparkles,
  X,
  Loader2,
} from "lucide-react";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/api/categories";
import { useToast } from "@/hooks/use-toast";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { Textarea } from "@/components/ui/textarea";

const categoryFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  image: z.any().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
});

const ImageUploadPreview = ({ value, onChange, className, currentImage }) => {
  const [preview, setPreview] = useState(currentImage || null);

  // Update preview when currentImage changes or when value is cleared
  useEffect(() => {
    if (!value && !currentImage) {
      setPreview(null);
    } else {
      setPreview(currentImage);
    }
  }, [currentImage, value]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = (e) => {
    e.preventDefault();
    onChange(null);
    setPreview(null);
  };

  return (
    <div className={className}>
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="h-32 w-full rounded-lg object-cover border-2 border-violet-500/20"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6 bg-black/50 hover:bg-black/70 text-white rounded-full"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          <div className="h-32 rounded-lg border-2 border-dashed border-violet-500/20 hover:border-violet-500/40 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-violet-500">
            <ImageIcon className="h-8 w-8" />
            <div className="text-xs font-medium">
              Click or drag image to upload
            </div>
            <div className="text-xs">JPG, PNG or WebP (max. 5MB)</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function CategoryManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const { toast } = useToast();

  // Replace mock data with real API data
  const { data: categories, isLoading, error } = useCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  // Calculate stats from real data
  const stats = [
    {
      title: "Total Categories",
      value: categories?.length || "0",
      icon: Layers,
      trend: "+4",
      trendUp: true,
      description: "Active course categories",
    },
    {
      title: "Total Courses",
      value: "248",
      icon: BookOpen,
      trend: "+12%",
      trendUp: true,
      description: "Across all categories",
    },
    {
      title: "Avg. Enrollment",
      value: "680",
      icon: BarChart2,
      trend: "+18%",
      trendUp: true,
      description: "Students per category",
    },
    {
      title: "Growth Rate",
      value: "94%",
      icon: ChevronUp,
      trend: "+5%",
      trendUp: true,
      description: "Category expansion rate",
    },
  ];

  // Filter categories based on search query
  const filteredCategories = categories?.filter((category) => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    return (
      category.name?.toLowerCase().includes(query) ||
      category.description?.toLowerCase().includes(query)
    );
  });

  const form = useForm({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      description: "",
      status: "active",
    },
  });

  // Handle category actions
  const handleCreateCategory = async (data) => {
    try {
      await createMutation.mutateAsync(data);
      setOpen(false);
      toast({
        title: "Success",
        description: "Category created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to create category",
        variant: "destructive",
      });
    }
  };

  const handleEditClick = (category) => {
    setSelectedCategory(category);
    form.reset({
      name: category.name,
      description: category.description,
      status: category.status || "active",
    });
    setEditOpen(true);
  };

  const handleUpdateCategory = async (data) => {
    try {
      await updateMutation.mutateAsync({
        id: selectedCategory._id,
        ...data,
      });
      setEditOpen(false);
      toast({
        title: "Success",
        description: "Category updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update category",
        variant: "destructive",
      });
    }
  };

  const handleDeleteClick = (category) => {
    setDeletingId(category._id);
    setSelectedCategory(category);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteMutation.mutateAsync(selectedCategory._id);
      setDeleteOpen(false);
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete category",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  // Add this function to handle create dialog open
  const handleCreateClick = () => {
    form.reset({
      name: "",
      description: "",
      status: "active",
    });
    setOpen(true);
  };

  // Show loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Show error state
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Category Management
        </h1>
        <p className="text-muted-foreground">
          Manage and organize course categories across the platform
        </p>
      </div>

      {/* Stats Overview */}
      {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md dark:border-[#2A3F47]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative space-y-4">
              <div className="flex items-center justify-between">
                <div className="rounded-full bg-violet-500/10 p-2.5">
                  <stat.icon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                </div>
                <Badge
                  variant={stat.trendUp ? "success" : "destructive"}
                  className={`${
                    stat.trendUp
                      ? "bg-emerald-500/10 text-emerald-500"
                      : "bg-red-500/10 text-red-500"
                  } gap-1`}
                >
                  <ChevronUp
                    className={`h-3 w-3 ${!stat.trendUp && "rotate-180"}`}
                  />
                  {stat.trend}
                </Badge>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-foreground">
                  {stat.value}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div> */}

      {/* Main Content Card */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden dark:border-[#2A3F47]">
        {/* Header Section */}
        <div className="border-b bg-violet-500/5 p-6 dark:border-[#2A3F47] dark:bg-[#202F36]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                <h2 className="text-xl font-semibold text-foreground">
                  Course Categories
                </h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Add and manage course categories
              </p>
            </div>
            <Dialog
              open={open}
              onOpenChange={(open) => {
                if (!open) {
                  form.reset({
                    name: "",
                    description: "",
                    status: "active",
                    image: null,
                  });
                  setSelectedCategory(null);
                }
                setOpen(open);
              }}
            >
              <DialogTrigger asChild>
                <Button
                  className="bg-violet-600 hover:bg-violet-700 shadow-sm"
                  onClick={handleCreateClick}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] dark:bg-[#202F36] dark:border-[#2A3F47]">
                <DialogHeader>
                  <DialogTitle className="text-foreground dark:text-[#E3E5E5]">
                    Create New Category
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground dark:text-[#8B949E]">
                    Add a new course category to organize your content.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleCreateCategory)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-[#E3E5E5]">
                            Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Web Development"
                              {...field}
                              className="dark:bg-[#131F24] dark:border-[#2A3F47] dark:text-[#E3E5E5] dark:placeholder:text-[#8B949E]"
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
                          <FormLabel className="dark:text-[#E3E5E5]">
                            Description
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Learn modern web development technologies..."
                              className="min-h-[100px] resize-none dark:bg-[#131F24] dark:border-[#2A3F47] dark:text-[#E3E5E5] dark:placeholder:text-[#8B949E]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="dark:text-red-400" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="image"
                      render={({ field: { value, onChange, ...field } }) => (
                        <FormItem>
                          <FormLabel className="dark:text-[#E3E5E5]">
                            Category Image
                          </FormLabel>
                          <FormControl>
                            <ImageUploadPreview
                              value={value}
                              onChange={onChange}
                              className="mt-1"
                              currentImage={selectedCategory?.image}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="dark:text-red-400" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-[#E3E5E5]">
                            Status
                          </FormLabel>
                          <FormControl>
                            <select
                              {...field}
                              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:bg-[#131F24] dark:border-[#2A3F47] dark:text-[#E3E5E5]"
                            >
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                            </select>
                          </FormControl>
                          <FormMessage className="dark:text-red-400" />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      disabled={createMutation.isPending}
                      className="w-full bg-violet-600 hover:bg-violet-700 dark:bg-gradient-to-r dark:from-violet-600 dark:to-violet-500 dark:hover:from-violet-700 dark:hover:to-violet-600 dark:text-white dark:shadow-lg dark:shadow-violet-500/20"
                    >
                      {createMutation.isPending ? (
                        <>
                          <span className="mr-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                          </span>
                          Creating...
                        </>
                      ) : (
                        "Create Category"
                      )}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filters Section */}
        <div className="border-b bg-card/50 p-6 dark:border-[#2A3F47]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-background/50 dark:bg-[#131F24]/50 dark:text-foreground dark:placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="p-6">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent dark:border-[#2A3F47]">
                <TableHead className="text-muted-foreground">
                  Category
                </TableHead>
                <TableHead className="text-muted-foreground">Slug</TableHead>
                <TableHead className="text-muted-foreground">Stats</TableHead>
                <TableHead className="text-muted-foreground">Created</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No categories found matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCategories?.map((category) => (
                  <TableRow
                    key={category._id}
                    className="group hover:bg-accent/5 dark:hover:bg-[#2A3F47]/50 dark:border-[#2A3F47]"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg border-2 border-violet-500/20 group-hover:border-violet-500/40 transition-colors overflow-hidden">
                          {category.image ? (
                            <img
                              src={category.image}
                              alt={category.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full bg-violet-500/10 flex items-center justify-center">
                              <ImageIcon className="h-5 w-5 text-violet-500" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-foreground group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                            {category.name}
                          </div>
                          <div className="text-sm text-muted-foreground line-clamp-2 max-w-[300px]">
                            {category.description}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="bg-violet-500/10 text-violet-600 hover:bg-violet-500/20 dark:text-violet-400"
                      >
                        {category.slug}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-violet-500 dark:text-violet-400" />
                            <span className="text-foreground">
                              {/* Replace with actual course count */}
                              {category.coursesCount || 0} Courses
                            </span>
                          </div>
                          <Badge variant="outline" className="font-normal">
                            Active
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {new Date(category.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex justify-end gap-1">
                        {deletingId === category._id ? (
                          <div className="h-8 w-8 flex items-center justify-center">
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                          </div>
                        ) : (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-violet-50 hover:text-violet-600 dark:text-[#E3E5E5] dark:hover:bg-violet-500/10 dark:hover:text-violet-400"
                              onClick={() => handleEditClick(category)}
                            >
                              <Edit2 className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-red-50 hover:text-red-600 dark:text-[#E3E5E5] dark:hover:bg-red-500/10 dark:hover:text-red-400"
                              onClick={() => handleDeleteClick(category)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog
        open={editOpen}
        onOpenChange={(open) => {
          if (!open) {
            form.reset({
              name: "",
              description: "",
              status: "active",
              image: null,
            });
            setSelectedCategory(null);
          }
          setEditOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-[425px] dark:bg-[#202F36] dark:border-[#2A3F47]">
          <DialogHeader>
            <DialogTitle className="text-foreground dark:text-[#E3E5E5]">
              Edit Category
            </DialogTitle>
            <DialogDescription className="text-muted-foreground dark:text-[#8B949E]">
              Update category details and image.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleUpdateCategory)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-[#E3E5E5]">Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Web Development"
                        {...field}
                        className="dark:bg-[#131F24] dark:border-[#2A3F47] dark:text-[#E3E5E5] dark:placeholder:text-[#8B949E]"
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
                    <FormLabel className="dark:text-[#E3E5E5]">
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Learn modern web development technologies..."
                        className="min-h-[100px] resize-none dark:bg-[#131F24] dark:border-[#2A3F47] dark:text-[#E3E5E5] dark:placeholder:text-[#8B949E]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="dark:text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel className="dark:text-[#E3E5E5]">
                      Category Image
                    </FormLabel>
                    <FormControl>
                      <ImageUploadPreview
                        value={value}
                        onChange={onChange}
                        className="mt-1"
                        currentImage={selectedCategory?.image}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="dark:text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-[#E3E5E5]">
                      Status
                    </FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:bg-[#131F24] dark:border-[#2A3F47] dark:text-[#E3E5E5]"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </FormControl>
                    <FormMessage className="dark:text-red-400" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={updateMutation.isPending}
                className="w-full bg-violet-600 hover:bg-violet-700 dark:bg-gradient-to-r dark:from-violet-600 dark:to-violet-500 dark:hover:from-violet-700 dark:hover:to-violet-600 dark:text-white dark:shadow-lg dark:shadow-violet-500/20"
              >
                {updateMutation.isPending ? (
                  <>
                    <span className="mr-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </span>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="dark:bg-[#202F36] dark:border-[#2A3F47]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground dark:text-[#E3E5E5]">
              Are you sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground dark:text-[#8B949E]">
              This action cannot be undone. This will permanently delete the
              category and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="dark:bg-[#131F24] dark:text-[#E3E5E5] dark:hover:bg-[#1B2B34] dark:border-[#2A3F47]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700 text-white dark:bg-gradient-to-r dark:from-red-600 dark:to-red-500 dark:hover:from-red-700 dark:hover:to-red-600"
            >
              {deleteMutation.isPending ? (
                <>
                  <span className="mr-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </span>
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
