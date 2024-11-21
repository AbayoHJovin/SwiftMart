import { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../../constants/ThemeContext";
import Navbar from "../components/Navbar";
import { CartContext } from "../../constants/cartItems";
import { Buffer } from "buffer";
import useProducts from "../../constants/products";
import { useNavigate } from "react-router-dom";
import { CurrentUserContext } from "../../constants/currentUser";
import { toast, ToastContainer } from "react-toastify";
import { FaTimesCircle } from "react-icons/fa";
import Loader3 from "../components/Loading3";
const CartPage = () => {
  const { theme } = useContext(ThemeContext);
  const { itemsOnCart, deleteItem } = useContext(CartContext);
  const { currentUser } = useContext(CurrentUserContext);
  const { products } = useProducts();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState([]);
  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    if (itemsOnCart && itemsOnCart.length > 0) {
      setLoading(false);
    }
  }, [itemsOnCart]);

  const itemsInCart = products.filter((cartItem) =>
    itemsOnCart?.some((product) => product.productId === cartItem._id)
  );

  useEffect(() => {
    if (itemsOnCart && itemsOnCart.length === 0) {
      goToShop();
    } else {
      setQuantities(itemsInCart.map(() => 1));
    }
  }, [itemsOnCart, loading]);

  useEffect(() => {
    const newSubtotal = itemsInCart.reduce(
      (total, item, index) => total + item.price * quantities[index],
      0
    );
    setSubtotal(newSubtotal);
  }, [quantities, itemsInCart]);

  const handleQuantityChange = (index, value) => {
    const newQuantities = [...quantities];
    newQuantities[index] = value;
    setQuantities(newQuantities);
  };

  function handleCheck() {
    if (isNaN(subtotal) || subtotal < 100) {
      toast.error("Please enter a valid amount");
    } else {
      navigate(`/checkout/RWF${subtotal}`);
    }
  }

  function goToShop() {
    return (
      <div className="flex h-screen flex-col justify-center items-center content-center">
        <h1 className="text-black dark:text-white">
          No item is found in your cart.
        </h1>
        <button
          onClick={() => navigate("/shop/Both/pants")}
          className="bg-green-900 text-white my-2 p-3 px-5 rounded-md"
        >
          Shop Now
        </button>
      </div>
    );
  }

  // Render the component
  return (
    <div className="bg-white dark:bg-black text-black dark:text-white">
      <ToastContainer />
      <Navbar />
      {currentUser ? (
        <div
          className={`min-h-screen p-4 ${
            theme === "dark" ? "bg-black" : "bg-gray-100"
          }`}
        >
          <div className="container mx-auto">
            {loading ? (
              <div className="flex justify-center">
                <Loader3 /> {/* Display Loader3 while fetching cart items */}
              </div>
            ) : itemsOnCart.length === 0 ? (
              goToShop() // If no items in cart, show 'Go to Shop' component
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className={`lg:col-span-2 p-4 rounded-lg`}>
                  <h2 className="text-lg font-semibold mb-4">Shopping Cart</h2>

                  <div className="overflow-x-auto">
                    <table className="min-w-full table-auto">
                      <thead>
                        <tr
                          className={`${
                            theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                          }`}
                        >
                          <th className="p-2 text-left">Product</th>
                          <th className="p-2 text-left">Price</th>
                          <th className="p-2 text-left">Quantity</th>
                          <th className="p-2 text-left">Subtotal</th>
                          <th className="p-2 text-left"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr>
                            <td colSpan="5" className="p-2 text-center">
                              <Loader3 />
                            </td>
                          </tr>
                        ) : itemsInCart.length > 0 ? (
                          itemsInCart.map((item, index) => (
                            <tr
                              key={index}
                              className={`${
                                theme === "dark" ? "bg-black" : "bg-gray-100"
                              }`}
                            >
                              <td className="p-2 flex items-center">
                                <img
                                  src={`data:${
                                    item.image.contentType
                                  };base64,${Buffer.from(
                                    item.image.data
                                  ).toString("base64")}`}
                                  alt={item.name}
                                  className="w-16 h-16 object-cover rounded-lg"
                                />
                                <span className="ml-4 hidden lg:inline-block">
                                  {item.name}
                                </span>
                              </td>
                              <td className="p-2">${item.price.toFixed(2)}</td>
                              <td className="p-2">
                                <input
                                  type="number"
                                  className="p-2 border rounded-lg dark:bg-gray-600 dark:text-white bg-white text-black"
                                  min={1}
                                  max={item.stock}
                                  value={quantities[index] || 0}
                                  onChange={(e) =>
                                    handleQuantityChange(
                                      index,
                                      parseInt(e.target.value)
                                    )
                                  }
                                />
                              </td>
                              <td className="p-2">
                                $
                                {isNaN(item.price * quantities[index])
                                  ? item.price
                                  : (item.price * quantities[index]).toFixed(2)}
                              </td>
                              <td
                                onClick={() => deleteItem(item.prodId)}
                                className="cursor-pointer"
                              >
                                <FaTimesCircle />
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <Loader3 />
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex flex-col items-center gap-4 smm:flex-row justify-between mt-4">
                    <button
                      onClick={() => navigate("/shop")}
                      className={`px-4 py-2 rounded-lg ${
                        theme === "dark"
                          ? "bg-gray-700 text-white"
                          : "bg-gray-200 text-black"
                      }`}
                    >
                      Return To Shop
                    </button>
                    <button className="px-4 py-2 bg-green-500 text-white rounded-lg">
                      Update Cart
                    </button>
                  </div>
                </div>

                <div
                  className={`p-4 rounded-lg shadow-md ${
                    theme === "dark"
                      ? "bg-gray-800 text-white"
                      : "bg-white text-black"
                  }`}
                >
                  <h2 className="text-lg font-semibold mb-4">Cart Total</h2>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>
                        $ {isNaN(subtotal) ? 0 : subtotal.toFixed(2)}
                      </span>{" "}
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery cost</span>
                      <span>Free</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total</span>
                      <span className="text-lg font-semibold">
                        $ {isNaN(subtotal) ? 0 : subtotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleCheck}
                    className="w-full mt-4 bg-green-500 text-white p-2 rounded-lg"
                  >
                    Proceed to checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center min-h-screen text-black dark:text-white p-5">
          <div className="mb-10 p-5 sm:p-10 rounded-lg bg-white dark:bg-black w-full max-w-md">
            <div className="flex flex-col justify-center items-start ssm:items-center text-start ssm:text-center">
              <h1 className="ssm:text-center my-5 font-bold text-2xl sm:text-xl">
                Not signed in!
              </h1>
              <h1 className="ssm:text-center text-base sm:text-lg">
                Log in or create an account to improve your shopping experience.
              </h1>
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-5 mt-5">
              <a href="/signup">
                <button className="bg-[#6ed629] text-white py-2 px-4 sm:py-3 sm:px-5 rounded-md text-sm sm:text-base">
                  Sign Up
                </button>
              </a>
              <a href="/login">
                <button className="bg-[#6ed629] text-white py-2 px-4 sm:py-3 sm:px-5 rounded-md text-sm sm:text-base">
                  Login
                </button>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
