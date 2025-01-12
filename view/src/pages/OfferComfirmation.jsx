import { CheckCircle } from "lucide-react";

const OfferComfirmation = () => {
  return (
    <div className="flex flex-col items-center gap-3 justify-center h-screen">
      <div className="font-bold text-3xl  flex items-center gap-3">
        <CheckCircle className="font-extrabold text-green-400" size={30} />
        <h1>Order Placed!</h1>
      </div>
      <h1>
        Thank you for your purchase! Your order is being processed, and
        we&apos;ll call you when it is delivered. You can track your order in Your
        Orders.
      </h1>
      <a href="/" className="text-green-500 hover:underline">
        Go to home
      </a>
    </div>
  );
};

export default OfferComfirmation;
