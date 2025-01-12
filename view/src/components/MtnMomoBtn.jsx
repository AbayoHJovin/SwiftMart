/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react";
import { Modal, Button, Input, Form, message } from "antd";
// import { MtnMoMoOutlined } from '@ant-design/icons';
import axios from "axios";
import UseAddOrder from "../../constants/addOrder";

const MtnMoMoButton = ({ amount, data: orderData }) => {
  const { addOrder } = UseAddOrder();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const formattedAmount = new Intl.NumberFormat("en-US").format(amount);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [form] = Form.useForm();
  const handlePaymentRequest = async (values) => {
    try {
      setIsLoading(true);
      const { phoneNumber } = values;

      const response = await axios.post(
        "http://localhost:5000/request-to-pay",
        {
          amount,
          phoneNumber,
        }
      );

      if (response.data.success) {
        message.success(`Payment request sent successfully!`);
        setIsModalVisible(false);
        const re = await addOrder(
          response.data.data,
          response.data.paymentType,
          orderData
        );
        console.log("Response data", response.data);
        console.log("Response", re);
      } else {
        message.error("Something went wrong. Please try again.");
        console.error(`Error: ${response.data.error || response.data.message}`);
      }
    } catch (error) {
      message.error("Something went wrong. Please try again.");
      console.error(`Unexpected Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <button
        type="button"
        className="flex items-center justify-center bg-yellow-400 hover:bg-yellow-500 font-bold py-2 px-4 rounded-lg w-full my-5 space-x-5 text-white"
        onClick={showModal}
      >
        <img src="../../public/momo.jpg" alt="momo" width={60} height={60} />
        <span>Pay with MTN MOMO</span>
      </button>

      <Modal
        title="Request to Pay"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={400}
      >
        <Form form={form} onFinish={handlePaymentRequest} layout="vertical">
          <Form.Item label="Amount" name="amount">
            <Button
              type="default"
              htmlType="button"
              block
              style={{
                borderColor: "#28a745",
                color: "black",
              }}
            >
              RWF {formattedAmount}
            </Button>
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phoneNumber"
            rules={[
              { required: true, message: "Please enter the phone number!" },
            ]}
          >
            <Input
              type="tel"
              placeholder="Enter phone number"
              style={{
                borderColor: "#28a745",
                color: "black",
                padding: "7px",
              }} // Green
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                backgroundColor: "#05611a",
                color: "white",
                borderColor: "#28a745",
                padding: "20px",
                marginTop: "10px",
                opacity: isLoading ? 0.6 : 1,
                pointerEvents: isLoading ? "none" : "auto",
              }}
              disabled={isLoading}
              block
            >
              {isLoading ? "Requesting for payment..." : "Pay Now"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MtnMoMoButton;
