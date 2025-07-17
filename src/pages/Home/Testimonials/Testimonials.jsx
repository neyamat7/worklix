import { motion } from "framer-motion";
import { FaQuoteLeft } from "react-icons/fa";
import { FiStar } from "react-icons/fi";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { Autoplay, EffectCoverflow, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const testimonials = [
  {
    id: 1,
    name: "Jennifer Adams",
    photo:
      "https://i.postimg.cc/m2nv9N2v/photo-1438761681033-6461ffad8d80.avif",
    role: "Freelance Writer",
    rating: 5,
    quote:
      "This platform has completely transformed my freelancing career. I've earned over $5,000 in just 3 months!",
    earnings: "$5,240",
  },

  {
    id: 2,
    name: "Robert Chen",
    photo:
      "https://i.postimg.cc/brWmZgHL/360-F-523629123-Rp-AMod-BJXg-CTPfilf-Ya-CIb-Paal-FIjbvv.jpg",
    role: "Data Analyst",
    rating: 5,
    quote:
      "The tasks are well-organized and payments are always on time. Perfect for earning extra income in my spare time.",
    earnings: "$3,890",
  },

  {
    id: 3,
    name: "Maria Garcia",
    photo: "https://i.postimg.cc/2ybwNvRW/images-2.jpg",
    role: "Virtual Assistant",
    rating: 5,
    quote:
      "Amazing platform! The variety of tasks keeps things interesting, and the community is incredibly supportive.",
    earnings: "$4,650",
  },

  {
    id: 4,
    name: "James Wilson",
    photo: "https://i.postimg.cc/GpXVckNg/images-3.jpg",
    role: "Graphic Designer",
    rating: 5,
    quote:
      "I love how easy it is to find tasks that match my skills. The earning potential here is truly unlimited!",
    earnings: "$6,120",
  },

  {
    id: 5,
    name: "Sophie Turner",
    photo: "https://i.postimg.cc/yd5GR77F/ecf3db173fea15839fdfe0625b25bfec.jpg",
    role: "Content Creator",
    rating: 5,
    quote:
      "The best decision I made was joining this platform. It's helped me achieve financial independence.",
    earnings: "$7,350",
  },

  {
    id: 6,
    name: "Ahmed Hassan",
    photo: "https://i.postimg.cc/05MFsKCZ/images-4.jpg",
    role: "Web Developer",
    rating: 5,
    quote:
      "Professional, reliable, and profitable. This platform has exceeded all my expectations!",
    earnings: "$8,920",
  },
];

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-800 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 30,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-purple-300/20 to-blue-300/20 dark:from-purple-600/10 dark:to-blue-600/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 35,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-cyan-300/20 to-purple-300/20 dark:from-cyan-600/10 dark:to-purple-600/10 rounded-full blur-3xl"
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
            <FaQuoteLeft className="text-purple-600 dark:text-purple-400" />
            <span className="text-purple-800 dark:text-purple-300 font-medium">
              Success Stories
            </span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            What Our
            <span className="block bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Achievers Say
            </span>
          </h2>

          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Real stories from real people who have transformed their lives
            through our platform. Join thousands of satisfied workers earning
            money daily.
          </p>
        </motion.div>

        {/* Testimonials Slider */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative"
        >
          <Swiper
            modules={[Autoplay, Pagination, EffectCoverflow]}
            spaceBetween={30}
            slidesPerView={1}
            centeredSlides={true}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            effect="coverflow"
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 2,
              slideShadows: false,
            }}
            breakpoints={{
              640: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            className="testimonials-swiper pb-16"
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={testimonial.id}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group h-full"
                >
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 h-full relative overflow-hidden">
                    {/* Quote Icon */}
                    <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                      <FaQuoteLeft className="text-6xl text-purple-600" />
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: i * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <FiStar className="text-yellow-500 fill-current text-xl" />
                        </motion.div>
                      ))}
                    </div>

                    {/* Quote */}
                    <blockquote className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-8 relative z-10">
                      "{testimonial.quote}"
                    </blockquote>

                    {/* User Info */}
                    <div className="flex items-center gap-4">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                        className="relative"
                      >
                        <img
                          src={testimonial.photo || "/placeholder.svg"}
                          alt={testimonial.name}
                          className="w-16 h-16 rounded-full object-cover border-4 border-gradient-to-r from-purple-400 to-blue-400"
                        />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white dark:border-gray-800"></div>
                      </motion.div>

                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                          {testimonial.name}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {testimonial.role}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-green-600 dark:text-green-400 font-bold">
                            {testimonial.earnings}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400 text-sm">
                            earned
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
        >
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              98%
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              Satisfaction Rate
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              24/7
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              Support Available
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-cyan-600 dark:text-cyan-400 mb-2">
              $50K+
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              Average Monthly Earnings
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        .testimonials-swiper .swiper-pagination {
          bottom: 0 !important;
        }
        .testimonials-swiper .swiper-pagination-bullet {
          background: #8b5cf6 !important;
          opacity: 0.3 !important;
        }
        .testimonials-swiper .swiper-pagination-bullet-active {
          opacity: 1 !important;
        }
      `}</style>
    </section>
  );
}
