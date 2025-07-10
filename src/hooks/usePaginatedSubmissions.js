import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

export const usePaginatedSubmissions = (worker_email, page) => {
  const axiosSecure = useAxiosSecure();
  return useQuery({
    queryKey: ["submissions", worker_email, page],
    enabled: !!worker_email && !!page,
    queryFn: async () => {
      const res = await axiosSecure.get("/submissions", {
        params: { worker_email, page },
      });
      return res.data;
    },
    keepPreviousData: true,
  });
};
