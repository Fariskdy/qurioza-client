import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

export function PaymentCancel() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const courseSlug = searchParams.get("course");

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6 p-8 max-w-md mx-auto">
        <div className="flex justify-center">
          <XCircle className="h-16 w-16 text-red-500" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Payment Cancelled
        </h1>
        <p className="text-gray-600">
          Your payment was cancelled. No charges were made to your account.
        </p>
        <div className="space-y-4">
          <Button
            onClick={() => navigate(`/courses/${courseSlug}`)}
            variant="default"
            className="w-full"
          >
            Return to Course
          </Button>
          <Button
            onClick={() => navigate("/courses")}
            variant="outline"
            className="w-full"
          >
            Browse Other Courses
          </Button>
        </div>
      </div>
    </div>
  );
} 