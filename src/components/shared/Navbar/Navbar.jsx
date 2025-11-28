import { useEffect, useRef, useState } from "react";
import { FaCoins } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { IoLogOutOutline } from "react-icons/io5";
import { Link } from "react-router";
import Swal from "sweetalert2";
import useAuth from "../../../context/AuthContext";
import { useSingleUserData } from "../../../hooks/useUserData";
import ThemeToggle from "../../ThemeToggle/ThemeToggle";
import Logo from "../Logo/Logo";

const Navbar = () => {
  // const { theme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);
  // const dispatch = useDispatch();

  // get user from redux store
  // const { user, loading } = useSelector((state) => state.auth);
  const { user, signOutUser, loading } = useAuth();

  const { data: userData, isLoading } = useSingleUserData(user?.email);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if ((isLoading, loading)) {
    return (
      <nav className="bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50"></nav>
    );
  }

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure you want to logout?",
      text: "You will need to log in again to access your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        signOutUser();
        setIsProfileDropdownOpen(false);
        setIsMobileMenuOpen(false);
        Swal.fire({
          title: "Logged Out!",
          text: "You have been successfully logged out.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {!user ? (
                <>
                  <Link to="/login">
                    <button className="relative px-4 py-2 rounded-lg font-medium text-sm group overflow-hidden transition-all duration-300 ease-out bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500 shadow-sm hover:shadow-md">
                      <span className="relative z-10 text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                        Login
                      </span>
                    </button>
                  </Link>

                  <Link to="/register">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                      Register
                    </button>
                  </Link>
                  <a
                    href="https://github.com/Programming-Hero-Web-Course4/b11a12-client-side-neyamat7"
                    target="_blank"
                  >
                    <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105">
                      Join as Developer
                    </button>
                  </a>
                </>
              ) : (
                <>
                  <Link
                    to="/dashboard"
                    className="relative overflow-hidden px-5 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 group transition-all duration-300 border border-gray-200 dark:border-gray-600"
                  >
                    {/* Text with gradient color change */}
                    <span className="relative z-10 block transition-all duration-300 group-hover:text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-300">
                      Dashboard
                    </span>

                    {/* Animated background effect */}
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-blue-600/5 dark:from-blue-400/5 dark:to-blue-300/5 rounded-lg transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />

                    {/* Border animation */}
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-300 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700 delay-100" />

                    {/* Shine effect */}
                    <span className="absolute top-0 left-0 w-1/2 h-full bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-[200%] transition-transform duration-700" />
                  </Link>
                  <div className="flex items-center space-x-1 bg-gradient-to-r from-yellow-600 to-orange-500 text-white px-3 py-2 rounded-lg">
                    <FaCoins></FaCoins>
                    <span className="text-sm font-semibold">
                      Coins: {userData?.coins}
                    </span>
                  </div>
                  <a href="https://github.com/neyamat7" target="_blank">
                    <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105">
                      Join as Developer
                    </button>
                  </a>
                  {/* User Profile */}
                  <div className="relative" ref={profileDropdownRef}>
                    <button
                      onClick={() =>
                        setIsProfileDropdownOpen(!isProfileDropdownOpen)
                      }
                      className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
                    >
                      <img
                        src={user.photoURL || "/placeholder.svg"}
                        alt="Profile"
                        className="w-10 h-10 rounded-full border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 transition-colors duration-200 object-cover"
                      />
                    </button>

                    {/* Profile Dropdown */}
                    {isProfileDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-4 px-6 z-50 transform transition-all duration-200 ease-out">
                        <div className="flex items-center space-x-4 mb-4">
                          <img
                            src={user.photoURL || "/placeholder.svg"}
                            alt="Profile"
                            className="w-16 h-16 rounded-full border-2 border-gray-300 dark:border-gray-600"
                          />
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {user.displayName}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {user.email}
                            </p>
                          </div>
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                          <button
                            onClick={handleLogout}
                            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                          >
                            <IoLogOutOutline className="w-5 h-5" />
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Dark Mode Toggle button*/}
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Dark Mode Toggle Mobile */}
            <ThemeToggle />

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-200"
            >
              <svg
                className={`${isMobileMenuOpen ? "hidden" : "block"} h-6 w-6`}
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${isMobileMenuOpen ? "block" : "hidden"} h-6 w-6`}
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Side Navigation */}
      <div className="fixed inset-0 z-50 md:hidden pointer-events-none">
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className={`
    fixed inset-0 bg-black bg-opacity-10 transition-opacity duration-500
    ${isMobileMenuOpen ? "opacity-30 pointer-events-auto" : "opacity-0"}
  `}
        ></div>

        <div
          className={`
    fixed top-0 right-0 h-fit w-80 bg-white dark:bg-gray-900 shadow-xl
    transform transition-transform duration-500 ease-in-out
    ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}
    pointer-events-auto
  `}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Menu
            </h2>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <IoMdClose className="w-6 h-6" />
            </button>
          </div>

          <div className="p-4 space-y-3">
            {!user ? (
              <>
                <Link to="/login">
                  <button className="w-full text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 py-3 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 border bordergray-200 dark:border-gray-700 mb-3 text-center">
                    Login
                  </button>
                </Link>
                <Link to="/register">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 mb-3">
                    Register
                  </button>
                </Link>

                <a
                  href="https://github.com/Programming-Hero-Web-Course4/b11a12-client-side-neyamat7"
                  target="_blank"
                >
                  <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200">
                    Join as Developer
                  </button>
                </a>
              </>
            ) : (
              <>
                {/* User Profile Section */}
                <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <img
                    src={user.photoURL || "/placeholder.svg"}
                    alt="Profile"
                    className="w-12 h-12 rounded-full border-2 border-gray-300 dark:border-gray-600"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {user.displayName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                </div>

                <Link
                  to="/dashboard"
                  className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 py-3 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 border border-gray-300 dark:border-gray-700 text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg">
                  <span className="font-medium">Available Coins</span>
                  <div className="flex items-center space-x-2">
                    <FaCoins className="w-5 h-5" />
                    <span className="font-bold">{userData?.coins}</span>
                  </div>
                </div>

                <a
                  href="https://github.com/Programming-Hero-Web-Course4/b11a12-client-side-neyamat7"
                  target="_blank"
                >
                  <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 mb-3">
                    Join as Developer
                  </button>
                </a>

                <button
                  onClick={handleLogout}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <IoLogOutOutline className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
