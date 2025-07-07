import { useState } from "react";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { googleSignIn, signInUser } from "../../features/auth/authSlice";

const LoginPage = () => {
  const { user, loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  // const { googleSignIn, setLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    try {
      await loginUser(data);
      reset();
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  // by redux
  const loginUser = async ({ email, password }) => {
    try {
      const resultAction = await dispatch(signInUser({ email, password }));

      if (signInUser.fulfilled.match(resultAction)) {
        toast.success("Login successful! Welcome back.");
        navigate(location?.state || "/");
        console.log(resultAction);
      } else {
        // The thunk was rejected
        toast.error(resultAction.error.message);
        console.error("Login error:", resultAction.error);
      }
    } catch (error) {
      // This catch block is rarely triggered unless something crashes badly
      console.error("Unexpected error:", error);
    }
  };

  // by context api
  // const loginUser = async ({ email, password }) => {
  //   dispatch(signInUser({ email, password }));

  //   // signInUser(email, password)
  //   //   .then((res) => {
  //   //     toast.success("Login successful! Welcome back.");
  //   //     navigate(location?.state || "/");
  //   //   })
  //   //   .catch((err) => {
  //   //     setLoading(false);
  //   //     console.error(err.message);
  //   //   });
  // };

  // const handleGoogleLogin = () => {
  //   googleSignIn()
  //     .then((result) => {
  //       toast.success("Login successful! Welcome back.");
  //       navigate(location?.state || "/");
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // };

  //  google sign in by redux

  const handleGoogleLogin = async () => {
    const resultAction = await dispatch(googleSignIn());

    if (googleSignIn.fulfilled.match(resultAction)) {
      // Google sign-in succeeded
      toast.success("Logged in successfully with Google!");
      navigate(location?.state || "/"); // or wherever you want
    } else {
      // Google sign-in failed
      toast.error(resultAction.error.message || "Google login failed.");
      console.error("Google sign-in error:", resultAction.error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
          Log In
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", { required: "Password is required" })}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-700 dark:text-gray-700"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Don't have an account?
          <Link
            to="/register"
            className="font-medium text-blue-600 hover:text-blue-500 hover:underline transition-colors"
          >
            Register here
          </Link>
        </p>

        {/* Divider */}
        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300 dark:border-gray-600" />
          <span className="mx-2 text-gray-500 dark:text-gray-400 text-sm">
            or
          </span>
          <hr className="flex-grow border-gray-300 dark:border-gray-600" />
        </div>

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 dark:border-slate-600 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 transition"
        >
          <FcGoogle size={20} />
          <span className="text-gray-700 dark:text-gray-200 font-medium">
            Continue with Google
          </span>
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
