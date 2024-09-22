import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useProducts from "../../constants/products";
import { Buffer } from "buffer";
import Navbar from "../components/Navbar";
import { CartContext } from "../../constants/cartItems";

const ProductPage = () => {
  const { itemsOnCart, addItemOncart, deleteItem } = useContext(CartContext);
  const [realProduct, setRealProduct] = useState(null);
  const [isOnCart, setIsOnCart] = useState(false);
  const { products } = useProducts();
  const { prodId } = useParams();

  useEffect(() => {
    const product = products.find((product) => product._id === prodId);
    const isOnTheCart = itemsOnCart?.find((item) => item.productId == prodId);
    if (isOnTheCart) {
      setIsOnCart(true);
    } else {
      setIsOnCart(false);
    }
    setRealProduct(product || null);
  }, [prodId, products, itemsOnCart]);
  return (
    <div>
      <Navbar />
      {prodId ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {realProduct ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Product Image */}
              <div className="flex justify-center items-center bg-gray-100 p-4 rounded-lg">
                <img
                  src={`data:${
                    realProduct.image.contentType
                  };base64,${Buffer.from(realProduct.image.data).toString(
                    "base64"
                  )}`} // Ensure your product object contains an 'imageUrl' field
                  alt={realProduct.name}
                  className="w-full h-auto object-contain"
                />
              </div>

              {/* Product Details */}
              <div>
                <h2 className="text-3xl font-semibold text-gray-800 mb-4">
                  {realProduct.name}
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  {realProduct.description}
                </p>

                {/* Reviews */}
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    <span className="text-green-500 text-xl">★★★★★</span>
                    <span className="ml-2 text-sm text-gray-600">
                      (1000 Reviews)
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-2xl font-bold text-gray-800">
                    ${realProduct.price}
                  </span>
                  <p className="text-sm text-gray-500">
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
                      onClick={() => deleteItem(realProduct._id)}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      On cart
                    </button>
                  ) : (
                    <button
                      onClick={() => addItemOncart(realProduct._id)}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-2xl text-red-500">
              Product not found
            </div>
          )}
        </div>
      ) : (
        <div>No product selected</div>
      )}
    </div>
  );
};

export default ProductPage;
