import { toast } from "react-toastify";

export function showNotificationToast(notification) {
  toast.info(notification.message, {
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
}
