import { useState } from "react";
import { FaBars, FaGithub, FaMoon, FaSun, FaTimes } from "react-icons/fa";

const NavbarTest = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Mock user data
  const user = {
    name: "John Doe",
    email: "john@example.com",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    coins: 120,
  };

  const toggleAuth = () => {
    setIsLoggedIn(!isLoggedIn);
    setProfileDropdownOpen(false);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const navItemsLoggedOut = [
    { name: "Login", action: toggleAuth },
    { name: "Register", action: toggleAuth },
  ];

  const navItemsLoggedIn = [
    { name: "Dashboard", action: () => {} },
    { name: `Coins: ${user.coins}`, action: () => {} },
  ];

  return (
    <nav
      className={`bg-white dark:bg-gray-900 shadow-md ${
        mobileMenuOpen ? "h-auto" : "h-16"
      } md:h-16 transition-all duration-300`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Logo and mobile menu button */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <a
                href="#"
                className="text-xl font-bold text-violet-600 dark:text-violet-400"
              >
                DevConnect
              </a>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-200 hover:text-violet-600 dark:hover:text-violet-400 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Navigation items */}
            <div className="flex space-x-4">
              {isLoggedIn ? (
                <>
                  {navItemsLoggedIn.map((item, index) => (
                    <button
                      key={index}
                      onClick={item.action}
                      className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-violet-100 dark:hover:bg-violet-900 hover:text-violet-600 dark:hover:text-violet-300 transition-colors"
                    >
                      {item.name}
                    </button>
                  ))}
                </>
              ) : (
                <>
                  {navItemsLoggedOut.map((item, index) => (
                    <button
                      key={index}
                      onClick={item.action}
                      className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-violet-100 dark:hover:bg-violet-900 hover:text-violet-600 dark:hover:text-violet-300 transition-colors"
                    >
                      {item.name}
                    </button>
                  ))}
                </>
              )}

              {/* Join as Developer button */}
              <a
                href="https://github.com/your-repository"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 dark:bg-violet-700 dark:hover:bg-violet-600 transition-colors"
              >
                <FaGithub className="mr-2" />
                Join as Developer
              </a>
            </div>

            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-gray-700 dark:text-gray-200 hover:bg-violet-100 dark:hover:bg-violet-900 transition-colors"
            >
              {darkMode ? (
                <FaSun className="h-5 w-5" />
              ) : (
                <FaMoon className="h-5 w-5" />
              )}
            </button>

            {/* User profile (visible when logged in) */}
            {isLoggedIn && (
              <div className="relative ml-4">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center focus:outline-none"
                >
                  <img
                    className="h-8 w-8 rounded-full object-cover"
                    src={user.avatar}
                    alt="User profile"
                  />
                </button>

                {/* Profile dropdown */}
                {profileDropdownOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="py-1 px-4">
                      <div className="py-2 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>
                      <button
                        onClick={toggleAuth}
                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-violet-100 dark:hover:bg-violet-900 rounded mt-2"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2">
              {isLoggedIn ? (
                <>
                  {navItemsLoggedIn.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        item.action();
                        setMobileMenuOpen(false);
                      }}
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-violet-100 dark:hover:bg-violet-900 hover:text-violet-600 dark:hover:text-violet-300"
                    >
                      {item.name}
                    </button>
                  ))}
                </>
              ) : (
                <>
                  {navItemsLoggedOut.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        item.action();
                        setMobileMenuOpen(false);
                      }}
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-violet-100 dark:hover:bg-violet-900 hover:text-violet-600 dark:hover:text-violet-300"
                    >
                      {item.name}
                    </button>
                  ))}
                </>
              )}

              {/* Join as Developer button */}
              <a
                href="https://github.com/your-repository"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-white bg-violet-600 hover:bg-violet-700 dark:bg-violet-700 dark:hover:bg-violet-600"
              >
                <FaGithub className="mr-2" />
                Join as Developer
              </a>

              {/* Dark mode toggle */}
              <button
                onClick={toggleDarkMode}
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-violet-100 dark:hover:bg-violet-900"
              >
                {darkMode ? (
                  <>
                    <FaSun className="mr-2" /> Light Mode
                  </>
                ) : (
                  <>
                    <FaMoon className="mr-2" /> Dark Mode
                  </>
                )}
              </button>

              {/* User profile (visible when logged in) */}
              {isLoggedIn && (
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center px-3 py-2">
                    <img
                      className="h-8 w-8 rounded-full object-cover mr-3"
                      src={user.avatar}
                      alt="User profile"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={toggleAuth}
                    className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-violet-100 dark:hover:bg-violet-900"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavbarTest;
