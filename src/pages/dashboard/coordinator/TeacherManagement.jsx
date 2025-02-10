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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Search,
  Edit2,
  Trash2,
  UserPlus,
  BookOpen,
  Users2,
  Sparkles,
  X,
  Phone,
  MapPin,
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
import {
  useTeachers,
  useCreateTeacher,
  useUpdateTeacher,
  useDeleteTeacher,
} from "@/api/teachers";

const teacherFormSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(1, "Last name must be at least 1 character"),
  phone: z.string().optional(),
  address: z.string().optional(),
});

const teacherEditSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

export default function TeacherManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const { data: teachers, isLoading, error } = useTeachers();
  const { mutate: createTeacher } = useCreateTeacher();
  const { mutate: updateTeacher } = useUpdateTeacher();
  const { mutate: deleteTeacher } = useDeleteTeacher();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(teacherFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
    },
  });

  const editForm = useForm({
    resolver: zodResolver(teacherEditSchema),
    defaultValues: {
      username: "",
      email: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await createTeacher(data);

      toast({
        title: "Teacher Created",
        description: `${data.firstName} ${data.lastName} has been added as a teacher.`,
        variant: "default",
      });

      form.reset();
      setOpen(false);
    } catch (error) {
      console.error("Creation error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create teacher",
        variant: "destructive",
      });
    }
  };

  const handleEditClick = (teacher) => {
    setSelectedTeacher(teacher);
    editForm.reset({
      username: teacher.username || "",
      email: teacher.email || "",
    });
    setEditOpen(true);
  };

  const onEditSubmit = async (data) => {
    if (!selectedTeacher?._id) return;

    try {
      await updateTeacher({
        id: selectedTeacher._id,
        ...data,
      });

      toast({
        title: "Success",
        description: "Teacher updated successfully",
        variant: "default",
      });

      setEditOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update teacher",
        variant: "destructive",
      });
    }
  };

  const handleDeleteClick = (teacher) => {
    setSelectedTeacher(teacher);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTeacher?._id) return;

    try {
      await deleteTeacher(selectedTeacher._id);

      toast({
        title: "Teacher Deleted",
        description: "The teacher has been successfully removed.",
        variant: "default",
      });

      setDeleteOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete teacher",
        variant: "destructive",
      });
    }
  };

  const filteredTeachers = teachers?.filter((teacher) => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    return (
      teacher.username?.toLowerCase().includes(query) ||
      teacher.email?.toLowerCase().includes(query)
    );
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Teacher Management
        </h1>
        <p className="text-muted-foreground">
          Manage and monitor teachers assigned to your courses
        </p>
      </div>

      {/* Main Content Card */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden dark:border-[#2A3F47]">
        {/* Header Section */}
        <div className="border-b bg-violet-500/5 p-6 dark:border-[#2A3F47] dark:bg-[#202F36]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Users2 className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                <h2 className="text-xl font-semibold text-foreground">
                  Teachers
                </h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Manage your teaching staff
              </p>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-violet-600 hover:bg-violet-700 shadow-sm">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Teacher
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] dark:bg-[#202F36] dark:border-[#2A3F47]">
                <DialogHeader>
                  <DialogTitle className="text-foreground dark:text-[#E3E5E5]">
                    Add New Teacher
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground dark:text-[#8B949E]">
                    Create a new teacher account. They will receive an email
                    with their login credentials.
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
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-[#E3E5E5]">
                            Phone (Optional)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="+1234567890"
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
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-[#E3E5E5]">
                            Address (Optional)
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="123 Main St, City, Country"
                              {...field}
                              className="dark:bg-[#131F24] dark:border-[#2A3F47] dark:text-[#E3E5E5] dark:placeholder:text-[#8B949E]"
                            />
                          </FormControl>
                          <FormMessage className="dark:text-red-400" />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full bg-violet-600 hover:bg-violet-700 dark:bg-gradient-to-r dark:from-violet-600 dark:to-violet-500 dark:hover:from-violet-700 dark:hover:to-violet-600 dark:text-white dark:shadow-lg dark:shadow-violet-500/20"
                    >
                      Create Teacher
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Search Section */}
        <div className="border-b bg-card/50 p-6 dark:border-[#2A3F47]">
          <div className="flex items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by username or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-9 bg-background/50 dark:bg-[#131F24]/50 dark:text-[#E3E5E5] dark:placeholder:text-[#8B949E]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
                >
                  <X className="h-4 w-4" />
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
                  Teacher
                </TableHead>
                <TableHead className="w-[20%] font-semibold text-muted-foreground">
                  Status
                </TableHead>
                <TableHead className="w-[25%] font-semibold text-muted-foreground">
                  Contact Info
                </TableHead>
                <TableHead className="w-[15%] text-right font-semibold text-muted-foreground pr-6">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeachers?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No teachers found matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTeachers?.map((teacher) => (
                  <TableRow
                    key={teacher._id}
                    className="border-border dark:border-[#2A3F47] transition-colors hover:bg-accent/50 dark:hover:bg-[#202F36]"
                  >
                    <TableCell className="py-3 pl-6">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 ring-2 ring-violet-500/10 dark:ring-violet-500/20">
                          <AvatarFallback className="bg-gradient-to-br from-violet-500 to-violet-600 text-white font-medium">
                            {teacher.username?.[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">
                            {teacher.username}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {teacher.email}
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
                          {new Date(teacher.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-full bg-violet-100 dark:bg-violet-500/10">
                            <Phone className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {teacher.phone || "No phone"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-full bg-violet-100 dark:bg-violet-500/10">
                            <MapPin className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                          </div>
                          <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                            {teacher.address || "No address"}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-right pr-6">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-violet-50 hover:text-violet-600 dark:text-[#E3E5E5] dark:hover:bg-violet-500/10 dark:hover:text-violet-400"
                          onClick={() => handleEditClick(teacher)}
                        >
                          <Edit2 className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-red-50 hover:text-red-600 dark:text-[#E3E5E5] dark:hover:bg-red-500/10 dark:hover:text-red-400"
                          onClick={() => handleDeleteClick(teacher)}
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
        <DialogContent className="sm:max-w-[600px] dark:bg-[#202F36] dark:border-[#2A3F47]">
          <DialogHeader>
            <DialogTitle className="text-foreground dark:text-[#E3E5E5]">
              Edit Teacher
            </DialogTitle>
            <DialogDescription className="text-muted-foreground dark:text-[#8B949E]">
              Update teacher&apos;s information
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
                control={editForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-[#E3E5E5]">Email</FormLabel>
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
              <Button type="submit" className="w-full">
                Save Changes
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              teacher&apos;s account and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
