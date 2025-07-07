 
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { fadeInLeft, fadeInUp } from "../../animations/motion";

const HeroSlider = () => {
  const slides = [
    {
      id: 1,
      title: "FASTEST DELIVERY IN THE CITY",
      subtitle: "Express Courier Service",
      description:
        "Get your packages delivered within 2 hours with our premium express service. Real-time tracking and guaranteed delivery.",
      image:
        "https://i.postimg.cc/wB2Gs5DK/parcel-delivery-service-illustration-concept-flat-illustration-isolated-on-white-background-vector.jpg",
      gradient: "from-red-500 via-pink-500 to-purple-600",
      stats: { time: "2 Hours", success: "99.9%" },
    },
    {
      id: 2,
      title: "GLOBAL SHIPPING NETWORK",
      subtitle: "Worldwide Delivery",
      description:
        "Connect with customers worldwide through our extensive international shipping network with customs handling.",
      image:
        "https://i.postimg.cc/cJGv8w0c/shop-delivery-courier-service-online-cartoon-vector-34505297.webp",
      gradient: "from-blue-500 via-teal-500 to-green-500",
      stats: { countries: "150+", tracking: "24/7" },
    },
    {
      id: 3,
      title: "SECURE & INSURED TRANSPORT",
      subtitle: "Premium Protection",
      description:
        "Your valuable packages are protected with comprehensive insurance and advanced security protocols.",
      image:
        "https://i.postimg.cc/mD8kqnMd/photo-1607273685680-6bd976c5a5ce.avif",
      gradient: "from-purple-500 via-indigo-500 to-blue-600",
      stats: { insurance: "$10K", security: "Military Grade" },
    },
    {
      id: 4,
      title: "SMART TRACKING SYSTEM",
      subtitle: "Real-Time Updates",
      description:
        "Track your packages with precision GPS, get instant notifications, and know exactly when they'll arrive.",
      image: "/placeholder.svg?height=600&width=800",
      gradient: "from-green-500 via-teal-500 to-cyan-500",
      stats: { accuracy: "GPS", updates: "Live" },
    },
  ];

  return (
    <section className="relative h-[90vh] overflow-hidden animated-bg">
      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-red-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        loop={true}
        className="h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div
              className={`relative h-full bg-gradient-to-br ${slide.gradient} flex items-center`}
            >
              {/* Morphing background shapes */}
              <div className="absolute inset-0 overflow-hidden">
                <motion.div
                  className="absolute top-20 right-20 w-64 h-64 bg-white/10 morph"
                  animate={{ rotate: [0, 360] }}
                  transition={{
                    duration: 20,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                />
                <motion.div
                  className="absolute bottom-20 left-20 w-48 h-48 bg-white/5 rounded-full"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY }}
                />
              </div>

              <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  {/* Content */}
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInLeft}
                    className="text-white"
                  >
                    <motion.div
                      className="flex items-center space-x-4 mb-6"
                      variants={fadeInUp}
                    >
                      <span className="px-6 py-2 glass rounded-full text-sm font-bold tracking-wider">
                        {slide.subtitle}
                      </span>
                      <div className="flex space-x-2">
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                        <span
                          className="w-2 h-2 bg-white/60 rounded-full animate-pulse"
                          style={{ animationDelay: "0.2s" }}
                        ></span>
                        <span
                          className="w-2 h-2 bg-white/40 rounded-full animate-pulse"
                          style={{ animationDelay: "0.4s" }}
                        ></span>
                      </div>
                    </motion.div>

                    <motion.h1
                      className="text-4xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight"
                      variants={fadeInUp}
                    >
                      {slide.title}
                    </motion.h1>

                    <motion.p
                      className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl leading-relaxed"
                      variants={fadeInUp}
                    >
                      {slide.description}
                    </motion.p>

                    {/* Stats */}
                    <motion.div
                      className="flex space-x-8 mb-8"
                      variants={fadeInUp}
                    >
                      {Object.entries(slide.stats).map(([key, value]) => (
                        <div key={key} className="text-center">
                          <div className="text-2xl font-black">{value}</div>
                          <div className="text-sm text-white/70 capitalize">
                            {key}
                          </div>
                        </div>
                      ))}
                    </motion.div>

                    <motion.div
                      className="flex flex-col sm:flex-row gap-6"
                      variants={fadeInUp}
                    >
                      <motion.button
                        className="px-10 py-4 bg-white text-black font-bold rounded-full text-lg shadow-2xl"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Get Quote Now
                      </motion.button>

                      <motion.button
                        className="px-10 py-4 glass border-2 border-white/30 text-white font-bold rounded-full text-lg"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Track Package
                      </motion.button>
                    </motion.div>
                  </motion.div>

                  {/* Image */}
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    className="relative"
                  >
                    <div className="relative z-10">
                      <motion.img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-auto rounded-3xl shadow-2xl"
                        whileHover={{ scale: 1.02, rotateY: 5 }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>

                    {/* Floating stats */}
                    <motion.div
                      className="absolute -top-16 -right-6 glass rounded-2xl p-4 shadow-2xl"
                      animate={{
                        y: [0, -15, 0],
                        rotate: [0, 5, 0],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                    >
                      <div className="text-2xl">📦</div>
                      <div className="text-xs text-white/70">Delivered</div>
                    </motion.div>

                    <motion.div
                      className="absolute -bottom-16 -left-6 glass rounded-2xl p-4 shadow-2xl"
                      animate={{
                        y: [0, 15, 0],
                        rotate: [0, -5, 0],
                      }}
                      transition={{
                        duration: 5,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                        delay: 1,
                      }}
                    >
                      <div className="text-2xl">🚚</div>
                      <div className="text-xs text-white/70">On Route</div>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default HeroSlider;
