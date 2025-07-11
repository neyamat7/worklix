import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

export const usePendingSubmissions = (buyer_email) => {
  const axiosSecure = useAxiosSecure();

  return useQuery({
    queryKey: ["pendingSubmissions", buyer_email],
    enabled: !!buyer_email, // only fetch if buyer_email is provided
    queryFn: async () => {
      const res = await axiosSecure.get("/submissions/pending-submissions", {
        params: { buyer_email },
      });
      return res.data; // array of submissions
    },
  });
};
