import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "./useAxiosSecure";

export const useApproveSubmission = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      submissionId,
      worker_email,
      payable_amount,
      task_id,
    }) => {
      const res = await axiosSecure.patch(
        `/submissions/${submissionId}/approve`,
        {
          worker_email,
          payable_amount,
          task_id,
        }
      );
      return res.data;
    },
    onSuccess: () => {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Submission Approved!",
        html: `
    <div class="text-center">
      <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
        <svg class="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
      <div class="mt-3">
        <h3 class="text-lg font-medium text-gray-900">Approval Successful</h3>
        <div class="mt-2 text-sm text-gray-500">
          <p>The worker will be notified and payment will be processed.</p>
        </div>
      </div>
    </div>
  `,
        showConfirmButton: false,
        timer: 3000,
        background: "#f9fafb",
        width: "28rem",
        customClass: {
          popup: "rounded-lg shadow-xl",
          icon: "!hidden", // Hide default icon since we're using our own
        },
        showClass: {
          popup: "animate__animated animate__fadeInDown",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp",
        },
      });
      queryClient.invalidateQueries(["submissions"]);
      queryClient.invalidateQueries(["pendingSubmissions"]);
      queryClient.invalidateQueries(["users"]);
    },
    onError: (error) => {
      console.error("Approval error:", error);
    },
  });
};
