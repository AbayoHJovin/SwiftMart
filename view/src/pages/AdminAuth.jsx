import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../lib/apis";
import Loader3 from "../components/Loading3";
import adminImage from "../../public/admin.png";
const AdminAuth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [key, setKey] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleKeyChange = (e) => setKey(e.target.value);
  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowKey = () => setShowKey(!showKey);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      fetch(`${apiUrl}/adminLogin`, {
        method: "POST",
        body: JSON.stringify({ email: email, password: password, Token: key }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message === "Welcome To Admin") {
            navigate("/authorized/Admin");
            const adminToken = data.adminToken;
            localStorage.setItem("admTokn", adminToken);
          } else {
            toast.error("Invalid credentials", {
              style: { backgroundColor: "red", color: "white" },
            });
          }
        })
        .catch((e) => toast.error(e))
        .finally(() => {
          setLoading(false);
          setPassword("");
          setKey("");
        });
    } catch (error) {
      toast.error(error || "Login failed! Please try again.");
    }
  };
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
            <h1 className="text-center text-lg">
              Enter the admin credentials for verification
            </h1>
            <form onSubmit={handleLogin} className="my-10">
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                  Email
                </label>
                <div className="flex items-center border-l-4 outline-none border-green-800 rounded-md">
                  <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Enter admin email"
                    className="w-full p-5 bg-[#e6fad9] dark:bg-gray-900 outline-none text-gray-700 dark:text-gray-200"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                  Password
                </label>
                <div className="flex items-center bg-[#e6fad9] dark:bg-gray-900 border-l-4 border-green-800 rounded-md">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Enter admin password"
                    className="w-full p-5 bg-[#e6fad9] dark:bg-gray-900  outline-none focus:outline-none text-gray-700 dark:text-gray-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    className="text-gray-500 dark:text-gray-400 mx-3 focus:outline-none"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                  Advanced Admin Key
                </label>
                <div className="flex items-center bg-[#e6fad9] dark:bg-gray-900 border-l-4 border-green-800 rounded-md">
                  <input
                    type={showKey ? "text" : "password"}
                    value={key}
                    onChange={handleKeyChange}
                    placeholder="Enter admin key"
                    className="w-full p-5 bg-[#e6fad9] dark:bg-gray-900  outline-none focus:outline-none text-gray-700 dark:text-gray-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={toggleShowKey}
                    className="text-gray-500 dark:text-gray-400 mx-3 focus:outline-none"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center mb-4">
                <a href="#" className="text-gray-500">
                  Forgot Password?
                </a>
              </div>
              {loading ? (
                <button
                  type="button"
                  disabled
                  className="w-full bg-green-800 flex justify-center items-center text-white font-medium py-2 rounded-md focus:outline-none disabled:cursor-not-allowed"
                  style={{ height: "3rem" }}
                >
                  <div className="flex justify-center items-center">
                    <Loader3 className="w-[2.5rem] h-[2.4rem] animate-spin" />{" "}
                  </div>
                </button>
              ) : (
                <button
                  type="submit"
                  className="w-full bg-green-800 h-[3rem] hover:bg-green-900 text-white font-medium py-2 rounded-md focus:outline-none"
                >
                  Login Now
                </button>
              )}
            </form>
          </div>
        </div>

        <div className="hidden md:block md:w-1/2 h-screen fixed top-0 right-0">
          <img
            src={adminImage}
            alt="adminImage"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminAuth;
