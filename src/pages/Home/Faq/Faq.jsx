 

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { fadeInUp, scaleIn, staggerContainer } from "../../../animations/motion";

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const faqs = [
    {
      id: 1,
      question: "How fast can you deliver my package?",
      answer:
        "We offer multiple delivery options: Express delivery within 2 hours for local packages, same-day delivery within city limits, next-day delivery nationwide, and 1-3 business days for international shipping. Our AI-powered routing system optimizes delivery times based on your location and package priority.",
      icon: "🚀",
      category: "Delivery Speed",
      gradient: "from-red-500 to-pink-600",
    },
    {
      id: 2,
      question: "Can I track my package in real-time?",
      answer:
        "Our advanced GPS tracking system provides real-time location updates, estimated delivery windows, and automatic notifications via SMS and email. You can track your package through our mobile app or website with live map visualization and delivery predictions.",
      icon: "📍",
      category: "Tracking",
      gradient: "from-blue-500 to-purple-600",
    },
    {
      id: 3,
      question: "What countries do you deliver to?",
      answer:
        "We deliver to over 150 countries worldwide through our extensive global network. Our international shipping includes customs clearance, duty calculation, and local delivery partnerships. Check our coverage map for specific countries and estimated delivery times.",
      icon: "🌍",
      category: "Coverage",
      gradient: "from-green-500 to-teal-600",
    },
    {
      id: 4,
      question: "How secure are my packages?",
      answer:
        "Security is our top priority. All packages are insured up to $1,000 automatically, with higher coverage available up to $50,000. We use tamper-evident packaging, secure facilities, background-checked drivers, signature confirmation, and photo proof of delivery for valuable items.",
      icon: "🔒",
      category: "Security",
      gradient: "from-purple-500 to-indigo-600",
    },
    {
      id: 5,
      question: "Do you offer eco-friendly delivery options?",
      answer:
        "Yes! We're committed to sustainability with our carbon-neutral shipping options, electric vehicle fleet in major cities, biodegradable packaging materials, and carbon offset programs. Choose our 'Green Delivery' option at checkout for environmentally conscious shipping.",
      icon: "🌱",
      category: "Sustainability",
      gradient: "from-emerald-500 to-green-600",
    },
    {
      id: 6,
      question: "What are your business solutions?",
      answer:
        "We offer comprehensive B2B solutions including API integration for seamless order processing, bulk shipping discounts up to 40% off, dedicated account managers, custom packaging and branding, warehousing services, and detailed analytics dashboards for enterprise clients.",
      icon: "🏢",
      category: "Business",
      gradient: "from-orange-500 to-red-600",
    },
  ];

  const categories = [...new Set(faqs.map((faq) => faq.category))];

  return (
    <section className="py-32 bg-black relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-400/50 to-transparent"
          animate={{ x: [-1000, 1000] }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"
          animate={{ x: [1000, -1000] }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
            delay: 2,
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-20"
        >
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center space-x-2 px-6 py-3 glass rounded-full mb-8"
          >
            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
            <span className="text-yellow-400 font-bold tracking-wider">
              FAQ
            </span>
          </motion.div>

          <motion.h2
            variants={fadeInUp}
            className="text-5xl md:text-7xl font-black mb-8 gradient-text"
          >
            FREQUENTLY ASKED QUESTIONS
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
          >
            Find answers to common questions about our courier services,
            delivery options, pricing, and business solutions.
          </motion.p>
        </motion.div>

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Category Navigation */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="lg:col-span-1"
            >
              <div className="sticky top-8">
                <h3 className="text-2xl font-black text-white mb-8">
                  CATEGORIES
                </h3>
                <div className="space-y-3">
                  {categories.map((category, index) => (
                    <motion.button
                      key={category}
                      variants={fadeInUp}
                      onClick={() => {
                        const faqIndex = faqs.findIndex(
                          (faq) => faq.category === category
                        );
                        setActiveIndex(faqIndex);
                      }}
                      className={`w-full text-left p-4 glass rounded-2xl transition-all duration-300 ${
                        faqs[activeIndex].category === category
                          ? `glow-red bg-gradient-to-r ${faqs[activeIndex].gradient} text-white`
                          : "hover:glass text-white hover:text-red-400"
                      }`}
                      whileHover={{ x: 5, scale: 1.02 }}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">
                          {faqs.find((faq) => faq.category === category)?.icon}
                        </span>
                        <span className="font-bold text-sm">{category}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Contact Card */}
                <motion.div
                  variants={scaleIn}
                  className="mt-12 glass rounded-2xl p-6 hover:glow-blue transition-all duration-300"
                >
                  <h4 className="font-black text-white mb-2">
                    NEED MORE HELP?
                  </h4>
                  <p className="text-gray-400 text-sm mb-4">
                    Our customer support team is available 24/7 to assist you
                    with any questions.
                  </p>
                  <motion.button
                    className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 rounded-full font-bold"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Contact Support
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>

            {/* FAQ Content */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="lg:col-span-3"
            >
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={faq.id}
                    variants={fadeInUp}
                    className={`glass rounded-2xl overflow-hidden transition-all duration-500 ${
                      index === activeIndex
                        ? "glow-red scale-102"
                        : "hover:glass"
                    }`}
                  >
                    <motion.button
                      onClick={() =>
                        setActiveIndex(index === activeIndex ? -1 : index)
                      }
                      className="w-full p-8 text-left flex items-center justify-between hover:bg-white/5 transition-colors duration-300"
                      whileHover={{ x: 5 }}
                    >
                      <div className="flex items-center space-x-6">
                        <div
                          className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-all duration-300 ${
                            index === activeIndex
                              ? `bg-gradient-to-r ${faq.gradient} text-white shadow-2xl`
                              : "glass text-white"
                          }`}
                        >
                          {faq.icon}
                        </div>
                        <div>
                          <h3
                            className={`text-xl font-bold transition-colors duration-300 ${
                              index === activeIndex
                                ? "text-red-400"
                                : "text-white"
                            }`}
                          >
                            {faq.question}
                          </h3>
                          <span
                            className={`text-sm font-medium ${
                              index === activeIndex
                                ? `bg-gradient-to-r ${faq.gradient} bg-clip-text text-transparent`
                                : "text-gray-400"
                            }`}
                          >
                            {faq.category}
                          </span>
                        </div>
                      </div>
                      <motion.div
                        animate={{ rotate: index === activeIndex ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className={`text-3xl transition-colors duration-300 ${
                          index === activeIndex
                            ? "text-red-400"
                            : "text-gray-600"
                        }`}
                      >
                        ↓
                      </motion.div>
                    </motion.button>

                    <AnimatePresence>
                      {index === activeIndex && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            duration: 0.5,
                            ease: [0.25, 0.46, 0.45, 0.94],
                          }}
                          className="overflow-hidden"
                        >
                          <div className="p-8 pt-0">
                            <div
                              className={`w-full h-px bg-gradient-to-r ${faq.gradient} mb-6`}
                            ></div>
                            <p className="text-gray-300 leading-relaxed text-lg">
                              {faq.answer}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faq;
