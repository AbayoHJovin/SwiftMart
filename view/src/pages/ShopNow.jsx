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

const ShopNow = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const [selectedGender, setSelectedGender] = useState("Select Gender");
  const [selectType, setSelectType] = useState("Select Type");

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const toggleTypeDropdown = () => {
    setTypeOpen(!typeOpen);
  };

  const handleGenderSelect = (gender) => {
    setSelectedGender(gender);
    setIsOpen(false);
  };
  const handleTypeSelect = (type) => {
    setSelectType(type);
    setTypeOpen(false);
  };

  return (
    <div className="bg-white dark:bg-black">
      <Navbar />
      <div className="bg-[#CFC6B8] dark:bg-black flex flex-col md:flex-row items-center justify-around h-auto min-h-[20rem] px-6 md:px-16 py-8 md:py-16 rounded-lg">
        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#184A45] dark:text-white mb-4">
            Grab Up to 50% Off On Selected items
          </h2>
          <button className="bg-[#184A45] text-white text-lg py-2 px-6 rounded-full mt-4">
            Buy Now
          </button>
        </div>
        <div className="md:w-1/2 w-full flex  justify-center md:justify-end mt-6 md:mt-0">
          <img
            src="https://via.placeholder.com/400"
            alt="items"
            className="h-auto w-1/2 md:w-2/3 lg:w-1/2 rounded-lg shadow-lg"
          />
        </div>
      </div>

      <div className="relative inline-block z-[3] bg-white dark:bg-black my-5 mx-5 w-auto md:w-auto text-left">
        <div>
          <button
            onClick={toggleDropdown}
            className="inline-flex justify-between w-auto md:w-48 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {selectedGender}
            <FaChevronDown
              className={`w-5 h-5 ml-2 transition-transform duration-300 transform ${
                isOpen ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>
        </div>

        <div
          className={`origin-top-right absolute right-0 mt-2 w-full md:w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none transition duration-300 ease-out transform ${
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
              Both
            </button>
          </div>
        </div>
      </div>
      <div className="relative inline-block z-[2] bg-white dark:bg-black my-5 mx-5 w-auto md:w-auto text-left">
        <div>
          <button
            onClick={toggleTypeDropdown}
            className="inline-flex justify-between w-auto md:w-48 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {selectType}
            <FaChevronDown
              className={`w-5 h-5 ml-2 transition-transform duration-300 transform ${
                typeOpen ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>
        </div>

        <div
          className={`origin-top-right absolute right-0 z-20 mt-2 w-full md:w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none transition duration-300 ease-out transform ${
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
      <div className="mx-0 sm:mx-3 md:mx-10 bg-white dark:bg-black">
        {selectedGender === "Male" && selectType == "pants" ? (
          <MenPants />
        ) : selectedGender == "Male" && selectType == "shoes" ? (
          <MenShoes />
        ) : selectedGender == "Male" && selectType == "shirts" ? (
          <Menshirts />
        ) : selectedGender == "Female" && selectType == "pants" ? (
          <WomenSkirts />
        ) : selectedGender == "Female" && selectType == "shoes" ? (
          <WomenShoes />
        ) : selectedGender == "Female" && selectType == "shirts" ? (
          <WomenShirts />
        ) : (selectedGender == "Male" ||
            selectedGender == "Female" ||
            selectedGender == "Both") &&
          selectType == "watches" ? (
          <Watches />
        ) : (selectedGender == "Male" ||
            selectedGender == "Female" ||
            selectedGender == "Both") &&
          selectType == "hats" ? (
          <Hats />
        ) : selectedGender == "Both" && selectType == "pants" ? (
          <Pants />
        ) : selectedGender == "Both" && selectType == "shirts" ? (
          <Shirts />
        ) : selectedGender == "Both" && selectType == "shoes" ? (
          <Shoes />
        ) : null}
      </div>
      <Footer />
    </div>
  );
};

export default ShopNow;
