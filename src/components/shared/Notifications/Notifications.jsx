import { useEffect, useRef, useState } from "react";
import { FaBell, FaCheckCircle, FaRegClock, FaTimes } from "react-icons/fa";
import { HiOutlineExclamation } from "react-icons/hi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useNotifications } from "../../../hooks/useNotifications";
import { socket } from "../../../utils/socket";

const NotificationPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const notificationRef = useRef(null);
  const { user } = useSelector((state) => state.auth);

  const { data, isLoading } = useNotifications(user?.email);

  // 2️⃣ Local state to hold notifications
  const [notifications, setNotifications] = useState([]);

  // 3️⃣ Populate state when TanStack loads data
  useEffect(() => {
    if (data) {
      setNotifications(data);
    }
  }, [data]);

  // 4️⃣ Subscribe to socket events
  useEffect(() => {
    if (!user?.email) return;

    // Join a room for this user (optional, but better)
    socket.emit("join", user?.email);

    function handleNewNotification(notification) {
      if (notification.toEmail === user?.email) {
        setNotifications((prev) => [notification, ...prev]);
      }
    }

    socket.on("new-notification", handleNewNotification);

    return () => {
      socket.off("new-notification", handleNewNotification);
    };
  }, [user?.email]);

  const togglePopup = () => setIsOpen(!isOpen);
  const closePopup = () => setIsOpen(false);

  const formatTime = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffHours < 1) {
      const diffMinutes = Math.floor((now - date) / (1000 * 60));
      return `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-16">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div ref={notificationRef} className="relative">
      {/* Notification Bell Icon with Badge */}
      <button
        onClick={togglePopup}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <FaBell className="w-5 h-5 text-gray-600" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-sm font-bold rounded-full min-h-5 min-w-5 flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </button>

      {/* Notification Popup */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="font-semibold text-gray-800">Notifications</h3>
            <button
              onClick={closePopup}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>

          {/* Notification List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <div
                  onClick={() => navigate(notification.actionRoute)}
                  key={index}
                  className={`p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-blue-50`}
                >
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 mt-1 mr-3 text-blue-500`}>
                      {notification.status === "success" ? (
                        <FaCheckCircle className="w-5 h-5" />
                      ) : (
                        <HiOutlineExclamation className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm text-gray-600`}>
                        {notification.message}
                      </p>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <FaRegClock className="mr-1 w-3 h-3" />
                        <span>{formatTime(notification.time)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                <p>No notifications yet</p>
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 text-center bg-gray-50 border-t border-gray-200"></div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationPopup;
