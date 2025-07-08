import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router";
import { slideInFromTop } from "../../../animations/motion";
import ThemeToggle from "../../ThemeToggle/ThemeToggle";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [showUserMenu, setShowUserMenu] = useState(false);

  const { user, signOutUser } = useState(false);
  // console.log(user);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { id: 1, label: "Home", link: "/" },
    { id: 2, label: "Services", link: "/services" },
    { id: 6, label: "Dashboard", link: "/dashboard" },
  ];

  return (
    <>
      <motion.nav
        initial="hidden"
        animate="visible"
        variants={slideInFromTop}
        className={`sticky top-0 w-full z-50 transition-all duration-500 ${
          scrolled ? "glass backdrop-blur-xl shadow-2xl" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 rounded-2xl flex items-center justify-center glow-red">
                  <span className="text-white font-bold text-xl">🚚</span>
                </div>
              </div>
              <span className="text-3xl font-black gradient-text">
                ParcelPilot
              </span>
            </motion.div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <ThemeToggle />
              {navLinks.map((item, index) => (
                <NavLink
                  key={item.id}
                  to={item.link}
                  className="text-gray-300 dark:text-red-500 hover:text-red-400 transition-all duration-300 font-medium relative group"
                >
                  {item?.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-400 to-pink-500 group-hover:w-full transition-all duration-300"></span>
                </NavLink>
              ))}
            </div>

            {/* Auth Section */}
            <div className="hidden md:flex items-center space-x-4">
              {!user ? (
                <>
                  <Link to="/login">
                    <motion.button
                      className="text-gray-300 hover:text-white transition-colors duration-300 font-medium"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Login
                    </motion.button>
                  </Link>

                  <Link to="/register">
                    <motion.button
                      className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold rounded-full"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Register
                    </motion.button>
                  </Link>
                </>
              ) : (
                <div className="relative">
                  <motion.button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="w-10 h-10 rounded-full overflow-hidden border-2 border-red-400 glow-red"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img
                      src={user?.photoURL || "/placeholder.svg"}
                      alt={user?.displayName}
                      className="w-full h-full object-cover"
                    />
                  </motion.button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: -10 }}
                        className="absolute right-0 top-12 w-64 bg-white rounded-2xl p-4 shadow-2xl"
                      >
                        <div className="flex items-center space-x-3 mb-4">
                          <img
                            src={user?.photoURL || "/placeholder.svg"}
                            alt={user?.displayName}
                            className="w-12 h-12 rounded-full"
                          />
                          <div>
                            <div className="font-bold text-black">
                              {user?.displayName}
                            </div>
                            <div className="text-sm text-gray-400">
                              {user?.email}
                            </div>
                          </div>
                        </div>
                        <hr className="border-gray-600 mb-4" />
                        <motion.button
                          onClick={() => signOutUser()}
                          className="w-full text-left px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors duration-300"
                          whileHover={{ x: 5 }}
                        >
                          Logout
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-white"
              onClick={() => setIsOpen(!isOpen)}
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span
                  className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
                    isOpen ? "rotate-45 translate-y-1" : ""
                  }`}
                ></span>
                <span
                  className={`block w-6 h-0.5 bg-white mt-1 transition-all duration-300 ${
                    isOpen ? "opacity-0" : ""
                  }`}
                ></span>
                <span
                  className={`block w-6 h-0.5 bg-white mt-1 transition-all duration-300 ${
                    isOpen ? "-rotate-45 -translate-y-1" : ""
                  }`}
                ></span>
              </div>
            </button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden"
              >
                <div className="px-2 pt-2 pb-3 space-y-1 glass rounded-2xl mt-2">
                  {[
                    "Home",
                    "Services",
                    "Tracking",
                    "Pricing",
                    "About",
                    "Contact",
                  ].map((item) => (
                    <a
                      key={item}
                      href={`#${item.toLowerCase()}`}
                      className="block px-3 py-2 text-gray-300 hover:text-red-400 transition-colors duration-300"
                      onClick={() => setIsOpen(false)}
                    >
                      {item}
                    </a>
                  ))}
                  {!user ? (
                    <div className="pt-4 space-y-2">
                      <button className="w-full text-left px-3 py-2 text-gray-300 hover:text-white">
                        Login
                      </button>
                      <button className="w-full px-3 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold rounded-full">
                        Register
                      </button>
                    </div>
                  ) : (
                    <div className="pt-4">
                      <div className="flex items-center space-x-3 px-3 py-2">
                        <img
                          src={user.avatar || "/placeholder.svg"}
                          alt={user.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="text-white">{user.name}</span>
                      </div>
                      <button className="w-full text-left px-3 py-2 text-red-400">
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* Auth Modal */}
      {/* <AnimatePresence>
        {showAuthModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAuthModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="glass rounded-3xl p-8 w-full max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-3xl font-bold gradient-text mb-6 text-center">
                {authMode === "login" ? "Welcome Back" : "Join SwiftFlow"}
              </h2>

              <form className="space-y-4">
                {authMode === "register" && (
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full px-4 py-3 glass-dark rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400"
                  />
                )}
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-3 glass-dark rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full px-4 py-3 glass-dark rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400"
                />

                <motion.button
                  type="button"
                  onClick={handleLogin}
                  className="w-full py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold rounded-xl"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {authMode === "login" ? "Sign In" : "Create Account"}
                </motion.button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() =>
                    setAuthMode(authMode === "login" ? "register" : "login")
                  }
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                >
                  {authMode === "login"
                    ? "Don't have an account? Sign up"
                    : "Already have an account? Sign in"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence> */}
    </>
  );
};

export default Navbar;
