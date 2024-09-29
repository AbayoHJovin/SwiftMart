import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiUrl } from "../lib/apis";
import Loader3 from "../components/Loading3";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleRememberMeChange = () => setRememberMe(!rememberMe);
  const toggleShowPassword = () => setShowPassword(!showPassword);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      fetch(`${apiUrl}/login`, {
        method: "POST",
        body: JSON.stringify({ email: email, password: password }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => {
          if (localStorage.removeItem("admTokn")) {
            localStorage.removeItem("admTokn");
          }
          if (data.message === "loggedIn") {
            // navigate("/shop/Both/pants");
            window.location.href = "/shop/Both/pants";
            const accessToken = data.accessToken;
            localStorage.setItem("token", accessToken);
          } else {
            toast.error("Invalid credentials", {
              style: { backgroundColor: "red", color: "white" },
            });
          }
        })
        .catch((e) => toast.error(e))
        .finally(() => {
          setLoading(false);
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
            <a className="flex justify-center my-5 cursor-pointer" href="/">
              <img src="./logo.svg" alt="logo" className="w-44" />
            </a>
            <h2 className="text-center font-montserrat text-xl font-semibold text-gray-700 dark:text-gray-200 mb-6">
              Login
            </h2>
            <h1 className="text-center text-lg">
              Join to improve your shopping experience
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
                    placeholder="Enter your email"
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
                    placeholder="Enter your password"
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
              <div className="flex justify-between items-center mb-4">
                <label className="flex items-center text-gray-700 dark:text-gray-200">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={handleRememberMeChange}
                    className="form-checkbox text-blue-500"
                  />
                  <span className="ml-2">Remember me</span>
                </label>
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
            <h1 className="text-center text-lg">Or</h1>
            <div className="flex items-center justify-center mt-4">
              <button className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium py-2 rounded-md flex items-center justify-center focus:outline-none">
                <FcGoogle className="text-red-500 mr-2" />
                Login with Google
              </button>
            </div>
            <h1 className="text-center my-4">
              Don&apos;t have an account?{" "}
              <a href="/signup" className="font-semibold hover:underline">
                Signup
              </a>
            </h1>
          </div>
        </div>

        {/* Fixed Image Section */}
        <div className="hidden md:block md:w-1/2 h-screen fixed top-0 right-0">
          <img
            src="./pc.svg"
            alt="Placeholder"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
