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
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function CoordinatorManagement() {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - replace with actual API call
  const coordinators = [
    {
      id: 1,
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.johnson@example.com",
      phone: "+1 234-567-8901",
      status: "active",
      department: "Computer Science",
      joinedDate: "2023-01-15",
      coursesManaged: 12,
      studentsManaged: 450,
      rating: 4.8,
      completionRate: 92,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    },
    {
      id: 2,
      firstName: "Michael",
      lastName: "Chen",
      email: "michael.chen@example.com",
      phone: "+1 234-567-8902",
      status: "inactive",
      department: "Engineering",
      joinedDate: "2023-02-20",
      coursesManaged: 8,
      studentsManaged: 280,
      rating: 4.6,
      completionRate: 88,
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36",
    },
  ];

  const stats = [
    {
      title: "Total Coordinators",
      value: "24",
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
      </div>

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
            <Button className="bg-violet-600 hover:bg-violet-700 shadow-sm">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Coordinator
            </Button>
          </div>
        </div>

        {/* Filters Section */}
        <div className="border-b bg-card/50 p-6 dark:border-[#2A3F47]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-background/50 dark:bg-[#131F24]/50 dark:text-foreground dark:placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9 dark:border-[#2A3F47] dark:bg-[#202F36] dark:hover:bg-[#2A3F47] dark:text-foreground"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-9 dark:border-[#2A3F47] dark:bg-[#202F36] dark:hover:bg-[#2A3F47] dark:text-foreground"
              >
                <ArrowUpDown className="mr-2 h-4 w-4" />
                Sort
              </Button>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="p-6">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent dark:border-[#2A3F47]">
                <TableHead className="text-muted-foreground">
                  Coordinator
                </TableHead>
                <TableHead className="text-muted-foreground">
                  Department
                </TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">
                  Performance
                </TableHead>
                <TableHead className="text-muted-foreground">Contact</TableHead>
                <TableHead className="text-muted-foreground">Joined</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coordinators.map((coordinator) => (
                <TableRow
                  key={coordinator.id}
                  className="group hover:bg-accent/5 dark:hover:bg-[#2A3F47]/50 dark:border-[#2A3F47]"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-violet-500/20 group-hover:border-violet-500/40 transition-colors">
                        <AvatarImage src={coordinator.avatar} />
                        <AvatarFallback className="bg-violet-500 text-white">
                          {coordinator.firstName[0]}
                          {coordinator.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-foreground group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                          {coordinator.firstName} {coordinator.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {coordinator.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="bg-violet-500/10 text-violet-600 hover:bg-violet-500/20 dark:text-violet-400"
                    >
                      {coordinator.department}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        coordinator.status === "active"
                          ? "success"
                          : "secondary"
                      }
                      className={`${
                        coordinator.status === "active"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-zinc-500/10 text-zinc-500"
                      } capitalize`}
                    >
                      {coordinator.status === "active" ? (
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                      ) : (
                        <XCircle className="mr-1 h-3 w-3" />
                      )}
                      {coordinator.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-violet-500 dark:text-violet-400" />
                          <span className="text-foreground">
                            {coordinator.coursesManaged} Courses
                          </span>
                        </div>
                        <Badge variant="outline" className="font-normal">
                          {coordinator.rating} / 5.0
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Users2 className="h-4 w-4 text-violet-500 dark:text-violet-400" />
                          <span className="text-foreground">
                            {coordinator.studentsManaged} Students
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {coordinator.completionRate}% completion
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-violet-500/10 hover:text-violet-600"
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-violet-500/10 hover:text-violet-600"
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {new Date(coordinator.joinedDate).toLocaleDateString()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem>
                          <Edit2 className="mr-2 h-4 w-4" />
                          Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove Coordinator
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
