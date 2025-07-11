import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

export const useUpdateUserRole = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, newRole }) => {
      const res = await axiosSecure.patch(`/users/${userId}/role`, {
        role: newRole,
      });
      return res.data;
    },
    // ✅ Optimistic update
    onMutate: async ({ userId, newRole }) => {
      // Cancel any outgoing refetches so they don't overwrite optimistic update
      await queryClient.cancelQueries(["allUsers"]);

      // Snapshot previous value
      const previousUsers = queryClient.getQueryData(["allUsers"]);

      // Optimistically update to the new role
      queryClient.setQueryData(["allUsers"], (old) =>
        old.map((user) =>
          user._id === userId ? { ...user, role: newRole } : user
        )
      );

      // Return context so we can roll back on error
      return { previousUsers };
    },
    onError: (err, variables, context) => {
      // Roll back to previous data
      queryClient.setQueryData(["allUsers"], context.previousUsers);
    },
    onSettled: () => {
      // Always refetch after mutation (to get fresh backend state)
      queryClient.invalidateQueries(["allUsers"]);
    },
  });
};
