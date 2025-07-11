import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "./useAxiosSecure";

export const useRejectSubmission = () => {
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();

  return useMutation({
    mutationFn: async ({ submissionId, task_id }) => {
      const res = await axiosSecure.patch(
        `/submissions/${submissionId}/reject`,
        { task_id }
      );
      return res.data;
    },
    onSuccess: () => {
      // Success notification after rejection
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Submission Rejected",
        html: `
        <div class="text-center">
          <p class="text-gray-700">The worker has been notified.</p>
        </div>
      `,
        timer: 2000,
        showConfirmButton: false,
        background: "#f9fafb",
        width: "24rem",
      });
      queryClient.invalidateQueries(["submissions"]);
      queryClient.invalidateQueries(["pendingSubmissions"]);
      queryClient.invalidateQueries(["tasks"]);
    },
    onError: (error) => {
      console.error("Rejection error:", error);
    },
  });
};
