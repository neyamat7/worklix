// hooks/useUserByEmail.js
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

export function useSingleUserData(email) {
  const axiosSecure = useAxiosSecure();

  return useQuery({
    queryKey: ["user", email],
    queryFn: async () => {
      if (!email) return null;
      const res = await axiosSecure.get("/users/single-user", {
        params: { email },
      });

      return res.data;
    },
    enabled: !!email,
  });
}

export const useAllUsers = () => {
  const axiosSecure = useAxiosSecure();
  // This hook fetches all users
  return useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data; // array of users
    },
  });
};
