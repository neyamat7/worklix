import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { googleSignIn, registerUser } from "../../features/auth/authSlice";
import useAxiosPublic from "../../hooks/userAxiosPublic";

const RegisterPage = () => {
  const { user, loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();

  // const { createUser, setUser, updateUser, googleSignIn } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    try {
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_image_upload_key
        }`,
        formData
      );

      if (response.data.success) {
        setUploadedUrl(response.data.data.url);
        console.log("Uploaded URL:", response.data.data.url);
      } else {
        console.error("Upload failed:", response.data);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      await registerNewUser(data);
      // reset();
      // Optionally: show success toast
    } catch (error) {
      console.error("Registration error:", error);
      // Optionally: show error toast
    }
  };

  // You will implement this function using Firebase
  // const registerUser = async ({ name, email, password }) => {
  //   // create new user
  //   createUser(email, password).then((res) => {
  //     const user = res.user;
  //     updateUser({ displayName: name, photoURL: uploadedUrl })
  //       .then(async () => {
  //         setUser({ ...user, displayName: name, photoURL: uploadedUrl });

  //         // store user data in database
  //         try {
  //           await axiosPublic.post("/users", {
  //             name,
  //             email,
  //             role: "user",
  //             photoURL: uploadedUrl,
  //           });
  //         } catch (error) {
  //           console.log("failed to update user", error);
  //         }
  //         setUploadedUrl("");
  //         navigate(location?.state || "/");
  //         toast.success("Your account has been created");
  //       })
  //       .catch((error) => {
  //         console.error(error);
  //       });
  //   });
  // };

  const registerNewUser = async ({ name, email, password }) => {
    // create new user
    const resultAction = await dispatch(
      registerUser({ name, email, password, photoURL: uploadedUrl })
    );

    if (registerUser.fulfilled.match(resultAction)) {
      setUploadedUrl("");
      toast.success("Your account has been created!");
      navigate(location?.state || "/");
      reset();
    } else {
      toast.error(resultAction.payload || "Registration failed.");
    }
  };

  // google sign up
  // const handleGoogleRegister = () => {
  //   googleSignIn()
  //     .then(async (res) => {
  //       const user = res.user;
  //       const userInfo = {
  //         email: user?.email,
  //         name: user?.displayName,
  //         role: "user",
  //         photoURL: user?.photoURL,
  //       };

  //       // store user data in database
  //       try {
  //         await axiosPublic.post("/users", userInfo);
  //         navigate(location?.state || "/");
  //         toast.success("Your account has been created");
  //       } catch (error) {
  //         console.log("failed to update user", error);
  //       }
  //     })
  //     .then((err) => {
  //       console.error(err);
  //     });
  // };

  const handleGoogleRegister = async () => {
    const resultAction = await dispatch(googleSignIn());

    if (googleSignIn.fulfilled.match(resultAction)) {
      const user = resultAction.payload;

      const userInfo = {
        email: user?.email,
        name: user?.displayName,
        role: "user",
        photoURL: user?.photoURL,
      };

      try {
        // Save user to backend
        await axiosPublic.post("/users", userInfo);

        toast.success("Your account has been created!");
        navigate(location?.state || "/");
      } catch (err) {
        console.error("Failed to save user to backend:", err);
        toast.error("Failed to save user data.");
      }
    } else {
      // Sign-in failed
      toast.error(resultAction.error.message || "Google login failed.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
          Create an Account
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* image field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("image", { required: "Image is required" })}
              onChange={handleImageChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {errors.image && (
              <p className="mt-1 text-sm text-red-500">
                {errors.image.message}
              </p>
            )}
            {uploading && (
              <p className="mt-1 text-sm text-blue-500">Uploading...</p>
            )}
            {uploadedUrl && (
              <div className="mt-2">
                <img
                  src={uploadedUrl}
                  alt="Uploaded preview"
                  className="h-32 rounded border"
                />
                <p className="text-xs break-all">{uploadedUrl}</p>
              </div>
            )}
          </div>

          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Name
            </label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Email Field */}
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

          {/* Photo URL Field */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Photo URL
            </label>
            <input
              type="text"
              {...register("photoURL")}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            />
          </div> */}

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            />
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
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Already have an account?
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-500 hover:underline transition-colors"
          >
            Sign in here
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
          onClick={handleGoogleRegister}
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

export default RegisterPage;
