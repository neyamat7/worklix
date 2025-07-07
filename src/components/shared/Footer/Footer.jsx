"use client";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "../../../animations/motion";

const Footer = () => {
  const footerLinks = {
    SERVICES: [
      "Express Delivery",
      "International Shipping",
      "Package Tracking",
      "Secure Transport",
      "Business Solutions",
      "Eco-Friendly Options",
    ],
    COMPANY: [
      "About Us",
      "Our Team",
      "Careers",
      "Press Center",
      "Investors",
      "Sustainability",
    ],
    SUPPORT: [
      "Help Center",
      "Contact Us",
      "Track Package",
      "Shipping Calculator",
      "API Documentation",
      "Service Status",
    ],
    LEGAL: [
      "Privacy Policy",
      "Terms of Service",
      "Cookie Policy",
      "GDPR Compliance",
      "Insurance Claims",
      "Prohibited Items",
    ],
  };

  const socialLinks = [
    { name: "Facebook", icon: "📘", url: "#" },
    { name: "Twitter", icon: "🐦", url: "#" },
    { name: "LinkedIn", icon: "💼", url: "#" },
    { name: "Instagram", icon: "📷", url: "#" },
    { name: "YouTube", icon: "📺", url: "#" },
  ];

  return (
    <footer className="bg-black text-white relative overflow-hidden">
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
        <div className="absolute inset-0 bg-gradient-to-t from-black via-gray-900/50 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Footer */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="py-20"
        >
          <div className="grid lg:grid-cols-6 gap-12">
            {/* Brand Section */}
            <motion.div variants={fadeInUp} className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-8">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 rounded-2xl flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">🚚</span>
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 rounded-2xl blur opacity-30 animate-pulse"></div>
                </div>
                <span className="text-4xl font-black gradient-text">
                  SwiftFlow
                </span>
              </div>

              <p className="text-gray-400 mb-8 leading-relaxed text-lg">
                Revolutionizing delivery with cutting-edge technology, real-time
                tracking, and sustainable solutions. Your trusted partner for
                fast, secure, and reliable courier services worldwide.
              </p>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    className="w-12 h-12 glass rounded-full flex items-center justify-center hover:glow-red transition-all duration-300"
                    whileHover={{ scale: 1.1, y: -5, rotate: 10 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <span className="text-xl">{social.icon}</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Links Sections */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <motion.div
                key={category}
                variants={fadeInUp}
                className="lg:col-span-1"
              >
                <h3 className="text-xl font-black mb-8 gradient-text">
                  {category}
                </h3>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link}>
                      <motion.a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors duration-300"
                        whileHover={{ x: 5 }}
                      >
                        {link}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Newsletter Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="border-t border-gray-800 py-16"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-black mb-4 gradient-text">
                STAY UPDATED
              </h3>
              <p className="text-gray-400 text-lg">
                Get the latest updates on new features, delivery insights,
                shipping tips, and exclusive offers delivered straight to your
                inbox.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 glass rounded-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-400 transition-all duration-300"
              />
              <motion.button
                className="bg-gradient-to-r from-red-500 to-pink-500 px-10 py-4 rounded-full font-bold text-white whitespace-nowrap"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                SUBSCRIBE
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Bottom Footer */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="border-t border-gray-800 py-12"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <div className="text-gray-400 text-center md:text-left">
              © 2024 SwiftFlow Courier Services. All rights reserved. |
              Delivering excellence worldwide since 2020.
            </div>
            <div className="flex flex-wrap justify-center md:justify-end space-x-8 text-sm text-gray-400">
              <a
                href="#"
                className="hover:text-white transition-colors duration-300"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="hover:text-white transition-colors duration-300"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="hover:text-white transition-colors duration-300"
              >
                Cookie Settings
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
