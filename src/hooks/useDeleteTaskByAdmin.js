import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "./useAxiosSecure";

export const useDeleteTaskByAdmin = () => {
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();

  return useMutation({
    mutationFn: async (taskId) => {
      const res = await axiosSecure.delete(`/admin/${taskId}/delete`);
      return res.data;
    },
    onSuccess: (data) => {
      // ✅ Re-fetch tasks list

      queryClient.invalidateQueries(["allTasks"]);
      console.log("Task deletion success:", data);
    },
    onError: (error) => {
      Swal.fire({
        title: "Error",
        text: "Failed to delete task.",
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error("Error deleting task:", error);
    },
  });
};
