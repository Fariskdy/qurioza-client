import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  useBatch,
  useUpdateBatchStatus,
  useAssignTeachers,
  useToggleAutoUpdate,
  useDeleteBatch,
} from "@/api/batches";
import { useCourse } from "@/api/courses";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar,
  Users,
  ArrowLeft,
  ChevronRight,
  Settings,
  UserPlus,
  Clock,
  GraduationCap,
  BookOpen,
  BarChart2,
  Play,
  CheckCircle,
  Info,
  AlertTriangle,
  History,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EditBatchDialog from "@/components/batches/EditBatchDialog";
import { useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { AssignTeachersDialog } from "./components/AssignTeachersDialog";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { batchKeys } from "@/api/batches";
import { api } from "@/api/axios";
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

const calculateBatchProgress = (batch) => {
  if (!batch) return { progress: 0, message: "Loading..." };

  if (batch.status === "upcoming") {
    return {
      progress: 0,
      message: "0/0",
      status: "Not started",
    };
  }

  if (batch.status === "enrolling") {
    const startDate = new Date(batch.enrollmentStartDate);
    const endDate = new Date(batch.enrollmentEndDate);
    const currentDate = new Date();

    // Calculate enrollment progress
    const totalDuration = endDate - startDate;
    const elapsed = currentDate - startDate;
    const progress = Math.min(Math.round((elapsed / totalDuration) * 100), 100);

    return {
      progress,
      message: `${progress}/100`,
      status: "Enrolling",
    };
  }

  if (batch.status === "completed") {
    return {
      progress: 100,
      message: "100/100",
      status: "Completed",
    };
  }

  // For ongoing batches, calculate progress based on duration
  const startDate = new Date(batch.batchStartDate);
  const endDate = new Date(batch.batchEndDate);
  const currentDate = new Date();

  // If batch hasn't started yet
  if (currentDate < startDate) {
    return {
      progress: 0,
      message: "0/100",
      status: "Starting soon",
    };
  }

  // Calculate progress percentage
  const totalDuration = endDate - startDate;
  const elapsed = currentDate - startDate;
  const progress = Math.min(Math.round((elapsed / totalDuration) * 100), 100);

  return {
    progress,
    message: `${progress}/100`,
    status: "In progress",
  };
};

const StatusBadge = ({ status }) => {
  const statusConfig = {
    upcoming: {
      label: "Upcoming",
      color:
        "text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-[#0B4F6C]/50",
    },
    enrolling: {
      label: "Enrolling",
      color:
        "text-violet-600 dark:text-violet-400 bg-violet-50/80 dark:bg-[#0B4F6C]/50",
    },
    ongoing: {
      label: "Ongoing",
      color:
        "text-green-600 dark:text-green-400 bg-green-50/80 dark:bg-[#0B4F6C]/50",
    },
    completed: {
      label: "Completed",
      color:
        "text-zinc-600 dark:text-zinc-400 bg-zinc-100/80 dark:bg-[#0B4F6C]/50",
    },
  };

  const config = statusConfig[status];
  return (
    <Badge
      variant="secondary"
      className={cn(
        "capitalize bg-white/95 dark:bg-black/80 backdrop-blur-sm",
        config.color
      )}
    >
      {config.label}
    </Badge>
  );
};

const getProgressColor = (progress) => {
  if (progress >= 80) return "bg-emerald-500";
  if (progress >= 50) return "bg-violet-500";
  if (progress >= 20) return "bg-amber-500";
  return "bg-zinc-500";
};

const StatsCard = ({
  title,
  value,
  icon: Icon,
  description,
  progress,
  total,
  status,
}) => (
  <Card className="overflow-hidden border dark:border-[#2A3F47] dark:bg-[#202F36] transition-all duration-300 hover:shadow-lg">
    <CardContent className="p-6">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-violet-50/80 dark:bg-[#0B4F6C]/50 backdrop-blur-sm">
          <Icon className="h-6 w-6 text-violet-600 dark:text-violet-400" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="text-2xl font-semibold dark:text-[#E3E5E5]">
            {value}
            {total && (
              <span className="text-base text-muted-foreground dark:text-[#94A3B8]">
                /{total}
              </span>
            )}
          </div>
          <div className="text-sm text-muted-foreground dark:text-[#94A3B8]">
            {title}
          </div>
        </div>
      </div>
      {progress !== undefined && (
        <div className="mt-4 space-y-1">
          <Progress
            value={progress}
            className={cn("h-2", getProgressColor(progress))}
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground dark:text-[#94A3B8]">
            <span>{status}</span>
            <span>
              {progress}% {description}
            </span>
          </div>
        </div>
      )}
    </CardContent>
  </Card>
);

function ManualOverrideDialog({ batch, onConfirm, open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Manual Status Update</DialogTitle>
          <DialogDescription>
            This will override the automatic status updates for this batch. The
            batch dates will be adjusted to reflect this manual change.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <div className="flex gap-2 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-5 w-5" />
              <div className="text-sm">
                <p className="font-medium">Important:</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Current date will become the new transition date</li>
                  <li>Auto-updates will be disabled for this batch</li>
                  <li>You can re-enable auto-updates in settings later</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            className="gap-2 bg-violet-600 hover:bg-violet-700 text-white"
          >
            <Play className="h-4 w-4" />
            Confirm Override
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const getRelevantDate = (batch) => {
  switch (batch.status) {
    case "upcoming":
      return {
        label: "Enrollment starts",
        date: new Date(batch.enrollmentStartDate).toLocaleDateString(),
      };
    case "enrolling":
      return {
        label: "Batch starts",
        date: new Date(batch.batchStartDate).toLocaleDateString(),
      };
    case "ongoing":
      return {
        label: "Batch ends",
        date: new Date(batch.batchEndDate).toLocaleDateString(),
      };
    default:
      return null;
  }
};

const BatchStatusActions = ({ batch, onStatusUpdate }) => {
  const [showOverrideDialog, setShowOverrideDialog] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);
  const rollbackMutation = useRollbackStatus();

  // Helper to check if rollback is available and get previous status
  const getRollbackInfo = () => {
    const history = batch.statusHistory;
    if (!history?.length || history[history.length - 1].isAutomatic) {
      return null;
    }

    // Get the last history entry which contains the previous status
    const lastHistoryEntry = history[history.length - 1];
    return {
      canRollback: true,
      previousStatus: lastHistoryEntry.status,
    };
  };

  const getNextStatus = (currentStatus) => {
    const transitions = {
      upcoming: "enrolling",
      enrolling: "ongoing",
      ongoing: "completed",
    };
    return transitions[currentStatus];
  };

  const nextStatus = getNextStatus(batch.status);

  if (!nextStatus) return null; // No actions for completed batches

  const statusLabels = {
    enrolling: "Start Enrollment",
    ongoing: "Start Batch",
    completed: "Complete Batch",
  };

  const statusIcons = {
    enrolling: UserPlus,
    ongoing: Play,
    completed: CheckCircle,
  };

  const handleStatusClick = () => {
    if (batch.isAutoUpdated) {
      setPendingStatus(nextStatus);
      setShowOverrideDialog(true);
    } else {
      onStatusUpdate(nextStatus);
    }
  };

  const handleOverrideConfirm = () => {
    onStatusUpdate(pendingStatus);
  };

  const Icon = statusIcons[nextStatus];
  const relevantDate = getRelevantDate(batch);

  const handleRollback = async () => {
    try {
      await rollbackMutation.mutateAsync({
        courseId: batch.course,
        batchId: batch._id,
      });
      // Only show success toast
      toast.success("Status rolled back successfully");
    } catch (error) {
      // Error toast will be shown automatically by axios interceptor
      console.error(error);
    }
  };

  return (
    <>
      <Card className="overflow-hidden border dark:border-[#2A3F47] dark:bg-[#202F36] transition-all duration-300 hover:shadow-lg">
        <CardHeader className="border-b dark:border-[#2A3F47] bg-zinc-50/50 dark:bg-[#0B4F6C]/20">
          <CardTitle className="text-base flex items-center gap-2">
            <div className="h-2 w-2 rounded-full animate-pulse bg-violet-500" />
            Batch Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">
                Current Status
              </div>
              <StatusBadge status={batch.status} />
            </div>
            <Button
              onClick={handleStatusClick}
              className="gap-2 bg-violet-600 hover:bg-violet-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Icon className="h-4 w-4" />
              {statusLabels[nextStatus]}
            </Button>
          </div>
          {relevantDate && (
            <div className="pt-4 border-t dark:border-[#2A3F47]">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-violet-500" />
                  {relevantDate.label}
                </span>
                <span className="font-medium bg-violet-50 dark:bg-[#0B4F6C]/50 px-3 py-1 rounded-full">
                  {relevantDate.date}
                </span>
              </div>
            </div>
          )}
          {batch.isAutoUpdated && (
            <div className="pt-4 border-t dark:border-[#2A3F47]">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 text-violet-500" />
                <span>Auto-updates enabled</span>
              </div>
            </div>
          )}
          {getRollbackInfo() && (
            <div className="pt-4 border-t dark:border-[#2A3F47]">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <History className="h-4 w-4" />
                    Previous status: {getRollbackInfo().previousStatus}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRollback}
                  disabled={rollbackMutation.isPending}
                  className="gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  {rollbackMutation.isPending
                    ? "Rolling back..."
                    : "Rollback Status"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <ManualOverrideDialog
        batch={batch}
        open={showOverrideDialog}
        onOpenChange={setShowOverrideDialog}
        onConfirm={handleOverrideConfirm}
      />
    </>
  );
};

function AutoUpdateToggle({ batch }) {
  const toggleAutoUpdateMutation = useToggleAutoUpdate();

  const handleToggle = async (enabled) => {
    try {
      await toggleAutoUpdateMutation.mutateAsync({
        courseId: batch.course,
        batchId: batch._id,
        enabled,
      });
      toast.success(
        `Auto-update ${enabled ? "enabled" : "disabled"} successfully`
      );
    } catch (error) {
      toast.error(error.message || "Failed to toggle auto-update");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={batch.isAutoUpdated}
        onCheckedChange={handleToggle}
        disabled={toggleAutoUpdateMutation.isPending}
      />
      <span className="text-sm font-medium dark:text-[#E3E5E5]">
        {toggleAutoUpdateMutation.isPending ? "Updating..." : "Enabled"}
      </span>
    </div>
  );
}

export const useRollbackStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, batchId }) =>
      api.post(`/courses/${courseId}/batches/${batchId}/rollback-status`),
    onSuccess: (data, { courseId, batchId }) => {
      queryClient.invalidateQueries({
        queryKey: batchKeys.detail(courseId, batchId),
      });
      queryClient.invalidateQueries({
        queryKey: batchKeys.list(courseId),
      });
    },
  });
};

export function BatchDetails() {
  const { slug, batchId } = useParams();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const navigate = useNavigate();

  const {
    data: course,
    isLoading: courseLoading,
    error: courseError,
  } = useCourse(slug);

  const {
    data: batch,
    isLoading: batchLoading,
    error: batchError,
  } = useBatch(course?._id, batchId);

  const updateStatusMutation = useUpdateBatchStatus();
  const deleteMutation = useDeleteBatch();

  const handleStatusUpdate = async (newStatus) => {
    try {
      await updateStatusMutation.mutateAsync({
        courseId: course._id,
        batchId: batch._id,
        status: newStatus,
      });
      toast.success(`Batch status updated to ${newStatus}`);
    } catch (error) {
      toast.error(error.message || "Failed to update batch status");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync({
        courseId: course._id,
        batchId: batch._id,
      });
      toast({
        title: "Success",
        description: "Batch deleted successfully",
      });
      navigate(`/dashboard/courses/${slug}/batches`);
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusTransitionButton = () => {
    const transitions = {
      upcoming: {
        next: "enrolling",
        label: "Start Enrollment",
        icon: UserPlus,
      },
      enrolling: {
        next: "ongoing",
        label: "Start Batch",
        icon: Play,
      },
      ongoing: {
        next: "completed",
        label: "Complete Batch",
        icon: CheckCircle,
      },
    };

    const transition = transitions[batch?.status];
    if (!transition) return null;

    return (
      <Button
        onClick={() => handleStatusUpdate(transition.next)}
        className="gap-2"
        disabled={updateStatusMutation.isPending}
      >
        <transition.icon className="h-4 w-4" />
        {transition.label}
      </Button>
    );
  };

  const BatchSchedule = ({ batch }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">Enrollment Period</div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-violet-500" />
            <span>
              {new Date(batch.enrollmentStartDate).toLocaleDateString()} -{" "}
              {new Date(batch.enrollmentEndDate).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">Batch Duration</div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-violet-500" />
            <span>
              {new Date(batch.batchStartDate).toLocaleDateString()} -{" "}
              {new Date(batch.batchEndDate).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const EnrollmentProgress = ({ batch }) => (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Enrollment Progress</span>
        <span>
          {batch.enrollmentCount}/{batch.maxStudents} Students
        </span>
      </div>
      <Progress
        value={(batch.enrollmentCount / batch.maxStudents) * 100}
        className="h-2"
      />
    </div>
  );

  const handleAutoUpdateToggle = async (enabled) => {
    try {
      await batch.toggleAutoUpdate(enabled);
      toast.success(
        `Auto-update ${enabled ? "enabled" : "disabled"} for this batch`
      );
    } catch (error) {
      toast.error("Failed to toggle auto-update");
    }
  };

  const TeachersList = ({ batch }) => {
    const [showAssignDialog, setShowAssignDialog] = useState(false);
    const assignTeachersMutation = useAssignTeachers();

    const handleAssignTeachers = async (selectedTeacherIds) => {
      try {
        await assignTeachersMutation.mutateAsync({
          courseId: course._id,
          batchId: batch._id,
          teacherIds: selectedTeacherIds,
        });
        toast.success("Teachers assigned successfully");
        setShowAssignDialog(false);
      } catch (error) {
        toast.error(error.message || "Failed to assign teachers");
      }
    };

    return (
      <>
        <div className="space-y-4">
          {batch.teachers.length === 0 ? (
            <div className="text-center py-8 px-4 rounded-lg bg-zinc-50/50 dark:bg-[#0B4F6C]/20">
              <Users className="h-12 w-12 text-violet-500/50 mx-auto mb-3" />
              <div className="space-y-1">
                <h3 className="font-medium text-sm">No teachers assigned</h3>
                <p className="text-sm text-muted-foreground">
                  Assign teachers to start the batch
                </p>
              </div>
            </div>
          ) : (
            batch.teachers.map((teacher) => (
              <div
                key={teacher._id}
                className="flex items-center gap-3 p-4 rounded-lg bg-zinc-50/50 dark:bg-[#0B4F6C]/20 hover:bg-zinc-100/50 dark:hover:bg-[#0B4F6C]/30 transition-colors duration-300"
              >
                <div className="p-2 rounded-full bg-violet-100 dark:bg-violet-500/20">
                  <Users className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">
                    {teacher.firstName} {teacher.lastName}
                  </div>
                  <div className="text-sm text-muted-foreground truncate">
                    {teacher.email}
                  </div>
                </div>
              </div>
            ))
          )}
          <Button
            className="w-full gap-2 bg-violet-600 hover:bg-violet-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => setShowAssignDialog(true)}
            disabled={assignTeachersMutation.isPending}
          >
            <UserPlus className="h-4 w-4" />
            {assignTeachersMutation.isPending
              ? "Assigning..."
              : batch.teachers.length === 0
              ? "Assign Teachers"
              : "Manage Teachers"}
          </Button>
        </div>

        <AssignTeachersDialog
          open={showAssignDialog}
          onOpenChange={setShowAssignDialog}
          selectedTeachers={batch.teachers.map((t) => t._id)}
          onAssign={handleAssignTeachers}
        />
      </>
    );
  };

  if (courseLoading || batchLoading) {
    return <BatchDetailsSkeleton />;
  }

  if (courseError || batchError) {
    return (
      <div className="p-4 text-center text-red-500">
        {courseError?.message || batchError?.message || "Error loading data"}
      </div>
    );
  }

  const statusColors = {
    upcoming:
      "text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-[#0B4F6C]/50",
    enrolling:
      "text-violet-600 dark:text-violet-400 bg-violet-50/80 dark:bg-[#0B4F6C]/50",
    ongoing:
      "text-green-600 dark:text-green-400 bg-green-50/80 dark:bg-[#0B4F6C]/50",
    completed:
      "text-zinc-600 dark:text-zinc-400 bg-zinc-100/80 dark:bg-[#0B4F6C]/50",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              to={`/dashboard/courses/${slug}/batches`}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <nav className="flex items-center gap-1 text-muted-foreground">
              <Link to="/dashboard/courses" className="hover:text-foreground">
                Courses
              </Link>
              <ChevronRight className="h-4 w-4" />
              <Link
                to={`/dashboard/courses/${slug}`}
                className="hover:text-foreground"
              >
                {course.title}
              </Link>
              <ChevronRight className="h-4 w-4" />
              <Link
                to={`/dashboard/courses/${slug}/batches`}
                className="hover:text-foreground"
              >
                Batches
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground font-medium">
                Batch #{batch.batchNumber}
              </span>
            </nav>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="gap-2 border-zinc-200 dark:border-[#2A3F47] dark:bg-[#202F36] dark:text-[#E3E5E5] dark:hover:bg-[#0B4F6C]/50"
            onClick={() => setShowEditDialog(true)}
          >
            <Settings className="h-4 w-4" /> Edit Batch
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="col-span-2 space-y-6">
          <Card className="border dark:border-[#2A3F47] dark:bg-[#202F36] dark:shadow-md dark:shadow-black/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="dark:text-[#E3E5E5]">
                    Batch #{batch.batchNumber}
                  </CardTitle>
                  <CardDescription className="dark:text-[#94A3B8]">
                    {batch.name}
                  </CardDescription>
                </div>
                <StatusBadge status={batch.status} />
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3 bg-zinc-100/50 dark:bg-[#0B4F6C]/50 p-1 rounded-lg">
                  <TabsTrigger
                    value="overview"
                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-[#202F36] data-[state=active]:text-violet-600 dark:data-[state=active]:text-violet-400 dark:text-[#94A3B8] dark:data-[state=active]:shadow-md"
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="students"
                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-[#202F36] data-[state=active]:text-violet-600 dark:data-[state=active]:text-violet-400 dark:text-[#94A3B8] dark:data-[state=active]:shadow-md"
                  >
                    Students
                  </TabsTrigger>
                  <TabsTrigger
                    value="settings"
                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-[#202F36] data-[state=active]:text-violet-600 dark:data-[state=active]:text-violet-400 dark:text-[#94A3B8] dark:data-[state=active]:shadow-md"
                  >
                    Settings
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <StatsCard
                      title="Enrolled Students"
                      value={batch.enrollmentCount}
                      icon={Users}
                      description="Current enrollment"
                      progress={
                        (batch.enrollmentCount / batch.maxStudents) * 100
                      }
                      total={batch.maxStudents}
                      status={calculateBatchProgress(batch).status}
                    />
                    <StatsCard
                      title="Course Progress"
                      value={calculateBatchProgress(batch).message}
                      icon={BookOpen}
                      description="completed"
                      progress={calculateBatchProgress(batch).progress}
                      status={calculateBatchProgress(batch).status}
                    />
                  </div>

                  <Card className="border dark:border-[#2A3F47] dark:bg-[#202F36] dark:shadow-md dark:shadow-black/10">
                    <CardHeader>
                      <CardTitle className="text-base dark:text-[#E3E5E5]">
                        Batch Schedule
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <BatchSchedule batch={batch} />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="students">
                  <Card className="border dark:border-[#2A3F47] dark:bg-[#202F36] dark:shadow-md dark:shadow-black/10">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base dark:text-[#E3E5E5]">
                          Enrolled Students
                        </CardTitle>
                        <Button
                          size="sm"
                          className="gap-2 bg-violet-600 hover:bg-violet-700 text-white"
                        >
                          <UserPlus className="h-4 w-4" />
                          Add Student
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <EnrollmentProgress batch={batch} />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="settings">
                  <Card className="border dark:border-[#2A3F47] dark:bg-[#202F36] dark:shadow-md dark:shadow-black/10">
                    <CardHeader>
                      <CardTitle className="text-base dark:text-[#E3E5E5]">
                        Batch Settings
                      </CardTitle>
                      <CardDescription className="dark:text-[#94A3B8]">
                        Configure automatic status updates and other batch
                        settings
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <div className="font-medium dark:text-[#E3E5E5]">
                              Automatic Status Updates
                            </div>
                            <div className="text-sm text-muted-foreground dark:text-[#94A3B8]">
                              Allow the system to automatically update batch
                              status based on dates
                            </div>
                          </div>
                          <AutoUpdateToggle batch={batch} />
                        </div>

                        <div className="text-sm text-muted-foreground dark:text-[#94A3B8] p-4 rounded-lg bg-zinc-50 dark:bg-[#0B4F6C]/20">
                          <div className="flex items-start gap-2">
                            <Info className="h-4 w-4 mt-0.5 text-violet-500" />
                            <div className="space-y-2">
                              <p>When auto-update is enabled:</p>
                              <ul className="list-disc list-inside space-y-1 ml-2">
                                <li>
                                  Batch will automatically move to "enrolling"
                                  on enrollment start date
                                </li>
                                <li>
                                  Batch will automatically start on batch start
                                  date if requirements are met
                                </li>
                                <li>
                                  Batch will automatically complete on batch end
                                  date
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4 pt-6">
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t dark:border-[#2A3F47]" />
                          </div>
                          <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background dark:bg-[#202F36] px-2 text-muted-foreground dark:text-[#94A3B8]">
                              Danger Zone
                            </span>
                          </div>
                        </div>

                        <div className="rounded-lg border border-red-200 dark:border-red-900/50">
                          <div className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium dark:text-red-400">
                                  Delete Batch
                                </h4>
                                <p className="text-sm text-muted-foreground dark:text-[#94A3B8]">
                                  Permanently delete this batch and all its data
                                </p>
                              </div>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setShowDeleteDialog(true)}
                                className="gap-2"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete Batch
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border dark:border-[#2A3F47] dark:bg-[#202F36] dark:shadow-md dark:shadow-black/10">
            <CardHeader>
              <CardTitle className="text-base dark:text-[#E3E5E5]">
                Assigned Teachers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <TeachersList batch={batch} />
            </CardContent>
          </Card>

          <BatchStatusActions
            batch={batch}
            onStatusUpdate={handleStatusUpdate}
          />
        </div>
      </div>

      <EditBatchDialog
        batch={batch}
        courseId={course._id}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              batch and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function BatchDetailsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Content Skeleton */}
        <div className="col-span-2 space-y-6">
          <div className="border rounded-lg p-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <div>
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-6 w-24" />
              </div>
              <Skeleton className="h-[200px] w-full" />
            </div>
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <div className="space-y-6">
          <div className="border rounded-lg p-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
