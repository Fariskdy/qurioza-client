import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useUpdateBatch } from "@/api/batches";
import { toast } from "sonner";

const formSchema = z
  .object({
    name: z
      .string()
      .min(3, "Batch name must be at least 3 characters")
      .max(50, "Batch name cannot exceed 50 characters"),
    enrollmentStartDate: z.date({
      required_error: "Enrollment start date is required",
    }),
    enrollmentEndDate: z.date({
      required_error: "Enrollment end date is required",
    }),
    batchStartDate: z.date({
      required_error: "Batch start date is required",
    }),
    batchEndDate: z.date({
      required_error: "Batch end date is required",
    }),
    maxStudents: z
      .number()
      .min(5, "Minimum 5 students required")
      .max(50, "Maximum 50 students allowed"),
  })
  .refine((data) => data.enrollmentStartDate < data.enrollmentEndDate, {
    message: "Enrollment end date must be after start date",
    path: ["enrollmentEndDate"],
  })
  .refine((data) => data.enrollmentEndDate < data.batchStartDate, {
    message: "Batch must start after enrollment ends",
    path: ["batchStartDate"],
  })
  .refine((data) => data.batchStartDate < data.batchEndDate, {
    message: "Batch end date must be after start date",
    path: ["batchEndDate"],
  });

export default function EditBatchDialog({
  batch,
  courseId,
  open,
  onOpenChange,
}) {
  const updateBatchMutation = useUpdateBatch();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: batch.name,
      enrollmentStartDate: new Date(batch.enrollmentStartDate),
      enrollmentEndDate: new Date(batch.enrollmentEndDate),
      batchStartDate: new Date(batch.batchStartDate),
      batchEndDate: new Date(batch.batchEndDate),
      maxStudents: batch.maxStudents,
    },
  });

  const onSubmit = async (data) => {
    try {
      await updateBatchMutation.mutateAsync({
        courseId,
        batchId: batch._id,
        batchData: {
          ...data,
          // Convert dates to ISO strings for API
          enrollmentStartDate: data.enrollmentStartDate.toISOString(),
          enrollmentEndDate: data.enrollmentEndDate.toISOString(),
          batchStartDate: data.batchStartDate.toISOString(),
          batchEndDate: data.batchEndDate.toISOString(),
        },
      });

      toast.success("Batch updated successfully");
      onOpenChange(false);
    } catch (error) {
      toast.error(error.message || "Failed to update batch");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Batch</DialogTitle>
          <DialogDescription>
            Update batch details and schedule
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Add Name field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Batch Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter batch name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Enrollment Start Date */}
            <FormField
              control={form.control}
              name="enrollmentStartDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enrollment Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
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
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                          className="dark:bg-[#1a1f2c] dark:text-slate-200"
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Enrollment End Date */}
            <FormField
              control={form.control}
              name="enrollmentEndDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enrollment End Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
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
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < form.watch("enrollmentStartDate") ||
                            date < new Date("1900-01-01")
                          }
                          initialFocus
                          className="dark:bg-[#1a1f2c] dark:text-slate-200"
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Batch Start Date */}
            <FormField
              control={form.control}
              name="batchStartDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Batch Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
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
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < form.watch("enrollmentEndDate") ||
                            date < new Date("1900-01-01")
                          }
                          initialFocus
                          className="dark:bg-[#1a1f2c] dark:text-slate-200"
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Batch End Date */}
            <FormField
              control={form.control}
              name="batchEndDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Batch End Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
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
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < form.watch("batchStartDate") ||
                            date < new Date("1900-01-01")
                          }
                          initialFocus
                          className="dark:bg-[#1a1f2c] dark:text-slate-200"
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Max Students */}
            <FormField
              control={form.control}
              name="maxStudents"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Students</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={updateBatchMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateBatchMutation.isPending}>
                {updateBatchMutation.isPending ? "Updating..." : "Update Batch"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
