import { useState } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MoreVertical,
  Search,
  Mail,
  Phone,
  Edit2,
  Trash2,
  UserPlus,
  CheckCircle2,
  XCircle,
  BookOpen,
  Users2,
  Calendar,
  ArrowUpDown,
  Filter,
  ChevronUp,
  BarChart2,
  Sparkles,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useCoordinators,
  useCreateCoordinator,
  useUpdateCoordinator,
  useDeleteCoordinator,
} from "@/api/coordinators/hooks";
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
import { useToast } from "@/hooks/use-toast";
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

const coordinatorFormSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(1, "Last name must be at least 1 character"),
  role: z.string().default("coordinator"),
});

// Update the edit schema to only include username and email
const coordinatorEditSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

export default function CoordinatorManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedCoordinator, setSelectedCoordinator] = useState(null);

  // Replace mock data with real data fetching
  const { data: coordinators, isLoading, error } = useCoordinators();
  const { mutate: createCoordinator } = useCreateCoordinator();
  const { mutate: updateCoordinator } = useUpdateCoordinator();
  const { mutate: deleteCoordinator } = useDeleteCoordinator();

  // Calculate stats from real data
  const stats = [
    {
      title: "Total Coordinators",
      value: coordinators?.length || "0",
      icon: Users2,
      trend: "+12%",
      trendUp: true,
      description: "Active course coordinators",
    },
    {
      title: "Active Courses",
      value: "156",
      icon: BookOpen,
      trend: "+8%",
      trendUp: true,
      description: "Courses in progress",
    },
    {
      title: "Total Students",
      value: "3.2k",
      icon: Users2,
      trend: "+22%",
      trendUp: true,
      description: "Enrolled students",
    },
    {
      title: "Completion Rate",
      value: "94%",
      icon: BarChart2,
      trend: "+5%",
      trendUp: true,
      description: "Average course completion",
    },
  ];

  const form = useForm({
    resolver: zodResolver(coordinatorFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      role: "coordinator",
    },
  });

  // Update edit form defaultValues
  const editForm = useForm({
    resolver: zodResolver(coordinatorEditSchema),
    defaultValues: {
      username: "",
      email: "",
    },
  });

  const { toast } = useToast();

  const onSubmit = async (data) => {
    try {
      const coordinatorData = {
        ...data,
        role: "coordinator",
      };

      await createCoordinator(coordinatorData);

      toast({
        title: "Coordinator Created",
        description: `${data.firstName} ${data.lastName} has been added as a coordinator.`,
        variant: "default",
      });

      form.reset();
      setOpen(false);
    } catch (error) {
      console.error("Creation error:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          "Failed to create coordinator. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle coordinator actions
  const handleAddCoordinator = () => {
    // Implementation for adding coordinator
    createCoordinator({
      // coordinator data
    });
  };

  // Update handleEditClick
  const handleEditClick = (coordinator) => {
    setSelectedCoordinator(coordinator);
    editForm.reset({
      username: coordinator.username || "",
      email: coordinator.email || "",
    });
    setEditOpen(true);
  };

  // Handle edit submit
  const onEditSubmit = async (data) => {
    if (!selectedCoordinator?._id) return;

    try {
      await updateCoordinator({
        id: selectedCoordinator._id,
        ...data,
      });

      toast({
        title: "Success",
        description: "Coordinator updated successfully",
        variant: "default",
      });

      setEditOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update coordinator",
        variant: "destructive",
      });
    }
  };

  // Handle delete click - Opens confirmation dialog
  const handleDeleteClick = (coordinator) => {
    setSelectedCoordinator(coordinator);
    setDeleteOpen(true);
  };

  // Handle actual deletion after confirmation
  const handleDeleteConfirm = async () => {
    if (!selectedCoordinator?._id) return;

    try {
      await deleteCoordinator(selectedCoordinator._id);

      toast({
        title: "Coordinator Deleted",
        description: "The coordinator has been successfully removed.",
        variant: "default",
      });

      setDeleteOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error.message || "Failed to delete coordinator. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Filter coordinators based on search query
  const filteredCoordinators = coordinators?.filter((coordinator) => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    return (
      coordinator.username?.toLowerCase().includes(query) ||
      coordinator.email?.toLowerCase().includes(query)
    );
  });

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
          Coordinator Management
        </h1>
        <p className="text-muted-foreground">
          Monitor and manage course coordinators across all departments
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
                  Course Coordinators
                </h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Manage and monitor coordinator activities
              </p>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-violet-600 hover:bg-violet-700 shadow-sm">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Coordinator
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] dark:bg-[#202F36] dark:border-[#2A3F47]">
                <DialogHeader>
                  <DialogTitle className="text-foreground dark:text-[#E3E5E5]">
                    Add New Coordinator
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground dark:text-[#8B949E]">
                    Create a new course coordinator account. They will receive
                    an email with their login credentials.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-[#E3E5E5]">
                            Username
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="johndoe"
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
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-[#E3E5E5]">
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="john@example.com"
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
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-[#E3E5E5]">
                            Password
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="••••••••"
                              {...field}
                              className="dark:bg-[#131F24] dark:border-[#2A3F47] dark:text-[#E3E5E5] dark:placeholder:text-[#8B949E]"
                            />
                          </FormControl>
                          <FormMessage className="dark:text-red-400" />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="dark:text-[#E3E5E5]">
                              First Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="John"
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
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="dark:text-[#E3E5E5]">
                              Last Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Doe"
                                {...field}
                                className="dark:bg-[#131F24] dark:border-[#2A3F47] dark:text-[#E3E5E5] dark:placeholder:text-[#8B949E]"
                              />
                            </FormControl>
                            <FormMessage className="dark:text-red-400" />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-violet-600 hover:bg-violet-700 dark:bg-gradient-to-r dark:from-violet-600 dark:to-violet-500 dark:hover:from-violet-700 dark:hover:to-violet-600 dark:text-white dark:shadow-lg dark:shadow-violet-500/20"
                    >
                      Create Coordinator
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Search Section - Updated */}
        <div className="border-b bg-card/50 p-6 dark:border-[#2A3F47]">
          <div className="flex items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by username or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-9 bg-background/50 dark:bg-[#131F24]/50 dark:text-foreground dark:placeholder:text-muted-foreground"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted-foreground hover:text-foreground dark:hover:text-[#E3E5E5] focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Clear search</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="rounded-xl border bg-card shadow-sm dark:border-[#2A3F47]">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border dark:border-[#2A3F47]">
                <TableHead className="w-[40%] font-semibold text-muted-foreground pl-6">
                  Coordinator
                </TableHead>
                <TableHead className="w-[20%] font-semibold text-muted-foreground">
                  Status
                </TableHead>
                <TableHead className="w-[25%] font-semibold text-muted-foreground">
                  Performance
                </TableHead>
                <TableHead className="w-[15%] text-right font-semibold text-muted-foreground pr-6">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCoordinators?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No coordinators found matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCoordinators?.map((coordinator) => (
                  <TableRow
                    key={coordinator._id}
                    className="border-border dark:border-[#2A3F47] transition-colors hover:bg-accent/50 dark:hover:bg-[#202F36]"
                  >
                    <TableCell className="py-3 pl-6">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 ring-2 ring-violet-500/10 dark:ring-violet-500/20">
                          <AvatarFallback className="bg-gradient-to-br from-violet-500 to-violet-600 text-white font-medium">
                            {coordinator.username?.[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">
                            {coordinator.username}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {coordinator.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                          >
                            Active
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          Joined{" "}
                          {new Date(coordinator.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-full bg-violet-100 dark:bg-violet-500/10">
                              <BookOpen className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                            </div>
                            <span className="text-sm text-muted-foreground">
                              12 Courses
                            </span>
                          </div>
                          <Badge
                            variant="secondary"
                            className="bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400"
                          >
                            4.8 / 5.0
                          </Badge>
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-xs mb-1.5">
                            <span className="text-muted-foreground">
                              Completion Rate
                            </span>
                            <span className="text-violet-700 dark:text-violet-400 font-medium">
                              92%
                            </span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-violet-50 dark:bg-[#202F36]">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-violet-600"
                              style={{ width: "92%" }}
                            />
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-right pr-6">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-violet-50 hover:text-violet-600 dark:text-[#E3E5E5] dark:hover:bg-violet-500/10 dark:hover:text-violet-400"
                          onClick={() => handleEditClick(coordinator)}
                        >
                          <Edit2 className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-red-50 hover:text-red-600 dark:text-[#E3E5E5] dark:hover:bg-red-500/10 dark:hover:text-red-400"
                          onClick={() => handleDeleteClick(coordinator)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
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
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[425px] dark:bg-[#202F36] dark:border-[#2A3F47]">
          <DialogHeader>
            <DialogTitle className="text-foreground dark:text-[#E3E5E5]">
              Edit Coordinator
            </DialogTitle>
            <DialogDescription className="text-muted-foreground dark:text-[#8B949E]">
              Update coordinator's username or email address.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form
              onSubmit={editForm.handleSubmit(onEditSubmit)}
              className="space-y-4"
            >
              <FormField
                control={editForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-[#E3E5E5]">
                      Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="dark:bg-[#131F24] dark:border-[#2A3F47] dark:text-[#E3E5E5] dark:placeholder:text-[#8B949E]"
                      />
                    </FormControl>
                    <FormMessage className="dark:text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-[#E3E5E5]">Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        className="dark:bg-[#131F24] dark:border-[#2A3F47] dark:text-[#E3E5E5] dark:placeholder:text-[#8B949E]"
                      />
                    </FormControl>
                    <FormMessage className="dark:text-red-400" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-violet-600 hover:bg-violet-700 dark:bg-gradient-to-r dark:from-violet-600 dark:to-violet-500 dark:hover:from-violet-700 dark:hover:to-violet-600"
              >
                Save Changes
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
              coordinator's account and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="dark:bg-[#131F24] dark:text-[#E3E5E5] dark:hover:bg-[#1B2B34] dark:border-[#2A3F47]"
              onClick={() => setDeleteOpen(false)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-white dark:bg-gradient-to-r dark:from-red-600 dark:to-red-500 dark:hover:from-red-700 dark:hover:to-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
