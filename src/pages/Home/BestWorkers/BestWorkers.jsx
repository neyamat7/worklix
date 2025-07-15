import { motion } from "framer-motion";
import { FiAward } from "react-icons/fi";
import Loading from "../../../components/shared/Loading/Loading";
import { useTopWorkers } from "../../../hooks/useTopWorkers";

export default function BestWorkers() {
  const { data: workers, isLoading, error } = useTopWorkers(6);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const progress = 70 + (workers.coins % 26);
  console.log(workers);
  console.log(progress);

  return (
    <section
      id="best-workers"
      className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 50,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-purple-200/30 to-blue-200/30 dark:from-purple-800/20 dark:to-blue-800/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            rotate: [360, 0],
          }}
          transition={{
            duration: 40,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-pink-200/30 to-purple-200/30 dark:from-pink-800/20 dark:to-purple-800/20 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 px-6 py-3 rounded-full mb-6"
          >
            <FiAward className="text-purple-600 dark:text-purple-400" />
            <span className="text-purple-800 dark:text-purple-300 font-medium">
              Top Performers
            </span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Meet Our
            <span className="block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Best Workers
            </span>
          </h2>

          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Discover the talented individuals who consistently deliver
            exceptional results and earn the highest rewards on our platform.
          </p>
        </motion.div>

        {/* Workers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {workers.map((worker, index) => {
            const progress = 70 + (worker.coins % 26);
            return (
              <motion.div
                key={worker._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{
                  y: -10,
                  scale: 1.02,
                  transition: {
                    y: { duration: 0.2, delay: 0 }, // No delay on hover y
                    scale: { duration: 0.2 },
                  },
                }}
                transition={{
                  opacity: { duration: 0.6, delay: index * 0.1 },
                  y: { duration: 0.6, delay: index * 0.1 },
                }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
                  {/* Worker Photo */}
                  <div className="relative mb-6">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                      className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-gradient-to-r from-purple-400 to-blue-400 p-1"
                    >
                      <img
                        src={worker?.photoURL || "/placeholder.svg"}
                        alt={worker?.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </motion.div>

                    {/* Online Status */}
                    <div className="absolute bottom-0 right-1/2 transform translate-x-8 translate-y-1">
                      <div className="w-6 h-6 bg-green-500 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>

                  {/* Worker Info */}
                  <div className="text-center space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {worker.name}
                    </h3>

                    {/* Stats */}
                    <div className="space-y-3">
                      {/* Coins */}
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            C
                          </span>
                        </div>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                          {worker.coins.toLocaleString()}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                          coins
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <span>Progress to next level</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${progress}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          viewport={{ once: true }}
                          className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
