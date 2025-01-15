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
import OrderTable from "../src/components/OrderTable";
import OfferModal from "../src/components/OfferModal";

const Orders = ({ AdminOptions, currentUser }) => {
  const now = new Date();
  const currentDate = now.toISOString().split("T")[0];
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredOrders, setFilteredOrders] = useState(offers);
  const [openOfferModal, setOpenOfferModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState([]);
  const [boughtProducts, setBoughtProducts] = useState([]);
  const [quantities, setQuantities] = useState([]);
  const [isApproving, setIsApproving] = useState(false);
  const [activeTab, setActiveTab] = useState("Date");
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
    console.log("offers", offers);
  }, []);
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
    setQuantities(item.orderItems.map((item) => item.quantity));
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
  const handleTabSwitch = (tab) => {
    // setShowContent(false);
    setTimeout(() => {
      setActiveTab(tab);
      // setShowContent(true);
    }, 300); // Delay for transition effect
  };

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
            <OfferModal
              selectedOrder={selectedOrder}
              AdminOptions={AdminOptions}
              users={users}
              userWithAllCredentials={userWithAllCredentials}
              setOpenOfferModal={setOpenOfferModal}
              quantities={quantities}
              boughtProducts={boughtProducts}
              isApproving={isApproving}
              handleApprove={handleApprove}
              handleDecline={handleDecline}
            />
          ) : (
            <OrderTable
              filteredOrders={filteredOrders}
              AdminOptions={AdminOptions}
              handleOfferClick={handleOfferClick}
              users={users}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Orders;
