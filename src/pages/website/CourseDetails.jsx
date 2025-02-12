import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Timer,
  Users,
  Star,
  CheckCircle2,
  GraduationCap,
  Globe2,
  BookOpen,
  Award,
  Download,
  MonitorPlay,
  FileText,
  ArrowRight,
  ExternalLink,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { SimpleFooter } from "@/components/SimpleFooter";
import { useAuth } from "@/contexts/AuthContext";
import { useCourse, useRelatedCourses } from "@/api/courses/hooks";
import { VideoPlayer } from "@/components/VideoPlayer";
import { useState } from "react";
import { Link } from "react-router-dom";
import { usePublicModules } from "@/api/modules/hooks";
import { useEnrollingBatch } from "@/api/batches";
import { useEnrollInBatch } from "@/api/enrollments";
import { formatDistanceToNow } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { useEnrollments } from "@/api/enrollments";
import { useQueryClient } from "@tanstack/react-query";
import { batchKeys } from "@/api/batches";
import { enrollmentKeys } from "@/api/enrollments";

export function CourseDetails() {
  const params = useParams();
  const { slug } = params;

  console.log("Route params:", params); // Log all params
  console.log("Current slug:", slug);
  console.log("Current URL:", window.location.pathname); // Log current URL

  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const { data: course, isLoading, error } = useCourse(slug);
  const { data: relatedCourses, isLoading: relatedCoursesLoading } =
    useRelatedCourses(slug);
  const { data: modules, isLoading: modulesLoading } = usePublicModules(
    course?._id
  );
  const { data: enrollingBatch, isLoading: isLoadingBatch } = useEnrollingBatch(
    course?._id
  );
  const enrollMutation = useEnrollInBatch();

  // Add query to check user's enrollments
  const { data: userEnrollments, isLoading: isLoadingEnrollments } =
    useEnrollments();
  const queryClient = useQueryClient(); // Add this

  // Helper function to check if user is enrolled in current course
  const userEnrollment = userEnrollments?.find(
    (enrollment) => enrollment.batch.course._id === course?._id
  );

  // Don't make the API call if there's no slug
  const enabled = Boolean(slug);

  console.log("Query state:", { isLoading, error, course, enabled });

  const [enrollmentError, setEnrollmentError] = useState(null);

  const handleEnroll = async () => {
    // Reset any previous errors
    setEnrollmentError(null);

    if (!user) {
      navigate("/auth/login", {
        state: { from: location.pathname },
      });
      return;
    }

    if (!enrollingBatch) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No batch available for enrollment",
      });
      return;
    }

    try {
      await enrollMutation.mutateAsync(enrollingBatch._id);
      // Refetch enrolling batch and user enrollments
      queryClient.invalidateQueries(batchKeys.enrolling(course._id));
      queryClient.invalidateQueries(enrollmentKeys.list());

      toast({
        title: "Success",
        description: "Successfully enrolled in the course!",
      });
      // Optionally redirect to dashboard
      navigate("/dashboard/courses");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to enroll";
      setEnrollmentError(errorMessage);
      toast({
        variant: "destructive",
        title: "Enrollment Failed",
        description: errorMessage,
      });
    }
  };

  // Update the enrollment button section
  const renderEnrollmentButton = () => {
    // Show loading state
    if (isLoadingBatch || isLoadingEnrollments) {
      return (
        <Button disabled className="w-full h-14 text-lg">
          Loading...
        </Button>
      );
    }

    // Show enrolled status if user is already enrolled
    if (userEnrollment) {
      return (
        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full h-14 text-lg bg-green-50 hover:bg-green-100 border-green-200 text-green-700"
            onClick={() => navigate("/dashboard/courses")}
          >
            <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
            Already Enrolled
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            Batch {userEnrollment.batch.batchNumber} • {userEnrollment.status}
          </p>
          <p
            className="text-sm text-violet-600 text-center hover:underline cursor-pointer"
            onClick={() => navigate("/dashboard/courses")}
          >
            Go to Course Dashboard
          </p>
        </div>
      );
    }

    // No batch available
    if (!enrollingBatch) {
      return (
        <div className="space-y-2">
          <Button disabled className="w-full h-14 text-lg">
            Enrollment Closed
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            No batch currently accepting enrollments
          </p>
        </div>
      );
    }

    // Batch is full
    if (enrollingBatch.isFull) {
      return (
        <div className="space-y-2">
          <Button disabled className="w-full h-14 text-lg">
            Batch Full
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            Current batch is full. Please wait for next batch.
          </p>
        </div>
      );
    }

    // Default enrollment button with error display
    return (
      <div className="space-y-2">
        <Button
          onClick={handleEnroll}
          className="w-full h-14 text-lg font-semibold bg-violet-600 hover:bg-violet-700"
          disabled={enrollMutation.isPending}
        >
          {enrollMutation.isPending
            ? "Enrolling..."
            : user
            ? "Enroll Now"
            : "Sign in to Enroll"}
        </Button>

        {/* Show enrollment error if any */}
        {enrollmentError && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm text-red-600 text-center">
              {enrollmentError}
            </p>
          </div>
        )}

        <p className="text-sm text-muted-foreground text-center">
          Batch {enrollingBatch.batchNumber} • Enrollment ends in{" "}
          {formatDistanceToNow(new Date(enrollingBatch.enrollmentEndDate))}
        </p>
        <p className="text-sm text-muted-foreground text-center">
          {enrollingBatch.maxStudents - enrollingBatch.enrollmentCount} seats
          remaining
        </p>
      </div>
    );
  };

  // Add state for video modal
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Add this state at the top of your component
  const [showAllModules, setShowAllModules] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">
            Loading course details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">Error loading course details</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl">Course not found</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate("/courses")}
          >
            Back to Courses
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative border-b bg-gradient-to-b from-violet-50 to-white">
        <div className="absolute inset-0 bg-grid-black/[0.02]" />

        {/* Main Content */}
        <div className="container relative px-4 md:px-6 py-8 md:py-12">
          <div className="grid gap-8 lg:grid-cols-12">
            {/* Left Column - Course Info */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
              {/* Breadcrumb */}
              <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Link to="/courses" className="hover:text-foreground">
                  Courses
                </Link>
                <span>•</span>
                <span>{course.category?.name}</span>
              </div>

              {/* Course Title & Badges */}
              <div className="space-y-4 mb-6">
                <div className="flex flex-wrap gap-2">
                  {course.stats.enrolledStudents > 1000 && (
                    <Badge className="bg-violet-500/10 text-violet-600 hover:bg-violet-500/20">
                      Bestseller
                    </Badge>
                  )}
                  <Badge variant="secondary">{course.level}</Badge>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  {course.title}
                </h1>
              </div>

              {/* Course Brief */}
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                {course.description}
              </p>

              {/* Course Stats */}
              <div className="flex flex-wrap items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-lg">
                      {course.stats.rating}
                    </span>
                    <span className="text-muted-foreground">
                      ({course.stats.reviewCount.toLocaleString()} reviews)
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span>
                    {course.stats.enrolledStudents.toLocaleString()}+ enrolled
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Timer className="h-5 w-5 text-muted-foreground" />
                  <span>{course.duration} weeks</span>
                </div>
              </div>

              {/* Instructor Info */}
              <div className="flex items-center gap-4 mb-6">
                {course.coordinator && (
                  <>
                    <div className="h-12 w-12 rounded-full bg-violet-100 flex items-center justify-center">
                      <span className="font-medium text-violet-600 text-lg">
                        {course.coordinator.username[0].toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Created by
                      </p>
                      <p className="font-medium text-violet-600">
                        {course.coordinator.username}
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Mobile Enrollment Button (shown only on mobile) */}
              <div className="lg:hidden mb-6">{renderEnrollmentButton()}</div>

              {/* Quick Info Pills */}
              <div className="flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100">
                  <GraduationCap className="h-4 w-4" />
                  <span className="text-sm">{course.level}</span>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100">
                  <Globe2 className="h-4 w-4" />
                  <span className="text-sm">{course.language}</span>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100">
                  <Award className="h-4 w-4" />
                  <span className="text-sm">Certificate Included</span>
                </div>
              </div>
            </div>

            {/* Right Column - Video Preview & CTA */}
            <div className="lg:col-span-5 xl:col-span-4 space-y-6">
              {/* Video Preview */}
              <div className="relative aspect-video rounded-xl overflow-hidden border shadow-2xl bg-black">
                {course.previewVideo?.url ? (
                  showVideoModal ? (
                    <VideoPlayer
                      src={course.previewVideo.url}
                      poster={course.previewVideo.thumbnail || course.image}
                    />
                  ) : (
                    <>
                      <img
                        src={course.previewVideo.thumbnail || course.image}
                        alt={`${course.title} preview`}
                        className="object-cover w-full h-full opacity-90 hover:opacity-100 transition-opacity"
                        onClick={() => setShowVideoModal(true)}
                      />
                      <div
                        className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-all cursor-pointer"
                        onClick={() => setShowVideoModal(true)}
                      >
                        <Button
                          size="icon"
                          className="h-16 w-16 rounded-full bg-violet-600/90 hover:bg-violet-600 text-white shadow-xl transition-transform hover:scale-105"
                        >
                          <Play className="h-8 w-8" />
                        </Button>
                      </div>
                    </>
                  )
                ) : (
                  <div className="w-full h-full bg-zinc-100 flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-zinc-400" />
                  </div>
                )}
              </div>

              {/* Desktop Enrollment Card */}
              <div className="hidden lg:block rounded-xl border bg-card shadow-lg p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">₹{course.price}</div>
                    {course.pricing?.originalPrice && (
                      <div className="text-xl text-muted-foreground line-through">
                        ₹{course.pricing.originalPrice}
                      </div>
                    )}
                  </div>
                  {renderEnrollmentButton()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <div className="container px-4 md:px-6 py-12">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* What You'll Learn */}
            <section className="rounded-xl border bg-card p-6 space-y-6">
              <div className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-violet-600" />
                <h2 className="text-2xl font-semibold">What you'll learn</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                {course.learningOutcomes.map((outcome, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-[15px] leading-relaxed">
                      {outcome}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Requirements */}
            <section className="rounded-xl border bg-card p-6 space-y-6">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-violet-600" />
                <h2 className="text-2xl font-semibold">Requirements</h2>
              </div>
              <ul className="space-y-3 text-[15px] leading-relaxed">
                {course.requirements.map((requirement, index) => (
                  <li key={index}>• {requirement}</li>
                ))}
              </ul>
            </section>

            {/* Description */}
            <section className="rounded-xl border bg-card p-6 space-y-6">
              <div className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-violet-600" />
                <h2 className="text-2xl font-semibold">Description</h2>
              </div>
              <div className="space-y-4 text-[15px] leading-relaxed">
                <p>{course.description}</p>
                {course.features.length > 0 && (
                  <>
                    <p>Key features:</p>
                    <ul className="list-disc pl-5 space-y-2">
                      {course.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </section>

            {/* Course Modules */}
            <section className="rounded-xl border bg-card p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-violet-600" />
                  <h2 className="text-2xl font-semibold">Course Content</h2>
                </div>
                {modules?.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    {modules.length}{" "}
                    {modules.length === 1 ? "module" : "modules"} •{" "}
                    {course.totalHours} hours total
                  </div>
                )}
              </div>

              {modulesLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-12 bg-zinc-100 rounded-lg mb-2" />
                      <div className="pl-12 space-y-2">
                        {[1, 2].map((j) => (
                          <div
                            key={j}
                            className="h-8 bg-zinc-50 rounded"
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : modules?.length > 0 ? (
                <div className="space-y-4">
                  <div className="border rounded-xl divide-y">
                    {/* Show only first 3 modules or all if showAllModules is true */}
                    {modules
                      .slice(0, showAllModules ? undefined : 3)
                      .map((module, index) => (
                        <div key={module._id} className="divide-y">
                          {/* Module Header */}
                          <div className="p-4 hover:bg-zinc-50">
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium">
                                    Module {index + 1}: {module.title}
                                  </h3>
                                  {module.isOptional && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      Optional
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {module.description}
                                </p>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {module.content?.length || 0} lectures •{" "}
                                {module.duration || 0} mins
                              </div>
                            </div>
                          </div>

                          {/* Module Content */}
                          {module.content && module.content.length > 0 && (
                            <div className="bg-zinc-50/50 divide-y">
                              {module.content.map((content) => (
                                <div
                                  key={content._id}
                                  className="p-4 pl-8 flex items-center gap-3"
                                >
                                  {content.type === "video" && (
                                    <Play className="h-4 w-4 text-violet-600" />
                                  )}
                                  {content.type === "document" && (
                                    <FileText className="h-4 w-4 text-blue-600" />
                                  )}
                                  {content.type === "link" && (
                                    <ExternalLink className="h-4 w-4 text-emerald-600" />
                                  )}
                                  <div className="flex-1">
                                    <span className="text-sm">
                                      {content.title}
                                      {content.isPreview && (
                                        <Badge
                                          variant="secondary"
                                          className="ml-2 text-xs bg-violet-100 text-violet-600"
                                        >
                                          Preview
                                        </Badge>
                                      )}
                                    </span>
                                  </div>
                                  {content.duration && (
                                    <span className="text-sm text-muted-foreground">
                                      {Math.round(content.duration / 60)} min
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>

                  {/* Show More/Less Button */}
                  {modules.length > 3 && (
                    <Button
                      variant="outline"
                      className="w-full gap-2"
                      onClick={() => setShowAllModules(!showAllModules)}
                    >
                      {showAllModules ? (
                        <>
                          <ChevronUp className="h-4 w-4" />
                          Show Less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4" />
                          Show {modules.length - 3} More Modules
                        </>
                      )}
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    Course content not published yet
                  </h3>
                  <p className="text-muted-foreground">
                    The instructor is still working on this course. Check back
                    soon!
                  </p>
                </div>
              )}
            </section>

            {/* Instructor */}
            {course.coordinator && (
              <section className="rounded-xl border bg-card p-6 space-y-6">
                <div className="flex items-center gap-2">
                  <Users className="h-6 w-6 text-violet-600" />
                  <h2 className="text-2xl font-semibold">Instructor</h2>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded-full bg-violet-100 flex items-center justify-center">
                    <span className="font-medium text-violet-600 text-xl">
                      {course.coordinator.username[0]}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">
                      {course.coordinator.username}
                    </h3>
                    <div className="flex items-center gap-4 text-sm pt-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span>{course.stats.rating} Instructor Rating</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="h-4 w-4 text-violet-600" />
                        <span>{course.stats.reviewCount}+ Reviews</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-violet-600" />
                        <span>{course.stats.enrolledStudents}+ Students</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="sticky top-20">
              <div className="rounded-xl border bg-card shadow-sm p-6 space-y-6">
                <div className="text-3xl font-bold">₹{course.price}</div>
                {renderEnrollmentButton()}
                <div className="space-y-4">
                  {[
                    {
                      icon: MonitorPlay,
                      text: `${course.totalHours}+ hours of content`,
                    },
                    {
                      icon: FileText,
                      text: `${course.learningOutcomes.length} learning outcomes`,
                    },
                    { icon: Download, text: "Downloadable resources" },
                    {
                      icon: Award,
                      text: course.certificates?.isEnabled
                        ? "Certificate of completion"
                        : "No certificate",
                    },
                    { icon: Globe2, text: course.language },
                    { icon: Globe2, text: "Lifetime access" },
                  ].map(({ icon: Icon, text }, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-violet-600" />
                      <span className="text-sm">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="border-t bg-zinc-50/50">
        <div className="container px-4 md:px-6 py-12 md:py-16">
          {/* Related Courses - Only show if there are related courses */}
          {(relatedCoursesLoading || relatedCourses?.length > 0) && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Related Courses</h2>
                <Button
                  variant="ghost"
                  className="text-violet-600"
                  onClick={() => navigate("/courses")}
                >
                  View All Courses
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>

              {relatedCoursesLoading ? (
                <div className="grid md:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="rounded-xl border bg-card animate-pulse"
                    >
                      <div className="aspect-video bg-zinc-200 rounded-t-xl" />
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-zinc-200 rounded w-3/4" />
                        <div className="h-4 bg-zinc-200 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid md:grid-cols-3 gap-6">
                  {relatedCourses.map((course) => (
                    <div
                      key={course._id}
                      className="group rounded-xl border bg-card overflow-hidden hover:shadow-lg transition-all"
                    >
                      <Link to={`/courses/${course.slug}`}>
                        <div className="aspect-video relative overflow-hidden">
                          <img
                            src={
                              course.image ||
                              `https://source.unsplash.com/random/800x600?coding`
                            }
                            alt={course.title}
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80";
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                          <div className="absolute bottom-4 left-4 right-4">
                            <h3 className="text-lg font-semibold text-white line-clamp-2">
                              {course.title}
                            </h3>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                              <span className="text-sm font-medium">
                                {course.stats.rating}
                              </span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {course.stats.enrolledStudents}+ students
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-violet-600">
                              ₹{course.price}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-violet-600"
                            >
                              Learn More
                            </Button>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CTA Section */}
          <div
            className={`${
              relatedCoursesLoading || relatedCourses?.length > 0 ? "mt-16" : ""
            } text-center`}
          >
            <div className="max-w-2xl mx-auto space-y-4">
              <h2 className="text-2xl font-semibold">
                Ready to Start Your Learning Journey?
              </h2>
              <p className="text-muted-foreground">
                Join thousands of students who have already taken the first step
                towards their career goals.
              </p>
              <div className="flex items-center justify-center gap-4 pt-4">
                <Button size="lg" className="bg-violet-600 hover:bg-violet-700">
                  Enroll Now
                </Button>
                <Button size="lg" variant="outline">
                  View Curriculum
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SimpleFooter />
    </div>
  );
}
