import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

export const useNotifications = (email) => {
  const axiosSecure = useAxiosSecure();
  return useQuery({
    queryKey: ["notifications", email],
    queryFn: async () => {
      if (!email) return []; // Safety check if email is undefined
      const res = await axiosSecure.get("/notifications", {
        params: { email },
      });
      return res.data; // returns array of notifications
    },
    enabled: !!email, // Only run query if email is defined
  });
};
