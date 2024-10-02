import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Locations from "../components/Locations";
import Navbar from "../components/Navbar";
import Popular from "../components/Popular";
import Review from "../components/Review";
import WhatWeSell from "../components/WhatWeSell";

const LandingPage = () => {
  return (
    <div className="gap-5 bg-white dark:bg-black">
      <Navbar />
      <Hero />
      <WhatWeSell />
      <Popular />
      <Review />
      <Locations />
      <Footer />
    </div>
  );
};

export default LandingPage;
