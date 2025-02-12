import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Search,
  ArrowRight,
  Timer,
  Users,
  Star,
  SlidersHorizontal,
  Sparkles,
  BookOpen,
  Code,
  Database,
  Cloud,
  Cpu,
  Brain,
} from "lucide-react";
import { Link } from "react-router-dom";
import { SimpleFooter } from "@/components/SimpleFooter";
import { useCourses } from "@/api/courses";
import { useDebounce } from "@/hooks/useDebounce";
import { useCategories } from "@/api/categories";

const truncateText = (text, maxLength) => {
  if (!text) return "";
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};

const getIconForCategory = (slug) => {
  const iconMap = {
    "web-development": Code,
    "data-science": Database,
    "mobile-development": BookOpen,
    "cloud-computing": Cloud,
    devops: Cpu,
    "ai-machine-learning": Brain,
  };
  return iconMap[slug] || BookOpen;
};

export function Courses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState("popular");

  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data: categoriesData, isLoading: categoriesLoading } =
    useCategories();

  const {
    data,
    isLoading: coursesLoading,
    error,
  } = useCourses({
    search: debouncedSearch,
    category: selectedCategory,
    page: currentPage,
    sort,
  });

  const categories = [
    { slug: "all", name: "All Courses", icon: Sparkles },
    ...(categoriesData?.map((cat) => ({
      slug: cat.slug,
      name: cat.name,
      icon: getIconForCategory(cat.slug),
    })) || []),
  ];

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="relative border-b overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-purple-50/50" />
        <div className="absolute inset-0 bg-grid-black/[0.02]" />
        <div className="absolute -left-20 top-0 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/30 blur-[100px]" />
        <div className="absolute -right-20 bottom-0 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/30 blur-[100px]" />

        <div className="container relative px-4 md:px-6 py-12 md:py-16">
          <div className="flex flex-col items-center text-center space-y-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-violet-100/80 px-4 py-1.5 backdrop-blur-sm">
                <Badge className="bg-violet-500/20 text-violet-700 hover:bg-violet-500/20">
                  <Sparkles className="h-3.5 w-3.5 mr-1" />
                  New Courses Added
                </Badge>
              </div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-700">
                Explore Our Courses
              </h1>
              <p className="max-w-[600px] mx-auto text-zinc-500 text-lg">
                Choose from hundreds of courses and start your journey in tech
                today.
              </p>
            </div>

            {/* Search Bar */}
            <div className="w-full max-w-3xl relative">
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-violet-500/20 to-purple-500/20 blur-[32px]" />
              <div className="relative flex items-center">
                <Search className="absolute left-5 h-5 w-5 text-zinc-500" />
                <Input
                  className="w-full h-14 pl-12 pr-32 rounded-full bg-white/80 border-zinc-200/80 backdrop-blur-sm text-lg"
                  placeholder="What do you want to learn?"
                  type="search"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <Button className="absolute right-2 h-10 px-6 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg shadow-violet-500/25">
                  Search
                </Button>
              </div>
            </div>

            {/* Popular Searches */}
            <div className="flex flex-wrap justify-center gap-2 text-sm">
              <span className="text-zinc-500">Popular:</span>
              {["React", "Python", "AWS", "Data Science", "AI"].map((term) => (
                <Button
                  key={term}
                  variant="link"
                  className="text-violet-600 h-auto p-0 hover:no-underline"
                >
                  {term}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container px-4 md:px-6 py-8 md:py-12">
        {/* Categories */}
        <div className="flex items-center gap-2 pb-8 overflow-x-auto">
          {categoriesLoading ? (
            <div>Loading categories...</div>
          ) : (
            categories.map(({ slug, name, icon: Icon }) => (
              <Button
                key={slug}
                variant={selectedCategory === slug ? "default" : "outline"}
                className="rounded-full whitespace-nowrap h-10"
                onClick={() => handleCategoryChange(slug)}
              >
                <Icon className="h-4 w-4 mr-2" />
                {name}
              </Button>
            ))
          )}
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">
              {data?.pagination?.total || 0}
            </span>{" "}
            courses
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <select
              className="h-9 rounded-md border bg-background px-3 py-1 text-sm"
              value={sort}
              onChange={handleSortChange}
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Course Grid */}
        {coursesLoading || categoriesLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading courses...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">Error loading courses</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        ) : data?.courses.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="max-w-md mx-auto space-y-6">
              <div className="flex justify-center">
                <div className="h-24 w-24 rounded-full bg-violet-100 flex items-center justify-center">
                  {selectedCategory === "all" ? (
                    <Search className="h-12 w-12 text-violet-500" />
                  ) : (
                    (() => {
                      const Icon = categories.find(
                        (cat) => cat.slug === selectedCategory
                      )?.icon;
                      return Icon ? (
                        <Icon className="h-12 w-12 text-violet-500" />
                      ) : (
                        <BookOpen className="h-12 w-12 text-violet-500" />
                      );
                    })()
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">
                  {selectedCategory === "all"
                    ? "No courses found"
                    : `No courses in ${
                        categories.find((cat) => cat.slug === selectedCategory)
                          ?.name
                      }`}
                </h3>
                <p className="text-muted-foreground">
                  {selectedCategory === "all"
                    ? "Try adjusting your search or filters to find what you're looking for."
                    : "Check back later for new courses in this category."}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  className="bg-violet-600 hover:bg-violet-700"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                    setSort("popular");
                  }}
                >
                  View All Courses
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.courses.map((course) => (
              <Link
                key={course._id}
                to={`/courses/${course.slug}`}
                className="block group"
              >
                <Card className="overflow-hidden border-border/50 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/5">
                  <div className="relative h-48">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/5 z-10" />
                    <img
                      src={
                        course.image ||
                        `https://source.unsplash.com/random/800x600?coding`
                      }
                      alt={course.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 z-20">
                      <Badge className="bg-white/95 text-primary shadow-sm font-medium">
                        {course.level}
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 z-20">
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-violet-200 transition-colors line-clamp-2">
                        {course.title}
                      </h3>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="secondary"
                          className="bg-black/30 text-white border-none backdrop-blur-sm"
                        >
                          {course.level}
                        </Badge>
                        <div className="flex items-center gap-1.5 text-white/90 text-sm">
                          <Timer className="h-3.5 w-3.5" />
                          {course.duration} weeks
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 h-[200px] flex flex-col">
                    <p className="text-muted-foreground text-sm mb-6 line-clamp-2">
                      {truncateText(course.description, 120)}
                    </p>
                    <div className="flex items-center justify-between mb-6 mt-auto">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                          <Users className="h-4 w-4 text-violet-500" />
                          <span className="text-sm text-muted-foreground">
                            {course.stats.enrolledStudents}+
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.floor(course.stats.rating)
                                    ? "fill-amber-400 text-amber-400"
                                    : "fill-zinc-200 text-zinc-200"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium">
                            {course.stats.rating}
                          </span>
                        </div>
                      </div>
                      <span className="text-lg font-semibold text-violet-600">
                        ₹{course.price}
                      </span>
                    </div>
                    <Button className="w-full bg-violet-50 hover:bg-violet-100 text-violet-600 h-10 transition-colors">
                      Learn More
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {data?.pagination && (
          <div className="flex justify-center mt-12">
            <div className="flex items-center gap-2">
              {Array.from(
                { length: data.pagination.pages },
                (_, i) => i + 1
              ).map((page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "outline"}
                  className={`w-10 h-10 p-0 ${
                    page === currentPage
                      ? "bg-violet-600 hover:bg-violet-700"
                      : ""
                  }`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
            </div>
          </div>
        )}
      </section>

      <SimpleFooter />
    </div>
  );
}
