import BestWorkers from "../BestWorkers/BestWorkers";
import FeaturedSection from "../FeaturedSection/FeaturedSection";
import Hero from "../Hero/Hero";
import OurProcess from "../OurProcess/OurProcess";
import SecurityTrust from "../SecurityTrust/SecurityTrust";
import Testimonials from "../Testimonials/Testimonials";

const Home = () => {
  return (
    <div>
      <Hero />
      <BestWorkers />
      <FeaturedSection />
      <Testimonials />
      <OurProcess />
      <SecurityTrust />
    </div>
  );
};

export default Home;
