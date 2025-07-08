import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { signOutUser } from "../features/auth/authSlice";

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const useAxiosSecure = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const requestInterceptor = axiosSecure.interceptors.request.use(
      (config) => {
        if (user) {
          config.headers.Authorization = `Bearer ${user.accessToken}`;
        }
        return config;
      }
    );

    // response interceptor to handle errors
    const responseInterceptor = axiosSecure.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.status === 401) {
          // Unauthorized
          dispatch(signOutUser())
            .unwrap()
            .then(() => {
              toast.error(
                "You have been logged out due to unauthorized access. Please log in again."
              );
              navigate("/login");
            })
            .catch((err) => {
              console.error("Error during sign out:", err);
            });
        } else if (error.status === 403) {
          // Forbidden
          navigate("/dashboard/unauthorized");
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [user, dispatch, navigate]);

  return axiosSecure;
};

export default useAxiosSecure;
