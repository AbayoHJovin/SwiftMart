import { useContext, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import ReactCodeInput from "react-code-input";
import { apiUrl } from "../lib/apis";
import Loader3 from "../components/Loading3";
import { AdminContext } from "../../constants/AuthorizedAdmin";
import { CurrentUserContext } from "../../constants/currentUser";
import { ArrowUpRight } from "lucide-react";

const AdminAuth = () => {
  const navigate = useNavigate();
  const { setIsAdminLoggedIn } = useContext(AdminContext);
  const { isAnAdmin, isLoading } = useContext(CurrentUserContext);
  const [otpValue, setOtpValue] = useState();
  const [sendOtp, setSendOtp] = useState(true);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    console.log(isAnAdmin);
    if (!isLoading && isAnAdmin == false) {
      navigate("/");
    }
  }, [isAnAdmin, navigate, isLoading]);
  const handleOtpChange = (otp) => {
    setOtpValue(otp);
  };
  function handleSendOtp() {
    setLoading(true);
    fetch(`${apiUrl}/generate-otp`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message == "OTP sent successfully") {
          toast.success("Otp sent");
          setSendOtp(false);
        } else {
          console.error(data.message);
          toast.error("Error sending Otp", {
            style: { backgroundColor: "red", color: "white" },
          });
        }
      })
      .catch((e) => console.error(e))
      .finally(() => {
        setLoading(false);
      });
  }
  function handleCheckOtp() {
    setLoading(true);
    fetch(`${apiUrl}/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ otp: otpValue }),
      credentials: "include",
    })
      .then((response) => response.json())
      .then((message) => {
        if (message.message == "OTP verified successfully") {
          setIsAdminLoggedIn(true);
          window.location.href="/authorized/Admin/dashboard";
        } else {
          toast.error("Invalid OTP", {
            style: { backgroundColor: "red", color: "white" },
          });
        }
      })
      .catch((e) => {
        console.error(e);
        toast.error("Invalid OTP", {
          style: { backgroundColor: "red", color: "white" },
        });
      })
      .finally(() => setLoading(false));
  }
  return (
    <div className="bg-white dark:bg-black text-black dark:text-white">
      <div className="relative">
        <ToastContainer position="top-left" closeOnClick />
      </div>
      <div className="flex min-h-screen">
        <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-6 overflow-y-auto">
          <div className="p-6 rounded-lg w-full max-w-md">
            <div
              className="flex justify-center my-5 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <img src="/logo.svg" alt="logo" className="w-44" />
            </div>
            <h2 className="text-center font-montserrat text-xl font-semibold text-gray-700 dark:text-gray-200 mb-6">
              Login as an Admin
            </h2>
            {sendOtp ? (
              <div className="flex flex-col items-center gap-5 text-center">
                <h1>Click on the button below to get an OTP on email</h1>
                {loading ? (
                  <button
                    className="bg-[#9ded68] p-4 px-10 rounded-md"
                    disabled
                  >
                    <Loader3 />
                  </button>
                ) : (
                  <button
                    onClick={handleSendOtp}
                    className="bg-[#9ded68] text-white p-4 px-10 rounded-md"
                  >
                    Send
                  </button>
                )}
              </div>
            ) : (
              <div>
                <h1 className="text-center text-lg">
                  Now, check the sent Otp on your gmail and fill it in the boxes
                  below
                </h1>
                <div className="flex flex-col gap-4 items-center justify-center my-5">
                  <ReactCodeInput
                    type="text"
                    fields={6}
                    onChange={handleOtpChange}
                  />
                  {loading ? (
                    <button className="bg-[#9ded68] text-white p-4 px-10 rounded-md">
                      <Loader3 />
                    </button>
                  ) : (
                    <button
                      onClick={handleCheckOtp}
                      className="bg-[#9ded68] text-white p-4 px-10 rounded-md"
                    >
                      Verify
                    </button>
                  )}
                </div>
                <h1
                  onClick={handleSendOtp}
                  className="underline text-blue-600 cursor-pointer"
                >
                  resend code
                </h1>
              </div>
            )}
          </div>
          <a href="/">
          <div
            className={`flex items-center gap-3 text-gray-700 text-3xl "my-2 mx-5 px-20 py-3" cursor-pointer rounded transition-colors duration-200 absolute bottom-0 left-0 p-5`}
            >
            <span className="mr-2">
              <ArrowUpRight />
            </span>
            <h1 className="text-lg">Back</h1>
          </div>
              </a>
        </div>

        <div className="hidden md:block md:w-1/2 h-screen fixed top-0 right-0">
          <img
            src="/admin.png"
            alt="adminImage"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminAuth;
