import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaCheck, FaEye, FaEyeSlash, FaTimes, FaUpload } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { registerUser } from "../../features/auth/authSlice";
import { validatePassword } from "../../utils/validatePassword";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    setValue,
    reset,
    clearErrors,
    trigger,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      password: "",
    },
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setIsUploading(true);

    try {
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_image_upload_key
        }`,
        formData
      );

      if (response.data.success) {
        setImagePreview(response.data.data.url);
        setValue("profilePicture", response.data.data.url);
        clearErrors("profilePicture");
      } else {
        console.error("Upload failed:", response.data);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const registerNewUser = async ({
    name,
    email,
    password,
    profilePicture,
    role,
  }) => {
    const coins = role === "worker" ? 10 : 50;

    // create new user
    const resultAction = await dispatch(
      registerUser({
        name,
        email,
        password,
        photoURL: profilePicture,
        role,
        coins,
      })
    );

    if (registerUser.fulfilled.match(resultAction)) {
      setImagePreview(null);
      toast.success("Your account has been created!");
      navigate(location?.state || "/dashboard");
      reset();
      // console.log(resultAction);
    } else {
      if (
        resultAction.payload === "Firebase: Error (auth/email-already-in-use)."
      ) {
        setError("email", { message: "Email already exists." });
      }
      toast.error(resultAction.payload || "Registration failed.");
    }
  };

  const onSubmit = async (data) => {
    try {
      await registerNewUser(data);
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  const handleFormSubmit = async () => {
    const passwordInput = document.getElementById("password");
    if (passwordInput) {
      setValue("password", passwordInput.value, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }

    const isValid = await trigger();
    if (!isValid) {
      return;
    }
    handleSubmit(onSubmit)();
  };

  return (
    <div
      className={`container mx-auto min-h-[calc(100vh-64px)] flex flex-col md:flex-row md:items-center justify-center`}
    >
      {/* Left side - Illustration */}
      <div className=" hidden  lg:flex items-center justify-center p-8">
        <div className="max-w-md">
          <img
            src="/sign-up_qamz.svg"
            alt="Registration Illustration"
            className="w-full h-auto"
          />
          <h2 className="text-gray-900 dark:text-gray-200 text-2xl font-bold mt-6 text-center">
            Join Our Community
          </h2>
          <p className="text-gray-900 dark:text-gray-200 opacity-90 mt-2 text-center">
            Start earning by completing simple tasks today.
          </p>
        </div>
      </div>

      {/* Right side - Registration Form */}
      <div className="p-4 md:p-8 flex flex-col justify-center items-center h-fit max-w-lg w-full">
        <div
          className="max-w-lg w-full p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50
        "
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              Create Account
            </h1>
          </div>

          <form className="space-y-6">
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                {...register("name", { required: "Name is required" })}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.name
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-600 focus:ring-purple-500"
                } focus:outline-none focus:ring-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-600 focus:ring-purple-500"
                } focus:outline-none focus:ring-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                placeholder="john@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Profile Picture Upload */}
            <div>
              <label
                htmlFor="profilePicture"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Profile Picture
              </label>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Profile preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <FaUpload className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  {isUploading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="profilePicture"
                    className="cursor-pointer px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center"
                  >
                    <FaUpload className="mr-2" />
                    {isUploading ? "Uploading..." : "Upload Image"}
                  </label>
                  <input
                    id="profilePicture"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>
              <input
                type="hidden"
                {...register("profilePicture", {
                  required: "Profile picture is required",
                })}
              />
              {errors.profilePicture && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.profilePicture.message}
                </p>
              )}
            </div>

            {/* Role Selection */}
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Role
              </label>
              <select
                id="role"
                {...register("role", { required: "Role is required" })}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.role
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-600 focus:ring-purple-500"
                } focus:outline-none focus:ring-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
              >
                <option value="">Select your role</option>
                <option value="worker">Worker</option>
                <option value="buyer">Buyer</option>
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.role.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                    validate: (value) => {
                      const strength = validatePassword(value);
                      return strength >= 3 || "Password is not strong enough.";
                    },
                  })}
                  onChange={(e) => {
                    setPasswordStrength(validatePassword(e.target.value));
                    setPasswordValue(e.target.value);
                    clearErrors("password");
                  }}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.password
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 dark:border-gray-600 focus:ring-purple-500"
                  } focus:outline-none focus:ring-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.password.message}
                </p>
              )}

              {/* Password Strength Meter */}
              <div className="mt-2">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        passwordStrength === 0
                          ? "bg-red-500"
                          : passwordStrength === 1
                          ? "bg-yellow-500"
                          : passwordStrength === 2
                          ? "bg-blue-500"
                          : passwordStrength >= 3
                          ? "bg-green-500"
                          : ""
                      }`}
                      style={{
                        width: `${(passwordStrength / 4) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {passwordStrength === 0
                      ? "Weak"
                      : passwordStrength === 1
                      ? "Fair"
                      : passwordStrength === 2
                      ? "Good"
                      : passwordStrength === 3
                      ? "Strong"
                      : "Very Strong"}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    {passwordValue.length >= 6 ? (
                      <FaCheck className="text-green-500 mr-1" />
                    ) : (
                      <FaTimes className="text-red-500 mr-1" />
                    )}
                    <span>6+ chars</span>
                  </div>
                  <div className="flex items-center">
                    {/[A-Z]/.test(passwordValue) ? (
                      <FaCheck className="text-green-500 mr-1" />
                    ) : (
                      <FaTimes className="text-red-500 mr-1" />
                    )}
                    <span>Uppercase</span>
                  </div>
                  <div className="flex items-center">
                    {/[0-9]/.test(passwordValue) ? (
                      <FaCheck className="text-green-500 mr-1" />
                    ) : (
                      <FaTimes className="text-red-500 mr-1" />
                    )}
                    <span>Number</span>
                  </div>
                  <div className="flex items-center">
                    {/[^A-Za-z0-9]/.test(passwordValue) ? (
                      <FaCheck className="text-green-500 mr-1" />
                    ) : (
                      <FaTimes className="text-red-500 mr-1" />
                    )}
                    <span>Special</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleFormSubmit}
              type="button"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-4 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              {isSubmitting ? "Creating... " : "Create Account"}
            </button>

            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-purple-600 dark:text-purple-400 hover:underline"
              >
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
