import { motion } from "framer-motion";
import { FiAward, FiCheckCircle, FiShield, FiUsers } from "react-icons/fi";
import { features } from "../../../data/features";

const stats = [
  { label: "Trusted Users", value: "50K+", icon: FiUsers },
  { label: "Secure Transactions", value: "99.9%", icon: FiShield },
  { label: "Uptime Guarantee", value: "99.9%", icon: FiCheckCircle },
  { label: "Support Response", value: "<2hrs", icon: FiAward },
];

export default function SecurityTrust() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 80,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-green-100/30 to-blue-100/30 dark:from-green-800/10 dark:to-blue-800/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            rotate: [360, 0],
          }}
          transition={{
            duration: 70,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-100/30 to-pink-100/30 dark:from-purple-800/10 dark:to-pink-800/10 rounded-full blur-3xl"
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
            <FiShield className="text-purple-600 dark:text-purple-400" />
            <span className="text-purple-800 dark:text-purple-300 font-medium">
              Security & Trust
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Your Safety is Our
            <span className="block bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Top Priority
            </span>
          </h2>

          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            We've built a secure, trustworthy platform where you can work with
            confidence. Your data, payments, and privacy are protected by
            industry-leading security measures.
          </p>
        </motion.div>

        {/* Trust Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl p-6 border border-green-200/50 dark:border-green-700/30 shadow-lg hover:shadow-xl transition-all duration-300">
                <stat.icon className="text-3xl text-green-600 dark:text-green-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-sm">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Security Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{
                y: -5,
                scale: 1.02,
                transition: {
                  y: { duration: 0.2, delay: 0 },
                  scale: { duration: 0.2, delay: 0 },
                },
              }}
              transition={{
                opacity: { duration: 0.6, delay: index * 0.1 },
                y: { duration: 0.6, delay: index * 0.1 },
              }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-3xl p-8 border border-gray-200/50 dark:border-gray-600/50 shadow-lg hover:shadow-2xl transition-all duration-500 h-full relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-5 group-hover:opacity-10 transition-opacity">
                  <feature.icon className="w-full h-full" />
                </div>

                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                  className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                >
                  <feature.icon className="text-2xl text-white" />
                </motion.div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-blue-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-3xl p-8 border border-green-200/50 dark:border-green-700/30">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Trusted by Industry Leaders
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60 dark:opacity-40">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-700 dark:text-gray-300">
                  SSL Certified
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  256-bit Encryption
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-700 dark:text-gray-300">
                  PCI Compliant
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Secure Payments
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-700 dark:text-gray-300">
                  GDPR Ready
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Privacy Protected
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-700 dark:text-gray-300">
                  24/7 Support
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Always Available
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
