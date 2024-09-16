import { useEffect, useState } from "react";
import useProducts from "../constants/products";
import { AiFillCloseCircle } from "react-icons/ai";
import { Buffer } from "buffer";

const Orders = () => {
  const [offers, setOffers] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState(offers);
  const [openOfferModal, setOpenOfferModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState({});
  const [bougthProducts, setBoughtProducts] = useState([]);
  const { products } = useProducts();
  useEffect(() => {
    fetch("http://localhost:5000/getOffer", {
      method: "GET",
    })
      .then((resp) => resp.json())
      .then((message) => {
        setOffers(message.message);
      })
      .catch((e) => console.error(e));
  }, []);
  function handleDate(date) {
    const targetedOrders = offers.filter((order) => order.date == date);
    setFilteredOrders(targetedOrders);
  }
  function handleOfferClick(item) {
    setOpenOfferModal(true);
    const prod = [];

    for (let i = 0; i < item.products.length; i++) {
      console.log(products.find((items) => items._id == item.products[i]));
   }
    setSelectedOrder(item);
    setBoughtProducts(prod);
  }
  useEffect(() => {
    console.log("Here are the bought prods", bougthProducts);
  }, [bougthProducts]);
  return (
    <div>
      {offers.length == 0 ? (
        <div>No orders found</div>
      ) : (
        <div>
          <div className="flex items-center justify-between px-10 my-10">
            <div className="flex flex-col">
              <div className="font-bold text-2xl">Orders</div>
              <div>{offers.length} Orders found</div>
            </div>
            <input
              onInput={(e) => handleDate(e.target.value)}
              type="date"
              className="border border-gray-200 text-black px-5 h-10"
            />
          </div>
          {openOfferModal ? (
            // selectedOrder.map((order) => (
            <div>
              <div className="flex items-start cursor-pointer justify-between">
                <div key={selectedOrder._id}>
                  <h1 className="font-bold text-2xl">{selectedOrder.names}</h1>
                  <h1>{selectedOrder.address}</h1>
                  <h1>{selectedOrder.email}</h1>
                  <h1>{selectedOrder.phoneNumber}</h1>
                  <h1>{selectedOrder.date}</h1>
                  <h1>{selectedOrder.day}</h1>
                  <h1>{selectedOrder.time}</h1>
                  <h1>Amount : RWF{selectedOrder.amount}</h1>
                </div>
                <AiFillCloseCircle
                  onClick={() => setOpenOfferModal(false)}
                  className="text-3xl hover:text-red-500"
                />
              </div>
              <div>
                {bougthProducts.length == 0 ? (
                  <h1>Loading products ...</h1>
                ) : (
                  bougthProducts.map((item) => (
                    <div key={item._id}>
                      <div className="grid grid-cols-3 bg-red-500">
                        <img
                          src={`data:${
                            item.image.contentType
                          };base64,${Buffer.from(item.image.data).toString(
                            "base64"
                          )}`}
                          className="w-16"
                          alt={item.name}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            // ))
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
