import { CgHeart } from "react-icons/cg";
import { FaCheckCircle, FaHeart } from "react-icons/fa";

/* eslint-disable react/prop-types */
const ProductCard = ({
  itemImage,
  itemName,
  itemPrice,
  itemDesc,
  handleAddToCart,
  isOnCart,
  isOnFav,
  deleteItem,
  deleteFromFav,
  addToFav
}) => {
  return (
    <div className="flex flex-col items-center w-full max-w-xs mx-auto overflow-hidden rounded-lg shadow-lg bg-white dark:bg-gray-800 p-4 transition-all transform hover:scale-105">
      <div className="relative w-full h-60">
        <img
          className="w-full h-full object-cover rounded-md"
          src={itemImage}
          alt={itemName}
        />
        {
          isOnFav? (
        <button onClick={deleteFromFav} className="absolute top-2 right-2 bg-white dark:bg-gray-700 p-2 rounded-full shadow-md">
          <FaHeart className="text-red-500" />
        </button>
          ):(
        <button onClick={addToFav} className="absolute top-2 right-2 bg-white dark:bg-gray-700 p-2 rounded-full shadow-md">
          <CgHeart className="text-gray-800 hover:text-red-500" />
        </button>
          )
        }
      </div>
      <div className="flex flex-col justify-between w-full pt-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {itemName}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{itemDesc}</p>
        <div className="flex items-center mt-2">
          <div className="flex text-green-500 dark:text-yellow-400">
            {Array(5)
              .fill("")
              .map((_, index) => (
                <svg
                  key={index}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="none"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 17.27l6.18 3.73-1.64-7.03 5.46-4.73-7.12-.61L12 2 9.12 9.63l-7.12.61 5.46 4.73L5.82 21 12 17.27z"
                  />
                </svg>
              ))}
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
            (1210)
          </span>
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
            {itemPrice}
          </span>
          {isOnCart ? (
            <button
              onClick={deleteItem}
              className="border flex items-center gap-2 border-green-500 text-green-500 dark:text-yellow-400 py-2 px-4 rounded-full hover:bg-green-900 hover:text-white dark:hover:bg-yellow-600"
            >
              <span>
                <FaCheckCircle />
              </span>
              On Cart
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              className="border border-green-500 text-green-500 dark:text-yellow-400 py-2 px-4 rounded-full hover:bg-green-900 hover:text-white dark:hover:bg-yellow-600"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
