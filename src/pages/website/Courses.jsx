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

export function Courses() {
  const categories = [
    { label: "All Courses", icon: Sparkles },
    { label: "Web Development", icon: Code },
    { label: "Data Science", icon: Database },
    { label: "Mobile Development", icon: BookOpen },
    { label: "Cloud Computing", icon: Cloud },
    { label: "DevOps", icon: Cpu },
    { label: "AI & Machine Learning", icon: Brain },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="relative border-b overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-purple-50/50 dark:from-violet-950 dark:via-zinc-900 dark:to-purple-900/10" />
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
        <div className="absolute -left-20 top-0 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/30 blur-[100px] dark:from-violet-500/10 dark:to-purple-500/20" />
        <div className="absolute -right-20 bottom-0 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/30 blur-[100px] dark:from-violet-500/10 dark:to-purple-500/20" />

        <div className="container relative px-4 md:px-6 py-12 md:py-16">
          <div className="flex flex-col items-center text-center space-y-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-violet-100/80 dark:bg-violet-900/30 px-4 py-1.5 backdrop-blur-sm">
                <Badge className="bg-violet-500/20 text-violet-700 dark:text-violet-300 hover:bg-violet-500/20">
                  <Sparkles className="h-3.5 w-3.5 mr-1" />
                  New Courses Added
                </Badge>
              </div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-700 dark:from-white dark:to-zinc-200">
                Explore Our Courses
              </h1>
              <p className="max-w-[600px] mx-auto text-zinc-500 text-lg dark:text-zinc-400">
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
                  className="w-full h-14 pl-12 pr-32 rounded-full bg-white/80 dark:bg-zinc-800/80 border-zinc-200/80 dark:border-zinc-700/80 backdrop-blur-sm text-lg"
                  placeholder="What do you want to learn?"
                  type="search"
                />
                <Button className="absolute right-2 h-10 px-6 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg shadow-violet-500/25">
                  Search
                </Button>
              </div>
            </div>

            {/* Popular Searches */}
            <div className="flex flex-wrap justify-center gap-2 text-sm">
              <span className="text-zinc-500 dark:text-zinc-400">Popular:</span>
              {["React", "Python", "AWS", "Data Science", "AI"].map((term) => (
                <Button
                  key={term}
                  variant="link"
                  className="text-violet-600 dark:text-violet-400 h-auto p-0 hover:no-underline"
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
          {categories.map(({ label, icon: Icon }) => (
            <Button
              key={label}
              variant={label === "All Courses" ? "default" : "outline"}
              className="rounded-full whitespace-nowrap h-10"
            >
              <Icon className="h-4 w-4 mr-2" />
              {label}
            </Button>
          ))}
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">120</span>{" "}
            courses
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <select className="h-9 rounded-md border bg-background px-3 py-1 text-sm">
              <option>Most Popular</option>
              <option>Newest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, index) => (
            <Link
              key={index}
              to={`/courses/web-development-${index + 1}`}
              className="block group"
            >
              <Card className="overflow-hidden border-border/50 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/5">
                <div className="relative aspect-video">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/5 z-10" />
                  <img
                    src={`https://source.unsplash.com/random/800x600?coding&${index}`}
                    alt="Course thumbnail"
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 z-20">
                    <Badge className="bg-white/95 text-primary shadow-sm font-medium">
                      {index % 2 === 0 ? "Bestseller" : "New"}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 z-20">
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-violet-200 transition-colors">
                      Complete Web Development Bootcamp {index + 1}
                    </h3>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="secondary"
                        className="bg-black/30 text-white border-none backdrop-blur-sm"
                      >
                        Beginner
                      </Badge>
                      <div className="flex items-center gap-1.5 text-white/90 text-sm">
                        <Timer className="h-3.5 w-3.5" />
                        12 weeks
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-muted-foreground text-sm mb-6">
                    Learn web development from scratch with hands-on projects
                    and real-world examples.
                  </p>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <Users className="h-4 w-4 text-violet-500" />
                        <span className="text-sm text-muted-foreground">
                          15,000+
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < 4
                                  ? "fill-amber-400 text-amber-400"
                                  : "fill-zinc-200 text-zinc-200 dark:fill-zinc-800 dark:text-zinc-800"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium">4.9</span>
                      </div>
                    </div>
                    <span className="text-lg font-semibold text-violet-600 dark:text-violet-400">
                      $599
                    </span>
                  </div>
                  <Button className="w-full bg-violet-50 hover:bg-violet-100 text-violet-600 dark:bg-violet-900/50 dark:hover:bg-violet-900 dark:text-violet-300 h-10 transition-colors">
                    Learn More
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-12">
          <div className="flex items-center gap-2">
            {[1, 2, 3, "...", 10].map((page, index) => (
              <Button
                key={index}
                variant={page === 1 ? "default" : "outline"}
                className={`w-10 h-10 p-0 ${
                  page === 1 ? "bg-violet-600 hover:bg-violet-700" : ""
                }`}
                disabled={page === "..."}
              >
                {page}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <SimpleFooter />
    </div>
  );
}
