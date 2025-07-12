import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

export const usePendingWithdrawals = () => {
  const axiosSecure = useAxiosSecure();

  return useQuery({
    queryKey: ["pendingWithdrawals"],
    queryFn: async () => {
      const res = await axiosSecure.get("/withdraw/pending-withdrawals");
      return res.data; // array of withdrawals
    },
  });
};
