import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "./useAxiosSecure";

export const useApproveWithdrawal = () => {
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();

  return useMutation({
    mutationFn: async ({ withdrawalId, withdrawal_amount, worker_email }) => {
      const res = await axiosSecure.patch(`/withdraw/${withdrawalId}/approve`, {
        withdrawal_amount,
        worker_email,
      });
      return res.data;
    },
    onSuccess: () => {
      Swal.fire({
        title: "Withdrawal Approved",
        text: "The withdrawal request has been successfully approved.",
        icon: "success",
        confirmButtonText: "OK",
      });

      // ✅ Refetch the pending withdrawals
      queryClient.invalidateQueries(["pendingWithdrawals"]);
    },
    onError: (error) => {
      console.error("Error approving withdrawal:", error);
    },
  });
};
