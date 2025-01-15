import { AiFillCloseCircle } from "react-icons/ai";
import { CgTrash } from "react-icons/cg";
import Loader3 from "./Loading3";

/* eslint-disable react/prop-types */
export default function OfferModal({
  selectedOrder,
  AdminOptions,
  users,
  userWithAllCredentials,
  setOpenOfferModal,
  quantities,
  boughtProducts,
  isApproving,
  handleApprove,
  handleDecline,
}) {
  return (
    <div className="p-6  rounded-lg shadow-lg">
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
            <span className="font-semibold text-green-600">Address: </span>
            {selectedOrder.address}
          </p>
          <p className="text-lg mb-2">
            <span className="font-semibold text-green-600">Email: </span>
            {AdminOptions
              ? users.find((u) => u.userId === selectedOrder.ordererId)?.email
              : userWithAllCredentials.email}
          </p>
          <p className="text-lg mb-2">
            <span className="font-semibold text-green-600">Phone No: </span>
            {selectedOrder.phoneNo}
          </p>
          <p className="text-lg mb-2">
            <span className="font-semibold text-green-600">Ordered on: </span>
            {selectedOrder.orderDate.split(" ")[0]}
          </p>

          <p className="text-lg mb-2">
            <span className="font-semibold text-green-600">At: </span>
            {selectedOrder.orderDate.split(" ")[1]}
          </p>
          <p className="text-lg mb-2">
            <span className="font-semibold text-green-600">Amount paid: </span>
            RWF {new Intl.NumberFormat("en-US").format(selectedOrder.price)}
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
            {boughtProducts?.map((item, index) => (
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
                  <h2 className="text-xl font-bold text-green-700">
                    {item.prodName}
                    <span className="text-green-600 mx-2">
                      (&times; {quantities[index]})
                    </span>
                  </h2>
                  <p className="text-lg text-green-600 mt-2">
                    RWF {new Intl.NumberFormat("en-US").format(item.price)}
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
        <img src={selectedOrder.transactionUrl} alt="transaction Image" />
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
  );
}
