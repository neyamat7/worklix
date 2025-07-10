import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "./useAxiosSecure";

export function useRecordPayment() {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (paymentInfo) => {
      const res = await axiosSecure.post("/payments/record", paymentInfo);
      return res.data;
    },
    onSuccess: (data, variables) => {
      // variables is the paymentInfo you passed in
      Swal.fire("Success", "Payment recorded and coins updated.", "success");

      // Refetch user data to show updated coins
      queryClient.invalidateQueries(["user", variables.user_email]);
    },
    onError: (error) => {
      Swal.fire(
        "Error",
        error?.response?.data?.message || "Failed to record payment.",
        "error"
      );
    },
  });
}
