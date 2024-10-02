import { CircleCheck } from "lucide-react";
import { useState } from "react";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

const categories = [
  { name: "Pants", icon: <CircleCheck />,href:"/shop/Both/pants" },
  { name: "Shirts", icon: <CircleCheck />,href:"/shop/Both/shirts" },
  { name: "T-shirts", icon: <CircleCheck />,href:"/shop/Both/shirts" },
  { name: "Shorts", icon: <CircleCheck />,href:"/shop/Both/pants" },
  { name: "Dresses", icon: <CircleCheck />,href:"/shop/Female/pants" },
  { name: "Skirts", icon: <CircleCheck />,href:"/shop/Female/pants" },
  { name: "Hats", icon: <CircleCheck />,href:"/shop/Both/hats" },
  { name: "Watches", icon: <CircleCheck />,href:"/shop/Both/watches" },
];

const CategorySection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < categories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div className="p-10 items-center  m-3 text-black dark:text-white">
      <div className="text-left">
        <h2 className="text-2xl font-bold text-center my-9 font-lato">
          Browse by Categories
        </h2>
      </div>

      {/* Desktop and Tablet View */}
      <div className="hidden md:flex items-center">
        <button
          className={`p-2 border border-gray-300 rounded-full ${
            currentIndex === 0 ? "opacity-50" : ""
          }`}
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          <AiOutlineLeft />
        </button>
        <div className="overflow-hidden flex">
          <div
            className="flex space-x-4 transition-transform"
            style={{ transform: `translateX(-${currentIndex * 200}px)` }}
          >
            {categories.map((category, index) => (
                <a href={category.href} key={category.name}>
              <div
                key={index}
                className="flex flex-col items-center p-4 border-2 border-gray-200 hover:text-white hover:bg-green-500 cursor-pointer hover:border-none rounded-lg"
                style={{ minWidth: "200px" }}
                >
                <span className="text-4xl">{category.icon}</span>
                <p className="mt-2 text-lg">{category.name}</p>
              </div>
                  </a>
            ))}
          </div>
        </div>
        <button
          className={`p-2 bg-gray-200 rounded-full ${
            currentIndex === categories.length - 1 ? "opacity-50" : ""
          }`}
          onClick={handleNext}
          disabled={currentIndex === categories.length - 1}
        >
          <AiOutlineRight />
        </button>
      </div>

      {/* Mobile View */}
      <div className="grid grid-cols-2 gap-4 md:hidden mt-6">
        {categories.map((category, index) => (
          <div
            key={index}
            className="flex flex-col border-2 border-gray-200 hover:text-white hover:bg-green-500 cursor-pointer hover:border-none items-center p-4  rounded-lg"
          >
            <span className="text-4xl">{category.icon}</span>
            <p className="mt-2 text-lg">{category.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
