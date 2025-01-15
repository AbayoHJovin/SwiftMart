/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useProducts from "../../constants/products";
import Navbar from "../components/Navbar";
import { CartContext } from "../../constants/cartItems";
import Loader3 from "../components/Loading3";

const ProductPage = () => {
  const { loading, itemsOnCart, addItemOncart, deleteItem } =
    useContext(CartContext);
  const [realProduct, setRealProduct] = useState(null);
  const [isOnCart, setIsOnCart] = useState(false);
  const { products } = useProducts();
  const { prodId } = useParams();
  const [loadingPage, setLoadingPage] = useState(false);

  useEffect(() => {
    setLoadingPage(true);
    const product = products.find((product) => product.prodId === prodId);
    const isOnTheCart = itemsOnCart?.find((item) => item.productId == prodId);
    if (isOnTheCart) {
      setIsOnCart(true);
    } else {
      setIsOnCart(false);
    }
    setRealProduct(product || null);
    setLoadingPage(false);
  }, [prodId, products, itemsOnCart]);

  return (
    <div className="bg-white dark:bg-black">
      <Navbar />
      {prodId ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {realProduct ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Image Container with Defined Size */}
              <div className="flex justify-center items-center bg-gray-100 p-4 rounded-lg">
                <div className="w-full max-w-[400px] h-[400px] sm:max-w-[500px] sm:h-[500px]">
                  <img
                    src={realProduct.image}
                    alt={realProduct.prodName}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-4">
                  {realProduct.prodName}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-200 mb-4">
                  {realProduct.prodDescription}
                </p>

                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    <span className="text-green-500 text-xl">★★★★★</span>
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-200">
                      (1000 Reviews)
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                    RWF {realProduct.price}
                  </span>
                  <p className="text-sm text-gray-500 dark:text-gray-200">
                    You pay after getting a product
                  </p>
                </div>

                <div className="flex items-center mb-4">
                  <p className="ml-4 text-red-500 font-semibold">
                    Only {realProduct.stock} Items Left!
                  </p>
                </div>

                <div className="flex space-x-4">
                  {isOnCart ? (
                    <button
                      onClick={() => deleteItem(realProduct.prodId)}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      {loading ? <Loader3 bg={"white"} /> : "On cart"}
                    </button>
                  ) : (
                    <button
                      onClick={() => addItemOncart(realProduct.prodId)}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      {loading ? <Loader3 bg={"white"} /> : "Add to cart"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <Loader3 />
          )}
        </div>
      ) : (
        <div>No product selected</div>
      )}
    </div>
  );
};

export default ProductPage;
