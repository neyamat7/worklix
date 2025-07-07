import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  FaSearch,
  FaSpinner,
  FaTimes,
  FaUser,
  FaUserEdit,
  FaUserShield,
} from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

// MakeAdmin Component
const MakeAdmin = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const asixosSecure = useAxiosSecure();

  // Function to fetch users by email search term

  const fetchUsersByEmail = async (email) => {
    if (!email) return []; // Don't fetch if email is empty

    try {
      const { data } = await asixosSecure.get(`/users/search`, {
        params: { email },
      });
      return data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch users");
    }
  };

  // Debounce the search term to avoid excessive API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms debounce time

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // TanStack Query hook to fetch users based on debounced search term
  const {
    data: users,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["users", debouncedSearchTerm],
    queryFn: () => fetchUsersByEmail(debouncedSearchTerm),
    enabled: !!debouncedSearchTerm, // Only run query if debouncedSearchTerm is not empty
    staleTime: 1000 * 60, // Data considered fresh for 1 minute
    keepPreviousData: true, // Keep old data while new data is fetching
  });

  // Mutation for changing user role
  const changeUserRoleMutation = useMutation({
    mutationFn: async ({ userId, role }) => {
      // In a real app, you might need an Authorization header here
      const { data } = await asixosSecure.patch(`/users/${userId}/role`, {
        role,
      });
      return data;
    },
    onSuccess: (data, variables) => {
      console.log(
        `User ${variables.userId} role updated to ${variables.role} successfully.`
      );
      queryClient.invalidateQueries({
        queryKey: ["users", debouncedSearchTerm],
      });
      queryClient.invalidateQueries({
        queryKey: ["userRole"],
      }); // Refetch search results
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: `User role updated to "${variables.role}".`,
        showConfirmButton: false,
        timer: 1500,
      });
    },
    onError: (err) => {
      console.error("Error changing user role:", err);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: `Failed to update user role: ${
          err.response?.data?.message || err.message || "Unknown error"
        }`,
      });
    },
  });

  // Handler to change user role
  const handleChangeRole = (user) => {
    const newRole = user.role === "admin" ? "user" : "admin";
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to change ${user.email}'s role to "${newRole}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: newRole === "admin" ? "#4CAF50" : "#F44336", // Green for admin, Red for user
      cancelButtonColor: "#3085d6",
      confirmButtonText: `Yes, make ${newRole}!`,
    }).then((result) => {
      if (result.isConfirmed) {
        changeUserRoleMutation.mutate({ userId: user._id, role: newRole });
      }
    });
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen font-inter">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 text-center">
        Manage User Roles
      </h1>

      {/* Search Input */}
      <div className="max-w-xl mx-auto mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 flex items-center space-x-3">
        <FaSearch className="text-gray-400 dark:text-gray-500 h-6 w-6" />
        <input
          type="email"
          placeholder="Search user by email..."
          className="flex-grow p-2 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {(isLoading || isFetching) && debouncedSearchTerm && (
          <FaSpinner className="animate-spin text-indigo-500 h-5 w-5" />
        )}
      </div>

      {/* Display Search Results */}
      <div className="max-w-4xl mx-auto">
        {isError && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg flex items-center justify-center space-x-2">
            <FaTimes className="h-5 w-5" />
            <p className="font-semibold">Error: {error.message}</p>
          </div>
        )}

        {/* No Search Term / Initial State */}
        {!debouncedSearchTerm && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center text-gray-600 dark:text-gray-400">
            <FaSearch className="h-12 w-12 mx-auto mb-4" />
            <p className="text-lg font-medium">
              Enter an email to search for users.
            </p>
          </div>
        )}

        {/* Loading State for Search */}
        {(isLoading || isFetching) && debouncedSearchTerm && !users && (
          <div className="flex justify-center items-center h-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <FaSpinner className="animate-spin h-8 w-8 mr-3 text-indigo-500" />
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Searching for users...
            </p>
          </div>
        )}

        {/* No Results Found */}
        {debouncedSearchTerm &&
          !isLoading &&
          !isFetching &&
          users?.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center text-gray-600 dark:text-gray-400">
              <FaTimes className="h-12 w-12 mx-auto mb-4" />
              <p className="text-lg font-medium">
                No users found for "{debouncedSearchTerm}".
              </p>
            </div>
          )}

        {/* Users Table (Desktop View) */}
        {users && users.length > 0 && (
          <div className="hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Role
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Created At
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === "admin"
                            ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {new Date(user.create_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleChangeRole(user)}
                        disabled={changeUserRoleMutation.isLoading}
                        className={`px-4 py-2 rounded-lg shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed
                          ${
                            user.role === "admin"
                              ? "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500"
                              : "bg-indigo-500 text-white hover:bg-indigo-600 focus:ring-indigo-500"
                          }`}
                      >
                        {user.role === "admin" ? (
                          <>
                            <FaUser className="inline-block mr-2" /> Demote to
                            User
                          </>
                        ) : (
                          <>
                            <FaUserShield className="inline-block mr-2" /> Make
                            Admin
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Users Cards (Mobile View) */}
        {users && users.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:hidden">
            {users.map((user) => (
              <div
                key={user._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col space-y-3"
              >
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                  <FaUserEdit className="mr-2 text-indigo-500" /> {user.email}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Role:</strong>{" "}
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === "admin"
                        ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {user.role}
                  </span>
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Created:</strong>{" "}
                  {new Date(user.create_at).toLocaleDateString()}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Last Login:</strong>{" "}
                  {new Date(user.last_log_in).toLocaleDateString()}
                </p>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleChangeRole(user)}
                    disabled={changeUserRoleMutation.isLoading}
                    className={`px-4 py-2 rounded-lg shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed
                      ${
                        user.role === "admin"
                          ? "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500"
                          : "bg-indigo-500 text-white hover:bg-indigo-600 focus:ring-indigo-500"
                      }`}
                  >
                    {user.role === "admin" ? (
                      <>
                        <FaUser className="inline-block mr-2" /> Demote
                      </>
                    ) : (
                      <>
                        <FaUserShield className="inline-block mr-2" /> Make
                        Admin
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MakeAdmin;
