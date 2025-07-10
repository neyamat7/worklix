import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

export default function useUserPayments(email) {
  const axiosSecure = useAxiosSecure();

  return useQuery({
    queryKey: ["payments", email],
    enabled: !!email, // Only fetch if email is defined
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments/records?email=${email}`);
      return res.data;
    },
  });
}
