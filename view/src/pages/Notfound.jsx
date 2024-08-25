import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const NotFound = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-grow items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center px-6 md:px-12">
          <h1 className="text-7xl md:text-9xl font-bold text-gray-800 dark:text-gray-200">
            404
          </h1>
          <p className="text-xl md:text-2xl font-light leading-normal text-gray-600 dark:text-gray-300 mb-8">
            Sorry, we couldn&apos;t find this page.
          </p>
          <a
            href="/"
            className="px-6 py-3 text-sm font-medium leading-5 text-center text-white capitalize transition-colors duration-200 transform bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:bg-blue-500"
          >
            Home{" "}
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
