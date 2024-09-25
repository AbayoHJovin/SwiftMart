/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import useProducts from "../constants/products";
import { AiFillCloseCircle } from "react-icons/ai";
import { Buffer } from "buffer";
import { CgTrash } from "react-icons/cg";
import { toast } from "react-toastify";
import { apiUrl } from "../src/lib/apis";
import Loader2 from "../src/components/loader2";

const Orders = ({ AdminOptions, currentUser }) => {
  const now = new Date();
  const currentDate = now.toISOString().split("T")[0];
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredOrders, setFilteredOrders] = useState(offers);
  const [openOfferModal, setOpenOfferModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState({});
  const [boughtProducts, setBoughtProducts] = useState([]);
  const { products } = useProducts();
  useEffect(() => {
    setLoading(true);
  }, []);
  useEffect(() => {
    if (!currentUser) {
      fetch(`${apiUrl}/getOffer`, {
        method: "GET",
      })
        .then((resp) => resp.json())
        .then((message) => {
          setOffers(message.message);
          setLoading(false);
        })
        .catch((e) => console.error(e));
    } else {
      fetch(`${apiUrl}/getOffer?userId=${currentUser}`, {
        method: "GET",
      })
        .then((resp) => resp.json())
        .then((message) => {
          setOffers(message.message);
          setLoading(false);
        })
        .catch((e) => console.error(e));
    }
  }, [currentUser]);

  useEffect(() => {
    const todayOrders = offers.filter((order) => order.date === currentDate);
    setFilteredOrders(todayOrders);
  }, [offers, currentDate]);

  const handleDate = (date) => {
    const targetedOrders = offers.filter((order) => order.date === date);
    setFilteredOrders(targetedOrders);
  };

  function handleOfferClick(item) {
    setOpenOfferModal(true);
    const prod = [];
    for (let i = 0; i < item.products.length; i++) {
      const filteredProducts = products.filter(
        (items) => items._id === item.products[i]
      );
      if (filteredProducts.length > 0) {
        prod.push(filteredProducts[0]);
      }
    }
    setSelectedOrder(item);
    setBoughtProducts(prod);
  }
  function handleDecline(order) {
    fetch(`${apiUrl}/removeOrder?offerId=${order._id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((message) => {
        location.reload();
        toast.success("Order Removed");
        setOpenOfferModal(false);
      })
      .catch((e) => console.error(e));
  }
  function handleApprove(order, e) {
    fetch(`${apiUrl}/updateOrder?offerId=${order._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message == "Offer Approved") {
          e.target.innerText = "Approved";
        }
      })
      .catch((e) => console.error(e));
  }
  if (loading) {
    return <Loader2 />;
  }
  return (
    <div className="px-5">
      {offers.length == 0 ? (
        <div className="flex justify-center items-center h-screen text-center content-center">
          <h1>No orders found</h1>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between px-10 my-10">
            {AdminOptions ? (
              <div className="flex flex-col">
                <div className="font-bold text-2xl">Orders</div>
                <div>{offers.length} Orders found</div>
              </div>
            ) : null}
            <input
              onInput={(e) => handleDate(e.target.value)}
              defaultValue={currentDate}
              type="date"
              className="border border-gray-200 text-black px-5 h-10"
            />
          </div>
          {openOfferModal ? (
            <div className="p-6 bg-green-100 rounded-lg shadow-lg">
              <div className="flex items-start justify-between">
                <div key={selectedOrder._id}>
                  <h1 className="font-bold text-3xl text-green-700 mb-4">
                    Customer Name: {selectedOrder.names}
                  </h1>
                  <p className="text-lg mb-2">
                    <span className="font-semibold text-green-600">
                      Address:{" "}
                    </span>
                    {selectedOrder.address}
                  </p>
                  <p className="text-lg mb-2">
                    <span className="font-semibold text-green-600">
                      Email:{" "}
                    </span>
                    {selectedOrder.email}
                  </p>
                  <p className="text-lg mb-2">
                    <span className="font-semibold text-green-600">
                      Phone No:{" "}
                    </span>
                    {selectedOrder.phoneNumber}
                  </p>
                  <p className="text-lg mb-2">
                    <span className="font-semibold text-green-600">
                      Ordered on:{" "}
                    </span>
                    {selectedOrder.date}
                  </p>
                  <p className="text-lg mb-2">
                    <span className="font-semibold text-green-600">Day: </span>
                    {selectedOrder.day}
                  </p>
                  <p className="text-lg mb-2">
                    <span className="font-semibold text-green-600">At: </span>
                    {selectedOrder.time}
                  </p>
                  <p className="text-lg mb-2">
                    <span className="font-semibold text-green-600">
                      Amount to pay:{" "}
                    </span>
                    RWF {selectedOrder.amount}
                  </p>
                </div>
                <AiFillCloseCircle
                  onClick={() => setOpenOfferModal(false)}
                  className="text-4xl text-red-500 hover:text-red-700 cursor-pointer"
                  size={30}
                />
              </div>

              <h1 className="my-6 font-bold text-4xl text-green-700">
                Selected Products
              </h1>
              <div>
                {boughtProducts.length === 0 ? (
                  <h1>Loading products ...</h1>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {boughtProducts.map((item) => (
                      <div
                        key={item._id}
                        className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                      >
                        <div className="flex justify-center mb-4">
                          <img
                            src={`data:${
                              item.image.contentType
                            };base64,${Buffer.from(item.image.data).toString(
                              "base64"
                            )}`}
                            className="w-80 h-80 object-cover rounded-lg"
                            alt={item.name}
                          />
                        </div>
                        <div className="text-center">
                          <h2 className="text-2xl font-bold text-green-700">
                            {item.name}
                          </h2>
                          <p className="text-lg text-green-600 mt-2">
                            RWF {item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <h1 className="mt-10 mb-3 font-bold text-3xl text-green-700">
                Transaction Method
              </h1>
              <p className="text-xl mb-10 text-green-600">
                {selectedOrder.paymentMethod}
              </p>

              <div className="my-8">
                <h1 className="font-bold text-3xl text-green-700">Options</h1>
                <div className="flex gap-5 mt-4">
                  {AdminOptions && (
                    <button
                      onClick={(e) => handleApprove(selectedOrder, e)}
                      className="bg-green-500 text-white hover:bg-green-600 py-3 px-6 rounded-md"
                    >
                      Approve
                    </button>
                  )}
                  <div
                    onClick={() => handleDecline(selectedOrder)}
                    className="flex items-center cursor-pointer text-red-500 hover:bg-gray-200 py-3 px-6 rounded-md"
                  >
                    <button>Decline</button>
                    <CgTrash className="ml-2 text-xl" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="container mx-auto p-4">
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="bg-green-200 h-4 rounded-full">
                      <th className="p-4 border-b text-left text-sm w-1/6 rounded-l-md">
                        Name
                      </th>
                      <th className="p-4 border-b text-left text-sm w-1/6">
                        Address
                      </th>
                      <th className="p-4 border-b text-left text-sm w-1/6">
                        Number of products
                      </th>
                      <th className="p-4 border-b text-left text-sm w-1/6">
                        Date
                      </th>
                      <th className="p-4 border-b text-left text-sm w-1/6">
                        Time
                      </th>
                      <th className="p-4 border-b text-left text-sm w-1/6 rounded-r-md">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="text-center content-center p-4 border-b text-sm truncate"
                        >
                          No orders available on the selected date
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((item) => (
                        <tr
                          onClick={() => handleOfferClick(item)}
                          key={item._id}
                          className="border text-center border-gray-200 h-16 cursor-pointer bg-white hover:bg-gray-50 text-black rounded-md"
                        >
                          <td className="p-4 border-b text-sm truncate rounded-l-md">
                            {item.names}
                          </td>
                          <td className="p-4 border-b text-sm truncate">
                            {item.address}
                          </td>
                          <td className="p-4 border-b text-sm truncate">
                            {item.products.length}
                          </td>
                          <td className="p-4 border-b text-sm truncate">
                            {item.date}
                          </td>
                          <td className="p-4 border-b text-sm truncate">
                            {item.time}
                          </td>
                          <td className="p-4 border-b text-sm truncate rounded-r-md">
                            {item.approved ? "Approved" : "Pending"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Orders;
