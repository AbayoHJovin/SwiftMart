/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";
import MtnMoMoButton from "../components/MtnMomoBtn";
import { useLocation, useNavigate } from "react-router-dom";
import { message } from "antd";
import { FaArrowCircleLeft } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { BsPaypal } from "react-icons/bs";
import { FaMobileAlt } from "react-icons/fa";

const PaymentPage = () => {
  const [clientId, setClientId] = useState(null);
  const [cost, setCost] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { amount, dataToSend } = location.state || {};

  useEffect(() => {
    if (!amount || !dataToSend) {
      navigate(-1);
    } else {
      setCost(amount);
    }
  }, [amount, dataToSend, navigate]);

  useEffect(() => {
    const fetchClientId = async () => {
      try {
        const response = await axios.get("http://localhost:5000/config/paypal");
        setClientId(response.data.clientId);
      } catch (error) {
        console.error("Error fetching PayPal client ID:", error);
        message.error({
          content: "Failed to load PayPal configuration",
          className: "custom-message error",
          style: {
            marginTop: '20vh',
          },
        });
      }
    };

    fetchClientId();
  }, []);

  const createOrder = async (data, actions) => {
    try {
      const response = await fetch("http://localhost:5000/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: 100.09,
          currency: "USD",
        }),
      });
      const data = await response.json();
      console.log("Success:", data);
      return data.orderId;
    } catch (error) {
      console.error("Error creating PayPal order:", error);
      message.error({
        content: "Error creating order",
        className: "custom-message error",
        style: {
          marginTop: '20vh',
        },
      });
      throw error;
    }
  };

  const onApprove = async (data) => {
    try {
      const response = await axios.post("http://localhost:5000/capture-order", {
        orderId: data.orderID,
      });

      if (response.data.success) {
        message.success({
          content: "Payment Successful!",
          className: "custom-message success",
          style: {
            marginTop: '20vh',
          },
        });
      } else {
        message.error({
          content: "Payment failed",
          className: "custom-message error",
          style: {
            marginTop: '20vh',
          },
        });
      }
    } catch (error) {
      console.error("Error capturing payment:", error);
      message.error({
        content: "Error capturing payment",
        className: "custom-message error",
        style: {
          marginTop: '20vh',
        },
      });
    }
  };

  const onError = (err) => {
    console.error("PayPal error:", err);
    message.error({
      content: "An error occurred during payment",
      className: "custom-message error",
      style: {
        marginTop: '20vh',
      },
    });
  };

  const formattedAmount = new Intl.NumberFormat("en-US").format(amount);

  if (!clientId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-8 rounded-full bg-green-50"
        >
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-3xl mx-auto">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-8 sm:p-10">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                Complete Your Payment
              </h2>
              <p className="mt-4 text-xl text-green-100">
                Amount to pay: <span className="font-bold">RWF {formattedAmount}</span>
              </p>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="px-6 py-8 sm:p-10">
            <div className="space-y-6">
              {/* MTN MoMo Section */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="relative bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-green-500 transition-all duration-300"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <FaMobileAlt className="h-8 w-8 text-yellow-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">MTN Mobile Money</h3>
                    <p className="mt-2 text-gray-500">Pay easily with MTN MoMo</p>
                  </div>
                </div>
                <div className="mt-6">
                  <MtnMoMoButton amount={amount} data={dataToSend} />
                </div>
              </motion.div>

              {/* PayPal Section */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="relative bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-green-500 transition-all duration-300"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex-shrink-0">
                    <BsPaypal className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">PayPal</h3>
                    <p className="mt-2 text-gray-500">Pay securely with PayPal</p>
                  </div>
                </div>
                <PayPalScriptProvider options={{ clientId: clientId }}>
                  <PayPalButtons
                    createOrder={createOrder}
                    onApprove={onApprove}
                    onError={onError}
                    className="w-full"
                  />
                </PayPalScriptProvider>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Back Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 text-center"
        >
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-6 py-3 text-lg font-medium text-green-700 hover:text-green-800 transition-colors duration-300"
          >
            <FaArrowCircleLeft className="mr-2" />
            Back to Checkout
          </button>
        </motion.div>
      </div>

      {/* Custom styles for antd messages */}
      <style jsx global>{`
        .custom-message {
          border-radius: 8px;
          padding: 12px 24px;
          font-size: 16px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .custom-message.success {
          background-color: #ecfdf5;
          border: 1px solid #34d399;
          color: #065f46;
        }
        .custom-message.error {
          background-color: #fef2f2;
          border: 1px solid #f87171;
          color: #991b1b;
        }
        .ant-message-notice-content {
          background: transparent;
          padding: 0;
          box-shadow: none;
        }
      `}</style>
    </motion.div>
  );
};

export default PaymentPage;
