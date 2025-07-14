import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { heroSlides } from "../../../data/slidesData";

export default function HeroSection() {
  return (
    <section className="relative w-full h-[60vh]  min-h-[600px] overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        direction="horizontal"
        slidesPerView={1}
        navigation={{
          nextEl: ".swiper-button-next-custom",
          prevEl: ".swiper-button-prev-custom",
        }}
        pagination={{
          clickable: true,
          el: ".swiper-pagination-custom",
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          // reverseDirection: true,
        }}
        loop
        speed={1000}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        className="h-full"
      >
        {heroSlides.map((slide, index) => (
          <SwiperSlide key={index} className="h-full">
            <div className="relative h-full">
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${slide.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />

              <div className="relative h-full flex items-center justify-center">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full h-full flex items-center justify-start md:px-24">
                  <div className="max-w-3xl">
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.8 }}
                    >
                      <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight text-left">
                        {slide.title}
                      </h1>
                      <p className="text-xl lg:text-2xl text-gray-200 mb-8 leading-relaxed text-left">
                        {slide.subtitle}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-2xl hover:scale-105">
                          {slide.cta}
                        </button>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation */}
      <div className="hidden md:flex swiper-button-prev-custom absolute left-8 top-1/2 transform -translate-y-1/2 z-10 w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full items-center justify-center text-white hover:bg-white/30 transition-all cursor-pointer">
        <FiArrowRight className="w-6 h-6 rotate-180" />
      </div>
      <div className="hidden md:flex swiper-button-next-custom absolute right-8 top-1/2 transform -translate-y-1/2 z-10 w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full items-center justify-center text-white hover:bg-white/30 transition-all cursor-pointer">
        <FiArrowRight className="w-6 h-6" />
      </div>

      {/* Custom Pagination */}
      <div className="swiper-pagination-custom absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex space-x-3"></div>
    </section>
  );
}
