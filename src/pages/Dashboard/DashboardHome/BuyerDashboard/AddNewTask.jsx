import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  FiAlertCircle,
  FiCalendar,
  FiDollarSign,
  FiUpload,
  FiUsers,
} from "react-icons/fi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Loading from "../../../../components/shared/Loading/Loading";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import { useSingleUserData } from "../../../../hooks/useUserData";

const AddNewTask = () => {
  const { user, loading } = useSelector((state) => state.auth);
  const axiosSecure = useAxiosSecure();
  const { data: userData } = useSingleUserData(user?.email);
  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [totalPayable, setTotalPayable] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    clearErrors,
  } = useForm();

  const requiredWorkers = watch("required_workers", 0);
  const payableAmount = watch("payable_amount", 0);

  const createTaskMutation = useMutation({
    mutationFn: async (newTask) => {
      const res = await axiosSecure.post("/buyer/tasks", newTask);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success("Task created successfully!");
      queryClient.invalidateQueries(["user", user?.email]);
      navigate("/dashboard/my-tasks");
    },
    onError: (error) => {
      console.error("Error creating task:", error);
      toast.error("Failed to create task. Please try again.");
    },
  });

  // Calculate total payable amount
  useEffect(() => {
    const calculatedTotal = requiredWorkers * payableAmount;
    setTotalPayable(calculatedTotal);
  }, [requiredWorkers, payableAmount]);

  // Handle image upload to ImgBB
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
        setValue("task_image_url", response.data.data.url);
        clearErrors("task_image_url");
      } else {
        console.error("Upload failed:", response.data);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = (data) => {
    const totalCost = data.required_workers * data.payable_amount;
    console.log(userData?.coins, totalCost);

    // Check coin balance
    if (totalCost > userData?.coins) {
      console.log("Insufficient coins:", userData?.coins, totalCost);
      Swal.fire({
        icon: "error",
        title: "Insufficient Coins",
        html: `
        <div class="text-left">
          <p>You need <strong>${
            totalCost - userData?.coins
          }</strong> more coins to create this task.</p>
          <p class="mt-2">Current balance: <strong>${
            userData?.coins
          } coins</strong></p>
          <p class="mt-2">Total required: <strong>${totalCost} coins</strong></p>
        </div>
      `,
        showCancelButton: true,
        confirmButtonText: "Purchase Coins",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#7e22ce",
        focusConfirm: false,
        scrollbarPadding: false,
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/dashboard/purchase-coins");
        }
      });
      return;
    }

    const newTask = {
      buyer_email: user.email,
      buyer_name: user?.displayName,
      task_title: data.task_title,
      task_detail: data.task_detail,
      required_workers: Number(data.required_workers),
      payable_amount: Number(data.payable_amount),
      completion_date: data.completion_date,
      submission_info: data.submission_info,
      task_image_url: data.task_image_url || "",
    };

    createTaskMutation.mutate(newTask);
  };

  if (loading) return <Loading />;

  return (
    <div
      className="h-full
    bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 p-4 md:p-8"
    >
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 md:p-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-500 to-purple-600 bg-clip-text text-transparent mb-2">
            Create New Task
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Fill out the form below to create a new task for workers
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Task Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Task Title *
              </label>
              <input
                {...register("task_title", {
                  required: "Task title is required",
                })}
                type="text"
                placeholder="e.g. Watch my YouTube video and comment"
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.task_title
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-600 focus:ring-purple-500"
                } focus:outline-none focus:ring-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
              />
              {errors.task_title && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <FiAlertCircle className="mr-1" /> {errors.task_title.message}
                </p>
              )}
            </div>

            {/* Task Details */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Task Details *
              </label>
              <textarea
                {...register("task_detail", {
                  required: "Task details are required",
                })}
                rows={4}
                placeholder="Provide detailed instructions for workers..."
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.task_detail
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-600 focus:ring-purple-500"
                } focus:outline-none focus:ring-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
              />
              {errors.task_detail && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <FiAlertCircle className="mr-1" />{" "}
                  {errors.task_detail.message}
                </p>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Task Image *
              </label>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Task preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FiUpload className="h-8 w-8 text-gray-400" />
                    )}
                    {isUploading && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="cursor-pointer px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center">
                    <FiUpload className="mr-2" />
                    {isUploading ? "Uploading..." : "Upload Image"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Recommended size: 800x400px
                  </p>
                </div>
              </div>
              {/* Hidden input with validation */}
              <input
                type="hidden"
                {...register("task_image_url", {
                  required: "Please upload a task image",
                })}
              />
              {/* Error message display */}
              {errors.task_image_url && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <FiAlertCircle className="mr-1" />{" "}
                  {errors.task_image_url.message}
                </p>
              )}
            </div>

            {/* Worker and Payment Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Required Workers */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Workers Needed *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUsers className="text-gray-400" />
                  </div>
                  <input
                    {...register("required_workers", {
                      required: "Number of workers is required",
                      min: { value: 1, message: "Minimum 1 worker" },
                      valueAsNumber: true,
                    })}
                    type="number"
                    min="1"
                    placeholder="e.g. 100"
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                      errors.required_workers
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 dark:border-gray-600 focus:ring-purple-500"
                    } focus:outline-none focus:ring-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  />
                </div>
                {errors.required_workers && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <FiAlertCircle className="mr-1" />{" "}
                    {errors.required_workers.message}
                  </p>
                )}
              </div>

              {/* Payable Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Pay Per Worker *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiDollarSign className="text-gray-400" />
                  </div>
                  <input
                    {...register("payable_amount", {
                      required: "Payment amount is required",
                      min: { value: 1, message: "Minimum 1 coin" },
                      valueAsNumber: true,
                    })}
                    type="number"
                    min="1"
                    placeholder="e.g. 10"
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                      errors.payable_amount
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 dark:border-gray-600 focus:ring-purple-500"
                    } focus:outline-none focus:ring-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  />
                </div>
                {errors.payable_amount && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <FiAlertCircle className="mr-1" />{" "}
                    {errors.payable_amount.message}
                  </p>
                )}
              </div>
            </div>

            {/* Total Payable */}
            <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-purple-800 dark:text-purple-200">
                  Total Cost
                </span>
                <div>
                  <span className="text-2xl font-bold text-purple-600 dark:text-purple-300">
                    {totalPayable || 0}
                  </span>
                  <span className="ml-1 text-purple-600 dark:text-purple-300">
                    coins
                  </span>
                </div>
              </div>
            </div>

            {/* Completion Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Completion Deadline *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiCalendar className="text-gray-400" />
                </div>
                <input
                  {...register("completion_date", {
                    required: "Deadline is required",
                    validate: (value) => {
                      const selectedDate = new Date(value);
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return (
                        selectedDate >= today || "Date must be in the future"
                      );
                    },
                  })}
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                    errors.completion_date
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 dark:border-gray-600 focus:ring-purple-500"
                  } focus:outline-none focus:ring-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none`} // Added appearance-none
                />
                {/* Additional clickable overlay */}
                <div
                  className="absolute inset-0 cursor-pointer opacity-0"
                  onClick={() =>
                    document.querySelector('input[type="date"]').showPicker()
                  }
                />
              </div>
              {errors.completion_date && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <FiAlertCircle className="mr-1" />{" "}
                  {errors.completion_date.message}
                </p>
              )}
            </div>

            {/* Submission Info */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Submission Requirements *
              </label>
              <textarea
                {...register("submission_info", {
                  required: "Submission info is required",
                })}
                rows={3}
                placeholder="What should workers submit? (e.g. Screenshot, comment link, etc.)"
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.submission_info
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-600 focus:ring-purple-500"
                } focus:outline-none focus:ring-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
              />
              {errors.submission_info && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <FiAlertCircle className="mr-1" />{" "}
                  {errors.submission_info.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={createTaskMutation.isPending}
                className={`w-full py-3 px-6 rounded-lg font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {createTaskMutation.isPending ? "Processing..." : "Add Task"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddNewTask;
