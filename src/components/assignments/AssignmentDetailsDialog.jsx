import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import PropTypes from "prop-types";
import { useUpdateAssignment } from "@/api/assignments/hooks";

export function AssignmentDetailsDialog({
  assignment,
  open,
  onOpenChange,
  defaultEdit = false,
}) {
  const [isEditing, setIsEditing] = useState(defaultEdit);
  const [formData, setFormData] = useState({
    title: assignment.title,
    description: assignment.description,
    dueDate: new Date(assignment.dueDate),
    totalMarks: assignment.totalMarks,
  });

  const updateAssignment = useUpdateAssignment();

  useEffect(() => {
    if (open) {
      setIsEditing(defaultEdit);
    }
  }, [open, defaultEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateAssignment.mutateAsync({
        batchId: assignment.batch,
        assignmentId: assignment._id,
        assignmentData: {
          ...formData,
          totalMarks: parseInt(formData.totalMarks),
        },
      });

      toast.success("Assignment updated successfully");
      setIsEditing(false);
    } catch (error) {
      toast.error(error.message || "Failed to update assignment");
    }
  };

  const handleChange = (field) => (value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const hasSubmissions = assignment.submissionsCount > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Assignment Details</DialogTitle>
              <div className="flex items-center gap-2">
                <Label htmlFor="editing" className="text-sm">
                  Edit Mode
                </Label>
                <Switch
                  id="editing"
                  checked={isEditing}
                  onCheckedChange={setIsEditing}
                />
              </div>
            </div>
            <DialogDescription>
              {isEditing
                ? "Edit the assignment details below."
                : "View assignment details."}
              {hasSubmissions && isEditing && (
                <p className="mt-2 text-orange-500 dark:text-orange-400">
                  Note: Some fields cannot be edited after submissions exist.
                </p>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              {isEditing ? (
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange("title")(e.target.value)}
                  required
                />
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {assignment.title}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              {isEditing ? (
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange("description")(e.target.value)}
                  required
                />
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                  {assignment.description}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label>Due Date</Label>
              {isEditing && !hasSubmissions ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !formData.dueDate && "text-muted-foreground"
                      )}
                    >
                      {formData.dueDate ? (
                        format(formData.dueDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.dueDate}
                      onSelect={handleChange("dueDate")}
                      disabled={(date) =>
                        date < new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {format(new Date(assignment.dueDate), "PPP")}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="totalMarks">Total Marks</Label>
              {isEditing && !hasSubmissions ? (
                <Input
                  id="totalMarks"
                  type="number"
                  min="1"
                  value={formData.totalMarks}
                  onChange={(e) => handleChange("totalMarks")(e.target.value)}
                  required
                />
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {assignment.totalMarks}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                onOpenChange(false);
              }}
            >
              Close
            </Button>
            {isEditing && (
              <Button
                type="submit"
                disabled={updateAssignment.isPending}
                className="gap-2"
              >
                {updateAssignment.isPending && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Save Changes
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

AssignmentDetailsDialog.propTypes = {
  assignment: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    batch: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    dueDate: PropTypes.string.isRequired,
    totalMarks: PropTypes.number.isRequired,
    submissionsCount: PropTypes.number.isRequired,
  }).isRequired,
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  defaultEdit: PropTypes.bool,
};
