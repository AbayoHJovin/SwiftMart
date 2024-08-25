import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Locations from "../components/Locations";
import Navbar from "../components/Navbar";
import Popular from "../components/Popular";
import Review from "../components/Review";

const LandingPage = () => {
  return (
    <div className="gap-5 bg-white dark:bg-black">
      <Navbar />
      <Hero />
      <Review />
      <Popular />
      <Locations />
      <Footer />
    </div>
  );
};

export default LandingPage;
