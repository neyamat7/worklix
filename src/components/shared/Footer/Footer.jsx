import { motion } from "framer-motion";
import { FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import {
  FiFacebook,
  FiLinkedin,
  FiMail,
  FiMapPin,
  FiPhone,
} from "react-icons/fi";
import FooterLogo from "../Logo/FooterLogo";

export default function Footer() {
  const navItems = [
    { id: "best-workers", name: "Best Workers" },
    { id: "recent-task", name: "Recent Task" },
    { id: "how-it-works", name: "How It Works" },
    { id: "testimonials", name: "Testimonials" },
  ];

  const socialLinks = [
    {
      icon: FaGithub,
      link: "https://github.com/neyamat7",
      color: "hover:text-gray-500",
    },
    {
      icon: FaXTwitter,
      link: "https://twitter.com/neyamat7ullah",
      color: "hover:text-blue-400",
    },
    {
      icon: FiFacebook,
      link: "https://www.facebook.com/neyamat4",
      color: "hover:text-blue-600",
    },
    {
      icon: FiLinkedin,
      link: "https://www.linkedin.com/",
      color: "hover:text-blue-500",
    },
  ];

  return (
    <footer className="bg-gray-900 dark:bg-black text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="col-span-1 md:col-span-2"
          >
            <div className="mb-6">
              <FooterLogo />
              <p className="text-gray-400 mt-2 max-w-md">
                Empowering freelancers worldwide with micro-tasks and fair
                earnings. Join our community and start your journey to financial
                freedom.
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-400">
                <FiMail className="text-purple-400" />
                <span>support@worklix.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <FiPhone className="text-purple-400" />
                <span>+8801834529197</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <FiMapPin className="text-purple-400" />
                <span>Mirpur, Dhaka</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {navItems.map((link, index) => (
                <li key={index}>
                  <motion.a
                    href={`#${link.id}`}
                    whileHover={{ x: 5 }}
                    className="text-gray-400 hover:text-purple-400 transition-colors"
                  >
                    {link.name}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.link}
                  target="_blank"
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`text-gray-400 ${social.color} transition-colors`}
                >
                  <social.icon className="text-xl" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-gray-800 mt-8 pt-8 text-center"
        >
          <p className="text-gray-400">© 2024 TaskEarn. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  );
}
