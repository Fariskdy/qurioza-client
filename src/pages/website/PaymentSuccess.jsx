import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { enrollmentKeys } from "@/api/enrollments";

export function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Invalidate queries to refresh enrollment data
    queryClient.invalidateQueries(enrollmentKeys.list());

    // Redirect to dashboard after 3 seconds
    const timer = setTimeout(() => {
      navigate("/dashboard/courses");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-green-600">
          Payment Successful!
        </h1>
        <p>You have successfully enrolled in the course.</p>
        <p className="text-sm text-muted-foreground">
          Redirecting to dashboard...
        </p>
      </div>
    </div>
  );
}
