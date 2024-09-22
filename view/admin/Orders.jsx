/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import useProducts from "../constants/products";
import { AiFillCloseCircle } from "react-icons/ai";
import { Buffer } from "buffer";
import { CgTrash } from "react-icons/cg";
import { toast } from "react-toastify";
import Loader from "../src/components/loader";
import { apiUrl } from "../src/lib/apis";

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
    setInterval(() => {
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
    }, 2000);
  }, [currentUser]);
  useEffect(() => {
    setFilteredOrders(offers.filter((order) => order.date == currentDate));
  }, [offers]);
  function handleDate(date) {
    const targetedOrders = offers.filter((order) => order.date == date);
    setFilteredOrders(targetedOrders);
  }
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
      method: "PATC
      H",
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
    return <Loader text="Loading orders ..." />;
  }
  return (
    <div>
      {offers.length == 0 ? (
        <div>No orders found</div>
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
            <div>
              <div className="flex items-start cursor-pointer justify-between">
                <div key={selectedOrder._id}>
                  <h1 className="font-bold text-2xl">
                    Customer Name: {selectedOrder.names}
                  </h1>
                  <h1>
                    <span className="font-bold">address: </span>
                    {selectedOrder.address}
                  </h1>
                  <h1>
                    <span className="font-bold">Email: </span>
                    {selectedOrder.email}
                  </h1>
                  <h1>
                    <span className="font-bold">Phone No: </span>
                    {selectedOrder.phoneNumber}
                  </h1>
                  <h1>
                    <span className="font-bold">Ordered on: </span>
                    {selectedOrder.date}
                  </h1>
                  <h1>
                    <span className="font-bold">Day: </span>
                    {selectedOrder.day}
                  </h1>
                  <h1>
                    <span className="font-bold">At: </span>
                    {selectedOrder.time}
                  </h1>
                  <h1>
                    <span className="font-bold">Amount to pay: </span>RWF
                    {selectedOrder.amount}
                  </h1>
                </div>
                <AiFillCloseCircle
                  onClick={() => setOpenOfferModal(false)}
                  className="text-3xl hover:text-red-500"
                />
              </div>
              <h1 className="my-5 font-bold text-3xl">Selected products</h1>
              <div>
                {boughtProducts.length == 0 ? (
                  <h1>Loading products ...</h1>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {boughtProducts.map((item) => (
                      <div
                        key={item._id}
                        className="bg-white p-4 w-24 rounded-lg shadow-md"
                      >
                        <div className="flex justify-center">
                          <img
                            src={`data:${
                              item.image.contentType
                            };base64,${Buffer.from(item.image.data).toString(
                              "base64"
                            )}`}
                            className="w-64 h-64 object-cover rounded-md"
                            alt={item.name}
                          />
                        </div>
                        <div className="mt-4 text-center">
                          <h2 className="text-lg font-semibold">{item.name}</h2>
                          <p className="text-gray-700 text-base font-medium">
                            RWF {item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <h1 className="my-10 font-bold text-3xl">Transaction Method</h1>
                <h1>{selectedOrder.paymentMethod}</h1>
                <div className="my-5">
                  <h1 className="font-bold text-3xl">Options</h1>
                  <div className="flex gap-5 my-4">
                    {AdminOptions ? (
                      <button
                        onClick={(e) => handleApprove(selectedOrder, e)}
                        className={`bg-green-500 text-white hover:bg-green-700 p-4 px-10 rounded-md`}
                      >
                        Approve
                      </button>
                    ) : null}
                    <div
                      onClick={() => handleDecline(selectedOrder)}
                      className="flex items-center cursor-pointer  text-red-500 hover:bg-gray-200 p-4 px-10 rounded-md"
                    >
                      <button>Decline</button>
                      (<CgTrash className="text-red-500" />)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <table className="w-full">
              <tr className="bg-gray-200 p-10 h-16">
                <th>Name</th>
                <th>Address</th>
                <th>Number of products</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center content-center">
                    {" "}
                    No orders available on the selected date
                  </td>
                </tr>
              ) : (
                filteredOrders.map((item) => (
                  <tr
                    onClick={() => handleOfferClick(item)}
                    key={item._id}
                    className="border text-center border-gray-200 h-16 cursor-pointer bg-white hover:bg-blue-500 text-black hover:text-white"
                  >
                    <td>{item.names}</td>
                    <td>{item.address}</td>
                    <td>{item.products.length}</td>
                    <td>{item.date}</td>
                    <td>{item.time}</td>
                    {item.approved == true ? (
                      <td>Approved</td>
                    ) : (
                      <td>Pending</td>
                    )}
                  </tr>
                ))
              )}
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default Orders;
