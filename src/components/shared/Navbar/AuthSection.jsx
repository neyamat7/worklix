<div className="hidden md:flex items-center space-x-4">
  {!isLoggedIn ? (
    <>
      <motion.button
        onClick={() => {
          setAuthMode("login");
          setShowAuthModal(true);
        }}
        className="text-gray-300 hover:text-white transition-colors duration-300 font-medium"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Login
      </motion.button>
      <motion.button
        onClick={() => {
          setAuthMode("register");
          setShowAuthModal(true);
        }}
        className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold rounded-full"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Register
      </motion.button>
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
          src={user.avatar || "/placeholder.svg"}
          alt={user.name}
          className="w-full h-full object-cover"
        />
      </motion.button>

      <AnimatePresence>
        {showUserMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            className="absolute right-0 top-12 w-64 glass rounded-2xl p-4 shadow-2xl"
          >
            <div className="flex items-center space-x-3 mb-4">
              <img
                src={user.avatar || "/placeholder.svg"}
                alt={user.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <div className="font-bold text-white">{user.name}</div>
                <div className="text-sm text-gray-400">{user.email}</div>
              </div>
            </div>
            <hr className="border-gray-600 mb-4" />
            <motion.button
              //   onClick={handleLogout}
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
</div>;
