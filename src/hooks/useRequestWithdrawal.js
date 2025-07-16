import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "./useAxiosSecure";

export const useCreateWithdrawal = () => {
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();

  return useMutation({
    mutationFn: async ({withdrawalData, userId}) => {
      const res = await axiosSecure.post("/withdraw/request", withdrawalData);
      return res.data;
    },
    onSuccess: (data, variables) => {
      Swal.fire(
        "Success!",
        "Withdrawal request submitted successfully.",
        "success"
      );
      // ✅ Optional: refetch any lists if needed
      queryClient.invalidateQueries(["withdrawals"]);
      queryClient.invalidateQueries(["user", variables.userId]);
    },
    onError: (error) => {
      console.error("Withdrawal error:", error);
    },
  });
};
