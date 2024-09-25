import { CheckCircle } from "lucide-react";

const OfferComfirmation = () => {
  return (
    <div className="flex flex-col items-center gap-3 justify-center h-screen">
      <div className="font-bold text-3xl  flex items-center gap-3">
        <CheckCircle className="font-extrabold text-green-400" size={30} />
        <h1>Offer Placed!</h1>
      </div>
      <a href="/" className="text-green-500 hover:underline">
        Go to home
      </a>
    </div>
  );
};

export default OfferComfirmation;
