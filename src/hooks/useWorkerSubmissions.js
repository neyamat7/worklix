import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

export const useWorkerSubmissions = (workerEmail) => {
  const axiosSecure = useAxiosSecure();
  return useQuery({
    queryKey: ["submissions", workerEmail],
    enabled: !!workerEmail, // only run if email exists
    queryFn: async () => {
      const res = await axiosSecure.get(`/submissions/worker-submissions`, {
        params: { worker_email: workerEmail },
      });
      return res.data;
    },
  });
};
