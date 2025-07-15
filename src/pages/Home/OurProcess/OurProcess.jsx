import { motion } from "framer-motion";
import {
  FiArrowRight,
  FiCheckCircle,
  FiDollarSign,
  FiSearch,
  FiUserPlus,
} from "react-icons/fi";

const steps = [
  {
    id: 1,
    icon: FiUserPlus,
    title: "Create Account",
    description:
      "Sign up for free in under 60 seconds. No credit card required, no hidden fees.",
    color: "from-purple-500 to-blue-500",
    bgColor:
      "from-blue-50/60 to-cyan-50/60 dark:from-blue-900/20 dark:to-cyan-900/20",
  },
  {
    id: 2,
    icon: FiSearch,
    title: "Find Perfect Tasks",
    description:
      "Browse thousands of tasks that match your skills and interests. Filter by category and budget.",
    color: "from-purple-500 to-blue-500",
    bgColor:
      "from-blue-50/50 to-cyan-50/50 dark:from-blue-900/20 dark:to-cyan-900/20",
  },
  {
    id: 3,
    icon: FiCheckCircle,
    title: "Complete & Submit",
    description:
      "Work on tasks at your own pace. Submit high-quality work and get feedback from clients.",
    color: "from-purple-500 to-blue-500",
    bgColor:
      "from-blue-50/60 to-cyan-50/60 dark:from-blue-900/20 dark:to-cyan-900/20",
  },
  {
    id: 4,
    icon: FiDollarSign,
    title: "Get Paid Instantly",
    description:
      "Receive payments directly to your account. Withdraw anytime with multiple payment options.",
    color: "from-purple-500 to-blue-500",
    bgColor:
      "from-blue-50/60 to-cyan-50/60 dark:from-blue-900/20 dark:to-cyan-900/20",
  },
];

export default function OurProcess() {
  return (
    <section
      id="how-it-works"
      className="py-24 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 50,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-100/20 to-blue-100/20 dark:from-purple-800/10 dark:to-blue-800/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            rotate: [360, 0],
            x: [0, 100, 0],
          }}
          transition={{
            duration: 40,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-cyan-100/20 to-green-100/20 dark:from-cyan-800/10 dark:to-green-800/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 px-8 py-4 rounded-full mb-8 border border-blue-200/50 dark:border-blue-700/30"
          >
            <FiCheckCircle className="text-2xl text-purple-600 dark:text-purple-400" />
            <span className="text-purple-800 dark:text-purple-300 font-medium text-lg">
              Simple Process
            </span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Your Path
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
              To Quick Earnings
            </span>
          </h2>

          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Start earning money in just 4 simple steps. Our streamlined process
            makes it easy for anyone to begin their freelancing journey and
            achieve financial success.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div
                  className={`bg-gradient-to-br ${step.bgColor} rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/50 dark:border-gray-700/30 relative overflow-hidden dark: z-50`}
                >
                  {/* Step Number */}
                  <div className="absolute top-6 right-6">
                    <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg border border-gray-200 dark:border-gray-600">
                      <span className="text-gray-900 dark:text-white font-bold text-lg">
                        {step.id}
                      </span>
                    </div>
                  </div>

                  {/* Icon */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-20 h-20 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:shadow-2xl transition-all duration-500`}
                  >
                    <step.icon className="text-3xl text-white" />
                  </motion.div>

                  {/* Content */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-purple-600 dark:group-hover:text-blue-400 transition-colors whitespace-nowrap">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm line-clamp-2">
                      {step.description}
                    </p>
                  </div>

                  {/* Arrow for larger screens */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-1 transform -translate-y-1/2 z-10">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.2 + 0.8 }}
                        viewport={{ once: true }}
                        className="w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg border border-gray-200 dark:border-gray-600"
                      >
                        <FiArrowRight className="text-gray-600 dark:text-gray-400" />
                      </motion.div>
                    </div>
                  )}

                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-10 shadow-xl border border-gray-100 dark:border-gray-700 max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Start Your Journey?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
              Join thousands of successful freelancers who are already earning
              money with our platform.
            </p>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl shadow-blue-500/25"
            >
              Get Started for Free
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
