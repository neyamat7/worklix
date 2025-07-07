"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  fadeInUp,
  scaleIn,
  staggerContainer,
} from "../../../animations/motion";

const Tracking = () => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingResult, setTrackingResult] = useState(null);

  const handleTrack = () => {
    // Simulate tracking result
    setTrackingResult({
      id: trackingNumber || "SF123456789",
      status: "In Transit",
      location: "Distribution Center - New York",
      estimatedDelivery: "Today, 3:30 PM",
      progress: 75,
      timeline: [
        {
          status: "Package Picked Up",
          location: "Los Angeles, CA",
          time: "Yesterday, 2:15 PM",
          completed: true,
        },
        {
          status: "In Transit",
          location: "Phoenix, AZ",
          time: "Yesterday, 8:45 PM",
          completed: true,
        },
        {
          status: "Arrived at Facility",
          location: "Dallas, TX",
          time: "Today, 6:30 AM",
          completed: true,
        },
        {
          status: "Out for Delivery",
          location: "New York, NY",
          time: "Today, 1:15 PM",
          completed: false,
        },
        {
          status: "Delivered",
          location: "Your Address",
          time: "Today, 3:30 PM (Est.)",
          completed: false,
        },
      ],
    });
  };

  return (
    <section id="tracking" className="py-32 bg-black relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.2, 0.4],
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
          className="text-center mb-16"
        >
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center space-x-2 px-6 py-3 glass rounded-full mb-8"
          >
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
            <span className="text-blue-400 font-bold tracking-wider">
              PACKAGE TRACKING
            </span>
          </motion.div>

          <motion.h2
            variants={fadeInUp}
            className="text-5xl md:text-7xl font-black mb-8 gradient-text"
          >
            TRACK YOUR PACKAGE
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
          >
            Enter your tracking number to get real-time updates on your package
            location and delivery status.
          </motion.p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Tracking Input */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={scaleIn}
            className="glass rounded-3xl p-8 mb-12"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Enter tracking number (e.g., SF123456789)"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="flex-1 px-6 py-4 glass-dark rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
              />
              <motion.button
                onClick={handleTrack}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-2xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Track Package
              </motion.button>
            </div>
          </motion.div>

          {/* Tracking Result */}
          {trackingResult && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-3xl p-8"
            >
              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Package #{trackingResult.id}
                  </h3>
                  <p className="text-gray-400">
                    Current Status:{" "}
                    <span className="text-blue-400 font-semibold">
                      {trackingResult.status}
                    </span>
                  </p>
                </div>
                <div className="text-right mt-4 md:mt-0">
                  <p className="text-gray-400">Estimated Delivery</p>
                  <p className="text-white font-bold">
                    {trackingResult.estimatedDelivery}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">
                    Delivery Progress
                  </span>
                  <span className="text-sm text-blue-400 font-semibold">
                    {trackingResult.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${trackingResult.progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  ></motion.div>
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-4">
                <h4 className="text-xl font-bold text-white mb-4">
                  Tracking Timeline
                </h4>
                {trackingResult.timeline.map((event, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-start space-x-4 p-4 rounded-2xl ${
                      event.completed ? "glass-dark" : "glass"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full mt-1 ${
                        event.completed ? "bg-green-400" : "bg-gray-400"
                      }`}
                    ></div>
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                        <div>
                          <h5
                            className={`font-semibold ${
                              event.completed ? "text-white" : "text-gray-400"
                            }`}
                          >
                            {event.status}
                          </h5>
                          <p className="text-gray-500 text-sm">
                            {event.location}
                          </p>
                        </div>
                        <p className="text-gray-400 text-sm mt-1 md:mt-0">
                          {event.time}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-col md:flex-row gap-4 mt-8">
                <motion.button
                  className="flex-1 py-3 glass-dark rounded-2xl text-white font-semibold hover:bg-white/10 transition-colors duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Get SMS Updates
                </motion.button>
                <motion.button
                  className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-2xl"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Contact Support
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Tracking;
