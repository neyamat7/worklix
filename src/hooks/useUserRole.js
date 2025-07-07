// hooks/useUserRole.js
import { useQuery } from "@tanstack/react-query";
import useAuth from "../context/AuthContext";
import useAxiosSecure from "./useAxiosSecure";

export function useUserRole() {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  //   console.log(user);
  const { data: role, isLoading: roleLoading } = useQuery({
    queryKey: ["userRole", user?.email],
    queryFn: async () => {
      if (!user?.email) throw new Error("Email is required");
      const { data } = await axiosSecure.get(
        `/users/role?email=${encodeURIComponent(user?.email)}`
      );
      //   console.log(data.role);

      return data.role; // { role: "user" }
    },
    enabled: !!user?.email, // only run when email is truthy
  });

  return { role, roleLoading };
}
