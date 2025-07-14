import { useQuery } from "@tanstack/react-query";

import useAxiosPublic from "./userAxiosPublic";

export const useRecentTasks = (limit = 6) => {
  const axiosPublic = useAxiosPublic();

  return useQuery({
    queryKey: ["recentTasks", limit],
    queryFn: async () => {
      const res = await axiosPublic.get("/public/recently-added-tasks", {
        params: { limit },
      });
      return res.data; // array of tasks
    },
  });
};
