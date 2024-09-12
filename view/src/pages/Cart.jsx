import { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../../constants/ThemeContext";
import Navbar from "../components/Navbar";
import { CartContext } from "../../constants/cartItems";
import { Buffer } from "buffer";
import useProducts from "../../constants/products";
import { useNavigate } from "react-router-dom";
import { CurrentUserContext } from "../../constants/currentUser";

const CartPage = () => {
  const { theme } = useContext(ThemeContext);
  const { itemsOnCart } = useContext(CartContext);
  const { currentUser } = useContext(CurrentUserContext);
  const { products } = useProducts();
  const navigate = useNavigate();
  if (!itemsOnCart) {
    console.log("Your cart contains nothing");
  }
  const itemsInCart = products.filter((cartItem) =>
    itemsOnCart.some((product) => product.productId === cartItem._id)
  );

  const [quantities, setQuantities] = useState(itemsInCart.map(() => 1));
  const [subtotal, setSubtotal] = useState(1);

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

  return (
    <div className="bg-white dark:bg-black">
      <Navbar />
      {currentUser ? (
        <div
          className={`min-h-screen p-4 ${
            theme === "dark" ? "bg-gray-900" : "bg-gray-100"
          }`}
        >
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div
                className={`lg:col-span-2 p-4 rounded-lg shadow-md ${
                  theme === "dark"
                    ? "bg-gray-800 text-white"
                    : "bg-white text-black"
                }`}
              >
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
                      </tr>
                    </thead>
                    <tbody>
                      {itemsInCart.map((item, index) => (
                        <tr
                          key={index}
                          className={`${
                            theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                          }`}
                        >
                          <td className="p-2 flex items-center">
                            <img
                              src={`data:${
                                item.image.contentType
                              };base64,${Buffer.from(item.image.data).toString(
                                "base64"
                              )}`}
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
                              value={quantities[index] || 1}
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between mt-4">
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

              {/* Cart Summary */}
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
                      ${" "}
                      {isNaN(subtotal)
                        ? subtotal.toFixed(2)
                        : subtotal.toFixed(2)}
                    </span>{" "}
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total</span>
                    <span className="text-lg font-semibold">
                      $ {isNaN(subtotal) ? 0 : subtotal.toFixed(2)}
                    </span>
                  </div>
                </div>
                <button className="w-full mt-4 bg-green-500 text-white p-2 rounded-lg">
                  Proceed to checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className=" text-black h-screen dark:text-white bg-white dark:bg-black">
          <div className="my-10">
            <div className="flex flex-col justify-center items-start ssm:items-center text-start ssm:text-center p-5 font-bold text-xl">
              <h1 className="ssm:text-center">
                Dear user, You are not signed in. Better Create an account
              </h1>
              <h1 className="self-start ssm:self-center mt-4 ssm:mt-2">Or</h1>
              <h1 className="ssm:text-center font-semibold">
                Login into your account so that you can get the put products on
                your cart.
              </h1>
            </div>

            <div className="flex p-5 flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-5 my-10">
              <a href="/signup">
                <button className="bg-green-900 text-white py-2 px-4 sm:py-3 sm:px-5 rounded-md text-sm sm:text-base">
                  Sign Up
                </button>
              </a>
              <a href="/login">
                <button className="bg-green-900 text-white py-2 px-4 sm:py-3 sm:px-5 rounded-md text-sm sm:text-base">
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
