import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "./useAxiosSecure";

export const useDeleteUser = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId) => {
      const res = await axiosSecure.delete(`/users/${userId}/delete`);
      return res.data;
    },
    onSuccess: () => {
      // sweetAlert success message
      Swal.fire({
        title: "User Deleted",
        text: "The user has been successfully deleted.",
        icon: "success",
        confirmButtonText: "OK",
      });

      // Invalidate users list
      queryClient.invalidateQueries(["allUsers"]);
    },
    onError: (error) => {
      console.error("Delete user error:", error);

      // sweetAlert error message
      Swal.fire({
        title: "Error",
        text: "Failed to delete user.",
        icon: "error",
        confirmButtonText: "OK",
      });
    },
  });
};
