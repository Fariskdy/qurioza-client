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
import {
  MoreVertical,
  Search,
  Edit2,
  Trash2,
  Plus,
  ChevronUp,
  Filter,
  ArrowUpDown,
  BookOpen,
  Layers,
  BarChart2,
  Clock,
  Image as ImageIcon,
  FolderOpen,
  Sparkles,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function CategoryManagement() {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - replace with actual API call
  const categories = [
    {
      id: 1,
      name: "Web Development",
      slug: "web-development",
      description: "Learn modern web development technologies and frameworks",
      image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479",
      coursesCount: 24,
      studentsCount: 1200,
      createdAt: "2023-01-15",
      popularity: 92,
    },
    {
      id: 2,
      name: "Mobile Development",
      slug: "mobile-development",
      description: "Master mobile app development for iOS and Android",
      image: "https://images.unsplash.com/photo-1526498460520-4c246339dccb",
      coursesCount: 18,
      studentsCount: 850,
      createdAt: "2023-02-20",
      popularity: 88,
    },
  ];

  const stats = [
    {
      title: "Total Categories",
      value: "16",
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
                  Course Categories
                </h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Add and manage course categories
              </p>
            </div>
            <Button className="bg-violet-600 hover:bg-violet-700 shadow-sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
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
                  Category
                </TableHead>
                <TableHead className="text-muted-foreground">Slug</TableHead>
                <TableHead className="text-muted-foreground">Stats</TableHead>
                <TableHead className="text-muted-foreground">Created</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow
                  key={category.id}
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
                        <div className="text-sm text-muted-foreground line-clamp-1">
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
                            {category.coursesCount} Courses
                          </span>
                        </div>
                        <Badge variant="outline" className="font-normal">
                          {category.popularity}% Popular
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <FolderOpen className="h-4 w-4 text-violet-500 dark:text-violet-400" />
                          <span className="text-foreground">
                            {category.studentsCount} Students
                          </span>
                        </div>
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
                          Edit Category
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Category
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
