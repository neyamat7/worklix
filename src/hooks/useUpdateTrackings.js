// hooks/useUpdateTracking.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

export const useUpdateTrackings = () => {
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();

  return useMutation({
    mutationFn: async ({ tracking_id, status, details, updated_by }) => {
      if (!tracking_id) {
        throw new Error("Tracking ID is required.");
      }

      const response = await axiosSecure.post("/trackings", {
        tracking_id,
        status,
        details,
        updated_by,
      });

      return response.data;
    },
    onSuccess: (data, variables) => {
      // Optionally invalidate the tracking query to refetch
      queryClient.invalidateQueries({
        queryKey: ["tracking", variables.parcelId],
      });

      // You could also invalidate ["parcel"] if you want to refresh parcel status
      queryClient.invalidateQueries({
        queryKey: ["parcel", variables.parcelId],
      });
    },
    onError: (error) => {
      console.error("Failed to update tracking:", error);
    },
  });
};
