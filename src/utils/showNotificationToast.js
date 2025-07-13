import { toast } from "react-toastify";

export function showNotificationToast(notification) {
  toast.info(notification.message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
}
