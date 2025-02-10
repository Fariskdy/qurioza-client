import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, CheckCircle2, X, Users2, Mail, Phone } from "lucide-react";
import { useTeachers } from "@/api/teachers";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function AssignTeachersDialog({
  open,
  onOpenChange,
  selectedTeachers = [],
  onAssign,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState(new Set(selectedTeachers));
  const { data: teachers, isLoading } = useTeachers();

  console.log("teachers", teachers);

  useEffect(() => {
    console.log("Received teachers data:", teachers);
    setSelected(new Set(selectedTeachers));
  }, [selectedTeachers]);

  const filteredTeachers = teachers?.filter((teacher) => {
    const query = searchQuery.toLowerCase();
    return (
      teacher.username?.toLowerCase().includes(query) ||
      teacher.email?.toLowerCase().includes(query) ||
      teacher.firstName?.toLowerCase().includes(query) ||
      teacher.lastName?.toLowerCase().includes(query)
    );
  });

  const handleTeacherToggle = (teacherId) => {
    console.log("Toggling teacher ID:", teacherId);
    const newSelected = new Set(selected);
    if (newSelected.has(teacherId)) {
      newSelected.delete(teacherId);
    } else {
      newSelected.add(teacherId);
    }
    setSelected(newSelected);
  };

  const handleAssign = () => {
    console.log("Selected teacher IDs:", Array.from(selected));
    onAssign(Array.from(selected));
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] dark:bg-[#202F36] dark:border-[#2A3F47]">
        <DialogHeader className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-500/20">
              <Users2 className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <DialogTitle className="text-xl text-foreground dark:text-[#E3E5E5]">
                Assign Teachers
              </DialogTitle>
              <DialogDescription className="text-muted-foreground dark:text-[#8B949E]">
                Select teachers to assign to this batch
              </DialogDescription>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Badge
              variant="secondary"
              className="bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400"
            >
              {selected.size} Selected
            </Badge>
            {selected.size > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelected(new Set())}
                className="h-8 px-2 text-sm text-muted-foreground hover:text-foreground"
              >
                Clear selection
              </Button>
            )}
          </div>
        </DialogHeader>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search teachers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-9 bg-background/50 dark:bg-[#131F24]/50 dark:text-[#E3E5E5] dark:placeholder:text-[#8B949E] dark:border-[#2A3F47]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-accent rounded-full"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Teachers List */}
        <ScrollArea className="h-[300px] pr-4 -mr-4">
          <div className="space-y-2">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground space-y-2">
                <Users2 className="h-8 w-8 animate-pulse" />
                <p>Loading teachers...</p>
              </div>
            ) : filteredTeachers?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground space-y-2">
                <Users2 className="h-8 w-8 opacity-50" />
                <p>No teachers found</p>
              </div>
            ) : (
              filteredTeachers?.map((teacher) => (
                <div
                  key={teacher._id}
                  onClick={() => handleTeacherToggle(teacher._id)}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200",
                    "hover:bg-accent/50 dark:hover:bg-[#131F24] hover:shadow-md",
                    selected.has(teacher._id) &&
                      "bg-violet-50 dark:bg-violet-500/10 ring-1 ring-violet-500/20"
                  )}
                >
                  <Avatar className="h-10 w-10 ring-2 ring-violet-500/10 dark:ring-violet-500/20">
                    <AvatarFallback className="bg-gradient-to-br from-violet-500 to-violet-600 text-white font-medium">
                      {teacher.firstName?.[0]}
                      {teacher.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground dark:text-[#E3E5E5]">
                      {teacher.firstName} {teacher.lastName}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        <span className="truncate">{teacher.email}</span>
                      </div>
                      {teacher.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          <span>{teacher.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div
                    className={cn(
                      "h-5 w-5 rounded-full border-2 transition-colors duration-200",
                      selected.has(teacher._id)
                        ? "border-violet-500 bg-violet-500 dark:border-violet-400 dark:bg-violet-400"
                        : "border-muted"
                    )}
                  >
                    {selected.has(teacher._id) && (
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="dark:bg-[#131F24] dark:text-[#E3E5E5] dark:hover:bg-[#1B2B34] dark:border-[#2A3F47]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            disabled={selected.size === 0}
            className={cn(
              "transition-all duration-200",
              "bg-violet-600 hover:bg-violet-700 text-white",
              "dark:bg-gradient-to-r dark:from-violet-600 dark:to-violet-500",
              "dark:hover:from-violet-700 dark:hover:to-violet-600",
              "shadow-lg hover:shadow-xl",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
            )}
          >
            Assign {selected.size} Teacher{selected.size !== 1 ? "s" : ""}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
