import { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../../constants/ThemeContext";
import Navbar from "../components/Navbar";
import { CartContext } from "../../constants/cartItems";
import useProducts from "../../constants/products";
import { useNavigate } from "react-router-dom";
import { CurrentUserContext } from "../../constants/currentUser";
import { toast, ToastContainer } from "react-toastify";
import { FaTimesCircle } from "react-icons/fa";
import Loader3 from "../components/Loading3";
import { message } from "antd";

const CartPage = () => {
  const { theme } = useContext(ThemeContext);
  const { itemsOnCart, deleteItem, updateCart, UpdateResponse, isUpdating } =
    useContext(CartContext);
  const { currentUser } = useContext(CurrentUserContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [updated, setUpdated] = useState([]);

  useEffect(() => {
    if (itemsOnCart) {
      if (itemsOnCart.length > 0) {
        setQuantities(itemsOnCart.map((item) => item.quantity));
      }
      setLoading(false);
    }
  }, [itemsOnCart]);
  // eslint-disable-next-line react-hooks/exhaustive-deps

  function updateCartQuantities() {
    const updatedArray = [];

    for (let i = 0; i < itemsOnCart.length; i++) {
      updatedArray.push({
        id: itemsOnCart[i].id,
        quantity: quantities[i],
      });
      console.log(quantities[i]);
    }

    setUpdated(updatedArray);

    for (let i = 0; i < itemsOnCart.length; i++) {
      itemsOnCart[i].quantity = quantities[i];
    }
  }

  // Update cart total whenever quantities or itemsOnCart change
  useEffect(() => {
    const newCartTotal = itemsOnCart.reduce(
      (total, item, index) => total + item.product.price * quantities[index],
      0
    );
    setCartTotal(newCartTotal);
  }, [quantities, itemsOnCart]);

  const handleQuantityChange = (index, value) => {
    if (value < 1) return;
    const newQuantities = [...quantities];
    newQuantities[index] = value;
    setQuantities(newQuantities); // This will trigger the useEffect below
  };
  // Use a useEffect to update the cart quantities whenever 'quantities' changes
  useEffect(() => {
    const updatedArray = itemsOnCart.map((item, index) => ({
      id: item.id,
      quantity: quantities[index],
    }));

    setUpdated(updatedArray);

    // Update the actual quantities in the itemsOnCart (if needed elsewhere)
    itemsOnCart.forEach((item, index) => {
      item.quantity = quantities[index];
    });
  }, [quantities, itemsOnCart]);

  const handleCheck = () => {
    if (isNaN(cartTotal) || cartTotal < 1) {
      toast.error("Please enter a valid amount");
    } else {
      handleUpdate();
      navigate(`/checkout`, { state: { cartTotal } });
    }
  };
  function handleUpdate() {
    updateCart(updated);
  }
  const formatNumber = (number) => {
    return new Intl.NumberFormat("en-US").format(number);
  };
  useEffect(() => {
    if (UpdateResponse) {
      if (UpdateResponse === "Insufficient stock for product.") {
        message.error("Insufficient stock for product.");
      } else {
        message.success("Cart updated");
      }
    }
  }, [UpdateResponse]);

  const goToShop = () => (
    <div className="flex h-screen flex-col justify-center items-center content-center">
      <h1 className="text-black dark:text-white">
        No item is found in your cart.
      </h1>
      <button
        onClick={() => navigate("/shop/Unisex/pants")}
        className="bg-green-900 text-white my-2 p-3 px-5 rounded-md"
      >
        Shop Now
      </button>
    </div>
  );

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
                <Loader3 />
              </div>
            ) : !itemsOnCart || itemsOnCart.length === 0 ? (
              goToShop()
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
                          <th className="p-2 text-left">Quantity in Stock</th>
                          <th className="p-2 text-left">Quantity</th>
                          <th className="p-2 text-left">Subtotal</th>
                          <th className="p-2 text-left"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {itemsOnCart.map((item, index) => (
                          <tr
                            key={index}
                            className={`${
                              theme === "dark" ? "bg-black" : "bg-gray-100"
                            }`}
                          >
                            <td className="p-2 flex items-center">
                              <img
                                src={item.product.image}
                                alt={item.product.prodName}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                              <span className="ml-4 hidden lg:inline-block">
                                {item.product.prodName}
                              </span>
                            </td>
                            <td className="p-2">
                              RWF {item.product.price.toFixed(2)}
                            </td>
                            <td className="p-2">{item.product.stock}</td>
                            <td className="p-2">
                              <input
                                type="number"
                                className="p-2 border rounded-lg dark:bg-gray-600 dark:text-white bg-white text-black"
                                min={1}
                                max={item.product.stock}
                                value={quantities[index]}
                                onChange={(e) =>
                                  handleQuantityChange(
                                    index,
                                    parseInt(e.target.value)
                                  )
                                }
                              />
                            </td>
                            <td className="p-2">
                              RWF{" "}
                              {(item.product.price * quantities[index]).toFixed(
                                2
                              )}
                            </td>
                            <td
                              onClick={() => deleteItem(item.product.prodId)}
                              className="cursor-pointer"
                            >
                              <FaTimesCircle />
                            </td>
                          </tr>
                        ))}
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
                    <button
                      onClick={handleUpdate}
                      disabled={isUpdating}
                      className={`px-4 py-2 bg-green-500 text-white rounded-lg ${
                        isUpdating && "cursor-not-allowed opacity-50"
                      }`}
                    >
                      {isUpdating ? "Updating cart" : "Update Cart"}
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
                      <span>RWF {formatNumber(cartTotal.toFixed(2))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery cost</span>
                      <span>Free</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total</span>
                      <span className="text-lg font-semibold">
                        RWF {formatNumber(cartTotal.toFixed(2))}
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
