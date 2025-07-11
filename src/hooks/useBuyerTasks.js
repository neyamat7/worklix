import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

export const useBuyerTasks = (email) => {
  const axiosSecure = useAxiosSecure();

  return useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/buyer/tasks", {
        params: { email: email },
      });
      return data;
    },
  });
};
