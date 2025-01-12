/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import useProducts from "../constants/products";
import { AiFillCloseCircle } from "react-icons/ai";
import { CgTrash } from "react-icons/cg";
import { toast } from "react-toastify";
import { apiUrl } from "../src/lib/apis";
import { OffersContext } from "../constants/Offers";
import { CurrentUserContext } from "../constants/currentUser";
import Loader3 from "../src/components/Loading3";
import Loader2 from "../src/components/loader2";
import UseUsers from "../constants/Users";

const Orders = ({ AdminOptions, currentUser }) => {
  const now = new Date();
  const currentDate = now.toISOString().split("T")[0];
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredOrders, setFilteredOrders] = useState(offers);
  const [openOfferModal, setOpenOfferModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState([]);
  const [boughtProducts, setBoughtProducts] = useState([]);
  const [isApproving, setIsApproving] = useState(false);
  const { products } = useProducts();
  const { users } = UseUsers();
  const { currentUser: userWithAllCredentials } =
    useContext(CurrentUserContext);
  const { allOffers, isLoading } = useContext(OffersContext);
  useEffect(() => {
    setLoading(true);
  }, []);
  useEffect(() => {
    if (isLoading) {
      setLoading(true);
    }
  }, [isLoading]);
  useEffect(() => {
    if (AdminOptions) {
      setOffers(allOffers);
    } else {
      fetch(`${apiUrl}/getOffer?userId=${currentUser}`, {
        method: "GET",
      })
        .then((resp) => resp.json())
        .then((message) => {
          setOffers(message.orders);
        })
        .catch((e) => console.error(e))
        .finally(() => setLoading(false));
    }
  }, [AdminOptions, allOffers, currentUser]);
  useEffect(() => {
    if (offers && currentDate) {
      const todayOrders = offers.filter((order) => {
        const orderDate = order.orderDate.split(" ")[0];
        return orderDate === currentDate;
      });
      setFilteredOrders(todayOrders);
    }
  }, [offers, currentDate]);

  const handleDate = (date) => {
    if (offers) {
      const targetedOrders = offers.filter((order) => {
        const orderDate = order.orderDate.split(" ")[0];
        return orderDate === date;
      });
      setFilteredOrders(targetedOrders);
    }
  };

  function handleOfferClick(item) {
    setOpenOfferModal(true);
    const prod = [];
    for (let i = 0; i < item.orderItems?.length; i++) {
      const filteredProducts = products.filter(
        (items) => items.prodId === item.orderItems[i].productId
      );
      if (filteredProducts?.length > 0) {
        prod.push(...filteredProducts);
      }
    }
    setSelectedOrder(item);
    setBoughtProducts(prod);
  }
  function handleDecline(order) {
    fetch(`${apiUrl}/removeOrder?offerId=${order.orderId}`, {
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
    setIsApproving(true);
    fetch(`${apiUrl}/updateOrder?offerId=${order.orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message == "Offer Approved") {
          e.target.innerText = "Approved";
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setIsApproving(false));
  }
  useEffect(() => {}, [boughtProducts]);
  return (
    <div className="px-0 md:px-5 mx-0 text-black dark:text-white">
      {offers?.length == 0 ? (
        <div className="flex justify-center items-center h-screen text-center content-center">
          <h1>No orders found</h1>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between px-10 my-10">
            {AdminOptions ? (
              <div className="flex flex-col">
                <div className="font-bold text-2xl">Orders</div>
                <div>{offers?.length} Orders found</div>
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
                <div key={selectedOrder.orderId}>
                  <h1 className="font-bold text-3xl text-green-700 mb-4">
                    Customer Name:{" "}
                    {AdminOptions
                      ? users.find((u) => u.userId === selectedOrder.ordererId)
                          ?.username
                      : userWithAllCredentials.username}
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
                    {AdminOptions
                      ? users.find((u) => u.userId === selectedOrder.ordererId)
                          ?.email
                      : userWithAllCredentials.email}
                  </p>
                  <p className="text-lg mb-2">
                    <span className="font-semibold text-green-600">
                      Phone No:{" "}
                    </span>
                    {selectedOrder.phoneNo}
                  </p>
                  <p className="text-lg mb-2">
                    <span className="font-semibold text-green-600">
                      Ordered on:{" "}
                    </span>
                    {selectedOrder.orderDate.split(" ")[0]}
                  </p>

                  <p className="text-lg mb-2">
                    <span className="font-semibold text-green-600">At: </span>
                    {selectedOrder.orderDate.split(" ")[1]}
                  </p>
                  <p className="text-lg mb-2">
                    <span className="font-semibold text-green-600">
                      Amount to pay:{" "}
                    </span>
                    RWF {selectedOrder.price}
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
                {boughtProducts?.length < 1 ? (
                  <h1>Loading products ...</h1>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {boughtProducts?.map((item) => (
                      <div
                        key={item.prodId}
                        className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                      >
                        <div className="flex justify-center mb-4">
                          <img
                            src={item.image}
                            width={100}
                            height={100}
                            alt={item.prodName}
                          />
                        </div>

                        <div className="text-center">
                          <h2 className="text-2xl font-bold text-green-700">
                            {item.prodName}
                          </h2>
                          <p className="text-lg text-green-600 mt-2">
                            RWF {item.price?.toFixed(2)}
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
              <div>
                <h1 className="mt-10 mb-3  font-bold text-3xl text-green-700">
                  Receipt
                </h1>
                <img
                  src={selectedOrder.transactionUrl}
                  alt="transaction Image"
                />
              </div>
              <div className="my-8">
                <h1 className="font-bold text-3xl text-green-700">Options</h1>
                <div className="flex gap-5 mt-4">
                  {AdminOptions &&
                    (isApproving ? (
                      <button className="bg-green-500 text-white hover:bg-green-600 py-3 px-6 rounded-md">
                        <Loader3 bg={"white"} />
                      </button>
                    ) : (
                      <button
                        onClick={(e) => handleApprove(selectedOrder, e)}
                        className="bg-green-500 text-white hover:bg-green-600 py-3 px-6 rounded-md"
                      >
                        Approve
                      </button>
                    ))}
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
                <table className="min-w-full bg-white rounded-lg shadow-lg">
                  <thead className="rounded-full">
                    <tr className="bg-green-600 uppercase text-sm">
                      {AdminOptions && (
                        <th className="p-4 text-left text-sm font-semibold  text-white dark:text-gray-200">
                          Name
                        </th>
                      )}
                      {AdminOptions && (
                        <th className="p-4 text-left text-sm font-semibold text-white dark:text-gray-200">
                          Address
                        </th>
                      )}
                      <th className="p-4 text-left text-sm font-semibold text-white dark:text-gray-200">
                        Number of products
                      </th>
                      <th className="p-4 text-left text-sm font-semibold text-white dark:text-gray-200">
                        Date
                      </th>
                      <th className="p-4 text-left text-sm font-semibold text-white dark:text-gray-200">
                        Time
                      </th>
                      <th className="p-4 text-left text-sm font-semibold text-white dark:text-gray-200">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-4 divide-gray-200">
                    {filteredOrders?.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="text-center content-center p-4 border-b text-sm truncate"
                        >
                          No orders available on the selected date
                        </td>
                      </tr>
                    ) : (
                      filteredOrders?.map((item, index) => (
                        <tr
                          onClick={() => handleOfferClick(item)}
                          key={item.index}
                          className={`border-b-2 border-black cursor-pointer items-center content-center ${
                            index % 2 === 0
                              ? "bg-gray-100 hover:bg-green-500 hover:text-white"
                              : "bg-gray-200 hover:bg-green-500 hover:text-white"
                          }`}
                        >
                          {AdminOptions && (
                            <td>
                              {
                                users.find((u) => u.userId === item.ordererId)
                                  ?.username
                              }
                            </td>
                          )}
                          {AdminOptions && (
                            <td className="p-4 text-sm  dark:text-gray-200  truncate">
                              {item.address}
                            </td>
                          )}
                          <td className="p-4 text-sm  dark:text-gray-200  truncate">
                            {item.orderItems?.length}
                          </td>
                          <td className="p-4 text-sm dark:text-gray-200  truncate">
                            {item.orderDate.split(" ")[0]}
                          </td>
                          <td className="p-4 text-sm   dark:text-gray-200 truncate">
                            {item.orderDate.split(" ")[1]}
                          </td>
                          <td className="p-4 text-sm  dark:text-gray-200 truncate rounded-r-md">
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
