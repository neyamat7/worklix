import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

export const useHasSubmitted = (worker_email, task_id) => {
  const axiosSecure = useAxiosSecure();

  return useQuery({
    queryKey: ["submissionCheck", worker_email, task_id],
    enabled: !!worker_email && !!task_id,
    queryFn: async () => {
      const res = await axiosSecure.get(`/submissions/check-submission`, {
        params: {
          worker_email,
          task_id,
        },
      });
      return res.data;
    },
  });
};
