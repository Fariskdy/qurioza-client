import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateAssignment } from "@/api/assignments/hooks";
import { useTeacherModules } from "@/api/modules/hooks";
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

export function CreateAssignmentDialog({ courseId }) {
  const { batchId } = useParams();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    module: "",
    dueDate: new Date(),
    totalMarks: "",
  });

  const { data: modulesData, isLoading: isLoadingModules } =
    useTeacherModules(courseId);
  const createAssignment = useCreateAssignment();

  const modules = modulesData?.modules || [];

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createAssignment.mutateAsync({
        batchId,
        assignmentData: {
          ...formData,
          totalMarks: parseInt(formData.totalMarks),
        },
      });

      toast.success("Assignment created successfully");
      setOpen(false);
      setFormData({
        title: "",
        description: "",
        module: "",
        dueDate: new Date(),
        totalMarks: "",
      });
    } catch (error) {
      toast.error(error.message || "Failed to create assignment");
    }
  };

  const handleChange = (field) => (value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2" size="lg">
          Create Assignment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Assignment</DialogTitle>
            <DialogDescription>
              Create a new assignment for this batch. Fill in all the required
              fields.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Assignment title"
                value={formData.title}
                onChange={(e) => handleChange("title")(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Assignment description"
                value={formData.description}
                onChange={(e) => handleChange("description")(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="module">Module</Label>
              <Select
                value={formData.module}
                onValueChange={handleChange("module")}
                required
              >
                <SelectTrigger id="module">
                  <SelectValue placeholder="Select module" />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingModules ? (
                    <SelectItem value="" disabled>
                      Loading modules...
                    </SelectItem>
                  ) : modules.length > 0 ? (
                    modules.map((module) => (
                      <SelectItem key={module._id} value={module._id}>
                        {module.title}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>
                      No modules available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Due Date</Label>
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
                <PopoverContent
                  portalled
                  className="relative z-[9999] w-auto p-0 pointer-events-auto"
                  align="start"
                  sideOffset={4}
                >
                  <div className="bg-background dark:bg-[#1a1f2c] rounded-md shadow-lg border dark:border-[#2e354a]/40">
                    <Calendar
                      mode="single"
                      selected={formData.dueDate}
                      onSelect={handleChange("dueDate")}
                      disabled={(date) =>
                        date < new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                      className="dark:bg-[#1a1f2c] dark:text-slate-200"
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="totalMarks">Total Marks</Label>
              <Input
                id="totalMarks"
                type="number"
                min="1"
                placeholder="Enter total marks"
                value={formData.totalMarks}
                onChange={(e) => handleChange("totalMarks")(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createAssignment.isPending}
              className="gap-2"
            >
              {createAssignment.isPending && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              Create Assignment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

CreateAssignmentDialog.propTypes = {
  courseId: PropTypes.string.isRequired,
};
