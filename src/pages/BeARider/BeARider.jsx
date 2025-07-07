import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import useAuth from "../../context/AuthContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useServiceCenters } from "../SendParcel/queries";

const BeARider = () => {
  const { user } = useAuth();
  const { data: centers = [] } = useServiceCenters();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.displayName || "",
      email: user?.email || "",
    },
  });

  const selectedRegion = watch("region");

  const filteredRiderCenters = centers.filter(
    (c) => c.region === selectedRegion
  );

  const { mutate: createNewRider, isLoading } = useMutation({
    mutationFn: async (data) => {
      const newRider = {
        ...data,
        role: "rider",
        status: "pending",
      };
      const res = await axiosSecure.post("/riders", newRider);
      return res.data;
    },
    onSuccess: async (data) => {
      if (data.insertedId) {
        toast.success("Rider created successfully!");
        reset();
      } else {
        toast.success(data.message || "Rider processed.");
      }

      await queryClient.refetchQueries({
        queryKey: ["riders"],
      });
    },
    onError: (error) => {
      console.error("Error:", error);
      toast.error("Failed to create rider.");
    },
  });

  const submitRider = async (riderData) => {
    // try {
    //   // Create a new object with role included
    //   const newRiders = {
    //     ...riderData,
    //     role: "rider",
    //   };

    //   const response = await axiosSecure.post("/riders", newRiders);

    //   if (response.data.insertedId) {
    //     console.log("Rider created:", response.data);
    //     toast.success("Rider created successfully!");
    //   }
    // } catch (error) {
    //   console.error("Error creating rider:", error);
    //   toast.error("Failed to create rider. Please try again.");
    // }
    createNewRider(riderData);
  };
  return (
    <div className="max-w-2xl mx-auto p-6 my-32 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-indigo-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        Become a Rider
      </h2>

      <form onSubmit={handleSubmit(submitRider)} className="space-y-4">
        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              readOnly
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-not-allowed"
              {...register("name")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              readOnly
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-not-allowed"
              {...register("email")}
            />
          </div>
        </div>

        {/* Rider Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              NID Number*
            </label>
            <input
              type="text"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-600 dark:focus:border-indigo-600 ${
                errors.nid
                  ? "border-red-500 dark:border-red-400"
                  : "border-gray-300 dark:border-gray-600"
              } bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300`}
              placeholder="Enter your NID number"
              {...register("nid", { required: "NID number is required" })}
            />
            {errors.nid && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.nid.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone Number*
            </label>
            <input
              type="tel"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-600 dark:focus:border-indigo-600 ${
                errors.phone
                  ? "border-red-500 dark:border-red-400"
                  : "border-gray-300 dark:border-gray-600"
              } bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300`}
              placeholder="Enter your phone number"
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  //   value: /^[0-9]{11}$/,
                  message: "Invalid phone number",
                },
              })}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>

        {/* Bike Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Bike Registration No*
            </label>
            <input
              type="text"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-600 dark:focus:border-indigo-600 ${
                errors.bikeReg
                  ? "border-red-500 dark:border-red-400"
                  : "border-gray-300 dark:border-gray-600"
              } bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300`}
              placeholder="Enter bike registration number"
              {...register("bikeReg", {
                required: "Bike registration is required",
              })}
            />
            {errors.bikeReg && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.bikeReg.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Bike Engine CC*
            </label>
            <select
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-600 dark:focus:border-indigo-600 ${
                errors.bikeCC
                  ? "border-red-500 dark:border-red-400"
                  : "border-gray-300 dark:border-gray-600"
              } bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300`}
              {...register("bikeCC", { required: "Bike CC is required" })}
            >
              <option value="">Select engine CC</option>
              <option value="80-110">80-110 CC</option>
              <option value="111-150">111-150 CC</option>
              <option value="151-200">151-200 CC</option>
              <option value="200+">200+ CC</option>
            </select>
            {errors.bikeCC && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.bikeCC.message}
              </p>
            )}
          </div>
        </div>

        {/* Location Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Region*
            </label>
            <select
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-600 dark:focus:border-indigo-600 ${
                errors.region
                  ? "border-red-500 dark:border-red-400"
                  : "border-gray-300 dark:border-gray-600"
              } bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300`}
              {...register("region", { required: "Region is required" })}
            >
              <option value="">Select region</option>
              {[...new Set(centers.map((c) => c.region))].map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
            {errors.region && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.region.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              District*
            </label>
            <select
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-600 dark:focus:border-indigo-600 ${
                errors.district
                  ? "border-red-500 dark:border-red-400"
                  : "border-gray-300 dark:border-gray-600"
              } bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300`}
              disabled={!selectedRegion}
              {...register("district", { required: "District is required" })}
            >
              <option value="">
                {selectedRegion ? "Select district" : "Select region first"}
              </option>
              {filteredRiderCenters.map((c) => (
                <option key={c.city} value={c.city}>
                  {c.city}
                </option>
              ))}
            </select>
            {errors.district && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.district.message}
              </p>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Address*
          </label>
          <textarea
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-600 dark:focus:border-indigo-600 ${
              errors.address
                ? "border-red-500 dark:border-red-400"
                : "border-gray-300 dark:border-gray-600"
            } bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300`}
            rows={3}
            placeholder="Enter your full address"
            {...register("address", { required: "Address is required" })}
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.address.message}
            </p>
          )}
        </div>

        {/* Terms and Conditions */}
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              type="checkbox"
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:border-gray-600"
              {...register("terms", { required: "You must accept the terms" })}
            />
          </div>
          <div className="ml-3 text-sm">
            <label className="font-medium text-gray-700 dark:text-gray-300">
              I agree to the{" "}
              <a
                href="#"
                className="text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Terms and Conditions
              </a>
            </label>
            {errors.terms && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.terms.message}
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          {isLoading ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
};

export default BeARider;
