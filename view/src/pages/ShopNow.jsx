import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import MenPants from "../components/Men/MenPants";
import MenShoes from "../components/Men/MenShoes";
import Menshirts from "../components/Men/Menshirts";
import WomenSkirts from "../components/Women/WomenSkirts";
import WomenShoes from "../components/Women/WomenShoes";
import WomenShirts from "../components/Women/WomenShirts";
import Watches from "../components/BothGender/Watches";
import Hats from "../components/BothGender/Hats";
import Pants from "../components/BothGender/Pants";
import Shirts from "../components/BothGender/Shirts";
import Shoes from "../components/BothGender/Shoes";
import CartItems from "../../constants/cartItems";
import FavItems from "../../constants/favItems";
import FavProducts from "../components/Favourites";
import { HeartIcon } from "lucide-react";

const ShopNow = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const [selectedGender, setSelectedGender] = useState("Male");
  const [selectType, setSelectType] = useState("pants");
  const [showFav, setShowFav] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const toggleTypeDropdown = () => {
    setTypeOpen(!typeOpen);
  };

  const handleGenderSelect = (gender) => {
    setSelectedGender(gender);
    setIsOpen(false);
    setShowFav(false);
  };
  const handleTypeSelect = (type) => {
    setSelectType(type);
    setTypeOpen(false);
    setShowFav(false);
  };
  function showFavProds() {
    setShowFav(true);
  }
  return (
    <CartItems>
      <FavItems>
        <div className="bg-white dark:bg-black min-h-screen">
          <Navbar />
          <div className="bg-[url('./bg-white.png')] dark:bg-[url('./bg-black.png')] dark:bg-black flex flex-col md:flex-row items-center justify-around h-auto min-h-[20rem] px-6 md:px-16 py-8 md:py-16 rounded-lg">
            <div className="md:w-1/2 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-semibold text-black dark:text-white mb-4">
                Choose a product for a faster delivery
              </h2>
            </div>
          </div>
          <div className="flex sticky top-24 bg-transparent backdrop-blur-3xl z-50 flex-row justify-center items-start sssm:items-center sm:items-start sm:justify-center">
            <div className="flex flex-col sssm:flex-row sssm:space-x-4 gap-4 items-center sm:items-start my-5 mx-5">
              <div className="relative inline-block z-[3] bg-white dark:bg-black w-full sm:w-auto text-left">
                <button
                  onClick={toggleDropdown}
                  className="inline-flex justify-between w-full sm:w-48 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {selectedGender}
                  <FaChevronDown
                    className={`w-5 h-5 ml-2 transition-transform duration-300 transform ${
                      isOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>

                <div
                  className={`origin-top-right absolute right-0 mt-2 w-full sm:w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none transition duration-300 ease-out transform ${
                    isOpen
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-95 pointer-events-none"
                  }`}
                >
                  <div className="py-1">
                    <button
                      onClick={() => handleGenderSelect("Male")}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Male
                    </button>
                    <button
                      onClick={() => handleGenderSelect("Female")}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Female
                    </button>
                    <button
                      onClick={() => handleGenderSelect("Both")}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      For both genders
                    </button>
                  </div>
                </div>
              </div>
              <div className="relative inline-block z-[2] bg-white dark:bg-black w-full sm:w-auto text-left">
                <button
                  onClick={toggleTypeDropdown}
                  className="inline-flex justify-between w-full sm:w-48 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {selectType}
                  <FaChevronDown
                    className={`w-5 h-5 ml-2 transition-transform duration-300 transform ${
                      typeOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>

                <div
                  className={`origin-top-right absolute right-0 z-20 mt-2 w-full sm:w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none transition duration-300 ease-out transform ${
                    typeOpen
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-95 pointer-events-none"
                  }`}
                >
                  <div className="py-1 z-20">
                    <button
                      onClick={() => handleTypeSelect("shoes")}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Shoes
                    </button>
                    <button
                      onClick={() => handleTypeSelect("pants")}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Pants & Shorts
                    </button>
                    <button
                      onClick={() => handleTypeSelect("shirts")}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      shirts & T-shirts
                    </button>
                    <button
                      onClick={() => handleTypeSelect("watches")}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Watches
                    </button>
                    <button
                      onClick={() => handleTypeSelect("hats")}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Hats
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <span
              onClick={showFavProds}
              className="text-3xl cursor-pointer sm:ml-4 my-5 text-center mt-5 text-gray-400 hover:text-transparent"
            >
              <HeartIcon
                className="fill-transparent hover:fill-red-500 transition-all ease-in-out duration-150"
                size={30}
              />
            </span>
          </div>
          <div className="mx-0 sm:mx-3 md:mx-10 bg-white dark:bg-black">
            {showFav ? (
              <FavProducts />
            ) : selectedGender === "Male" && selectType === "pants" ? (
              <MenPants />
            ) : selectedGender === "Male" && selectType === "shoes" ? (
              <MenShoes />
            ) : selectedGender === "Male" && selectType === "shirts" ? (
              <Menshirts />
            ) : selectedGender === "Female" && selectType === "pants" ? (
              <WomenSkirts />
            ) : selectedGender === "Female" && selectType === "shoes" ? (
              <WomenShoes />
            ) : selectedGender === "Female" && selectType === "shirts" ? (
              <WomenShirts />
            ) : (selectedGender === "Male" ||
                selectedGender === "Female" ||
                selectedGender === "Both") &&
              selectType === "watches" ? (
              <Watches />
            ) : (selectedGender === "Male" ||
                selectedGender === "Female" ||
                selectedGender === "Both") &&
              selectType === "hats" ? (
              <Hats />
            ) : selectedGender === "Both" && selectType === "pants" ? (
              <Pants />
            ) : selectedGender === "Both" && selectType === "shoes" ? (
              <Shoes />
            ) : selectedGender === "Both" && selectType === "shirts" ? (
              <Shirts />
            ) : (
              ""
            )}
          </div>
          <Footer />
        </div>
      </FavItems>
    </CartItems>
  );
};

export default ShopNow;
