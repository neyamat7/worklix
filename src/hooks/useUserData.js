// hooks/useUserByEmail.js
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

export function useUserData(email) {
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
