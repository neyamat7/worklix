import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./userAxiosPublic";

export const useTopWorkers = (limit = 6) => {
  const axiosPublic = useAxiosPublic();

  return useQuery({
    queryKey: ["topWorkers", limit],
    queryFn: async () => {
      const res = await axiosPublic.get("/public/top-workers", {
        params: { limit },
      });
      return res.data; // array of workers
    },
  });
};
