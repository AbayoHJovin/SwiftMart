/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";
import MtnMoMoButton from "../components/MtnMomoBtn";
import { useLocation, useNavigate } from "react-router-dom";
import { message } from "antd";
import { FaArrowCircleLeft } from "react-icons/fa";

const PaymentPage = () => {
  const [clientId, setClientId] = useState(null);
  const [cost, setCost] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { amount,dataToSend } = location.state || {};
  useEffect(() => {
    if (!amount || !dataToSend) {
      navigate(-1);
    } else {
      setCost(amount);
    }
  }, [amount,dataToSend, navigate]);
  useEffect(() => {
    const fetchClientId = async () => {
      try {
        const response = await axios.get("http://localhost:5000/config/paypal");
        setClientId(response.data.clientId);
      } catch (error) {
        console.error("Error fetching PayPal client ID:", error);
        message.error("Failed to load PayPal client configuration.");
      }
    };

    fetchClientId();
  }, []);
  const createOrder = async (data, actions) => {
    return fetch("http://localhost:5000/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: 100.09,
        currency: "USD",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        return data.orderId;
      })
      .catch((error) => {
        console.error("Error creating PayPal order:", error);
        message.error("Error creating order.");
        throw error;
      });
  };

  const onApprove = async (data) => {
    try {
      const response = await axios.post("http://localhost:5000/capture-order", {
        orderId: data.orderID,
      });

      if (response.data.success) {
        message.success("Payment Successful!");
      } else {
        message.error("Payment failed.");
      }
    } catch (error) {
      console.error("Error capturing payment:", error);
      message.error("Error capturing payment.");
    }
  };

  const onError = (err) => {
    console.error("PayPal error:", err);
    message.error("An error occurred during payment.");
  };
  if (!clientId) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex justify-center min-h-screen items-center px-4">
      <div className="flex flex-col justify-center space-y-5">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Payment page
          </h1>
          <MtnMoMoButton amount={amount} data={dataToSend}/>
          <PayPalScriptProvider
            options={{
              clientId: clientId,
            }}
          >
            <PayPalButtons
              createOrder={createOrder}
              onApprove={onApprove}
              onError={onError}
              className="w-full"
            />
          </PayPalScriptProvider>
        </div>
        <div
          onClick={() => navigate(-1)}
          className="flex items-center cursor-pointer space-x-3 text-xl font-semibold"
        >
          <FaArrowCircleLeft className="text-green-800" size={20} />
          <h1>Back</h1>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
