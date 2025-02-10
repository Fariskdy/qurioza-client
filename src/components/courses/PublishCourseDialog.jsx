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
import PropTypes from "prop-types";
import { CheckCircle } from "lucide-react";

function PublishCourseDialog({ course, open, onOpenChange, onConfirm }) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Publish Course
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you ready to publish "{course.title}"? Please ensure you have:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Added all required course content</li>
              <li>Reviewed course information</li>
              <li>Set up proper pricing</li>
              <li>Added preview video and thumbnail</li>
            </ul>
            <p className="mt-2">
              Once published, the course will be visible to students.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Publish Course
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

PublishCourseDialog.propTypes = {
  course: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default PublishCourseDialog;
