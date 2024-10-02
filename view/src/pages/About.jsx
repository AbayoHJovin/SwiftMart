import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const About = () => {
  return (
    <div className="bg-white dark:bg-black">
      <Navbar />
      <div className="text-black dark:text-white bg-[url('/bg-white.png')]  [10rem] items-center content-center h-[20rem] px-10">
        <div className="font-extrabold text-[3rem] text-start flex">
          <h1>Discover Our Story!</h1>
        </div>
      </div>
      <div className="flex flex-col md:flex-row p-6 md:p-12 bg-white dark:bg-black text-black dark:text-white">
        <div className="md:w-1/2 md:pr-6 mb-8 md:mb-0 sm:text-center md:text-start">
          <h1 className="font-bold text-3xl mb-4  sm:text-center md:text-start">
            About Us
          </h1>
          <p className="mb-8 text-lg font-lato w-auto md:w-[40vw] sssm:text-center md:text-start">
            Welcome to Jov Store, your go-to destination for premium products
            that blend quality, style, and value. Since 2011, we&apos;ve been
            committed to providing our customers with a curated selection of
            items across fashion, home decor, electronics, and more. Our mission
            is to make shopping a delightful experience by offering
            top-of-the-line products and exceptional customer service.
          </p>
          <h1 className="font-bold text-3xl mb-4">Our Mission</h1>
          <p className="mb-8 text-lg font-lato w-[40vw]">
            To bring you the finest selection of products that enhance your
            lifestyle, with a focus on quality, affordability, and customer
            satisfaction.
          </p>
          <h1 className="font-bold text-3xl mb-4 ">Our Vision</h1>
          <p className="text-lg font-lato ">
            To be the leading online shopping destination known for quality,
            variety, and a seamless shopping experience, making us your trusted
            partner in everyday life.
          </p>
        </div>
        <div className="md:w-1/2 relative">
          <img
            src="hero.png"
            alt="aboutUs"
            className="rounded-lg max-w-full h-auto"
            style={{ position: "relative" }}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
