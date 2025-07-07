"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { fadeInUp, scaleIn, staggerContainer } from "../../../animations/motion";

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Jennifer Martinez",
      position: "Operations Manager",
      company: "TechStart Inc.",
      image: "/placeholder.svg?height=100&width=100",
      rating: 5,
      text: "SwiftFlow has completely transformed our logistics operations. The real-time tracking and lightning-fast delivery times have improved our customer satisfaction by 40%. Their team is incredibly responsive and professional.",
      stats: { packages: "2,500+", savings: "35%" },
      gradient: "from-red-500 to-pink-600",
    },
    {
      id: 2,
      name: "Robert Chen",
      position: "Supply Chain Director",
      company: "Global Commerce Ltd.",
      image: "/placeholder.svg?height=100&width=100",
      rating: 5,
      text: "The international shipping capabilities are outstanding. We've expanded to 25 new markets thanks to their reliable global network. The customs handling is seamless, and their support team is available 24/7.",
      stats: { packages: "5,000+", savings: "42%" },
      gradient: "from-blue-500 to-purple-600",
    },
    {
      id: 3,
      name: "Lisa Thompson",
      position: "E-commerce Manager",
      company: "Fashion Forward",
      image: "/placeholder.svg?height=100&width=100",
      rating: 5,
      text: "As an online retailer, fast and reliable delivery is crucial for our business. SwiftFlow's express delivery service has helped us compete with the biggest players in the market. Our customers love the real-time updates.",
      stats: { packages: "1,200+", savings: "50%" },
      gradient: "from-green-500 to-teal-600",
    },
    {
      id: 4,
      name: "Mark Johnson",
      position: "Logistics Coordinator",
      company: "MegaRetail Corp",
      image: "/placeholder.svg?height=100&width=100",
      rating: 5,
      text: "The business solutions package has streamlined our entire supply chain. The API integration was seamless, and the volume discounts have significantly reduced our shipping costs while improving delivery times.",
      stats: { packages: "10,000+", savings: "38%" },
      gradient: "from-purple-500 to-indigo-600",
    },
  ];

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <section className="py-32 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.3, 1, 1.3],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
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
              TESTIMONIALS
            </span>
          </motion.div>

          <motion.h2
            variants={fadeInUp}
            className="text-5xl md:text-7xl font-black mb-8 gradient-text"
          >
            CLIENT SUCCESS STORIES
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
          >
            Discover how businesses worldwide are transforming their logistics
            operations with SwiftFlow's innovative delivery solutions.
          </motion.p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          {/* Main Testimonial */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={scaleIn}
            className="relative"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 100, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -100, scale: 0.8 }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="glass rounded-3xl p-12 relative overflow-hidden"
              >
                {/* Background gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${testimonials[activeIndex].gradient} opacity-5`}
                ></div>

                {/* Glow effect */}
                <div
                  className={`absolute -inset-1 bg-gradient-to-br ${testimonials[activeIndex].gradient} rounded-3xl blur opacity-20`}
                ></div>

                <div className="relative z-10">
                  <div className="grid lg:grid-cols-3 gap-12 items-center">
                    {/* Testimonial Content */}
                    <div className="lg:col-span-2">
                      {/* Stars */}
                      <div className="flex items-center mb-8">
                        {[...Array(testimonials[activeIndex].rating)].map(
                          (_, i) => (
                            <motion.span
                              key={i}
                              initial={{ opacity: 0, scale: 0, rotate: -180 }}
                              animate={{ opacity: 1, scale: 1, rotate: 0 }}
                              transition={{
                                delay: i * 0.1,
                                type: "spring",
                                stiffness: 300,
                              }}
                              className="text-3xl text-yellow-400 mr-2"
                            >
                              ⭐
                            </motion.span>
                          )
                        )}
                      </div>

                      {/* Quote */}
                      <blockquote className="text-2xl md:text-3xl text-white leading-relaxed mb-8 font-medium">
                        "{testimonials[activeIndex].text}"
                      </blockquote>

                      {/* Author */}
                      <div className="flex items-center space-x-6">
                        <div className="relative">
                          <img
                            src={
                              testimonials[activeIndex].image ||
                              "/placeholder.svg"
                            }
                            alt={testimonials[activeIndex].name}
                            className="w-20 h-20 rounded-full object-cover"
                          />
                          <div
                            className={`absolute -inset-1 bg-gradient-to-r ${testimonials[activeIndex].gradient} rounded-full blur opacity-50`}
                          ></div>
                        </div>
                        <div>
                          <div className="font-bold text-white text-xl">
                            {testimonials[activeIndex].name}
                          </div>
                          <div className="text-gray-400 text-lg">
                            {testimonials[activeIndex].position}
                          </div>
                          <div
                            className={`bg-gradient-to-r ${testimonials[activeIndex].gradient} bg-clip-text text-transparent font-bold`}
                          >
                            {testimonials[activeIndex].company}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="lg:col-span-1">
                      <div className="glass rounded-2xl p-8">
                        <h4 className="font-bold text-white mb-6 text-center text-xl">
                          RESULTS ACHIEVED
                        </h4>
                        <div className="space-y-6">
                          <div className="text-center">
                            <div
                              className={`text-4xl font-black bg-gradient-to-r ${testimonials[activeIndex].gradient} bg-clip-text text-transparent`}
                            >
                              {testimonials[activeIndex].stats.packages}
                            </div>
                            <div className="text-sm text-gray-400">
                              Packages Delivered
                            </div>
                          </div>
                          <div className="text-center">
                            <div
                              className={`text-4xl font-black bg-gradient-to-r ${testimonials[activeIndex].gradient} bg-clip-text text-transparent`}
                            >
                              {testimonials[activeIndex].stats.savings}
                            </div>
                            <div className="text-sm text-gray-400">
                              Cost Savings
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-center mt-12 space-x-6">
              <motion.button
                onClick={prevTestimonial}
                className="w-16 h-16 glass rounded-full flex items-center justify-center text-red-400 hover:text-white hover:glow-red transition-all duration-300"
                whileHover={{ scale: 1.1, rotate: -10 }}
                whileTap={{ scale: 0.9 }}
              >
                ←
              </motion.button>

              {/* Dots */}
              <div className="flex space-x-3">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`w-4 h-4 rounded-full transition-all duration-300 ${
                      index === activeIndex
                        ? `bg-gradient-to-r ${testimonials[activeIndex].gradient} scale-125`
                        : "bg-gray-600 hover:bg-gray-500"
                    }`}
                  />
                ))}
              </div>

              <motion.button
                onClick={nextTestimonial}
                className="w-16 h-16 glass rounded-full flex items-center justify-center text-red-400 hover:text-white hover:glow-red transition-all duration-300"
                whileHover={{ scale: 1.1, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
              >
                →
              </motion.button>
            </div>
          </motion.div>

          {/* Thumbnail Navigation */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
          >
            {testimonials.map((testimonial, index) => (
              <motion.button
                key={testimonial.id}
                variants={fadeInUp}
                onClick={() => setActiveIndex(index)}
                className={`p-6 glass rounded-2xl transition-all duration-300 ${
                  index === activeIndex
                    ? `glow-red scale-105`
                    : "hover:scale-105 hover:glass"
                }`}
                whileHover={{ y: -5 }}
              >
                <div className="flex flex-col items-center space-y-3">
                  <div className="relative">
                    <img
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    {index === activeIndex && (
                      <div
                        className={`absolute -inset-1 bg-gradient-to-r ${testimonial.gradient} rounded-full blur opacity-50`}
                      ></div>
                    )}
                  </div>
                  <div className="text-center">
                    <div
                      className={`font-bold text-sm ${
                        index === activeIndex ? "text-red-400" : "text-white"
                      }`}
                    >
                      {testimonial.name}
                    </div>
                    <div className="text-xs text-gray-400">
                      {testimonial.company}
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
