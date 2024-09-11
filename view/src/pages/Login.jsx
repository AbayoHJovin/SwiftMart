import { useState } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Navbar from "../components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleRememberMeChange = () => setRememberMe(!rememberMe);
  const toggleShowPassword = () => setShowPassword(!showPassword);
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      fetch("http://localhost:5000/login", {
        method: "POST",
        body: JSON.stringify({ email: email, password: password }),
        headers: { "Content-Type": "application/json" },
        credentials:"include"
      })
        .then((response) => response.json())
        .then((data) => {
          toast.info(data.message);
          setTimeout(() => {
            navigate("/");
          }, 3000);
          const accessToken=data.accessToken
          localStorage.setItem("token", accessToken)
        })
        .catch((e) => toast.error(e));
    } catch (error) {
      toast.error(error || "Login failed! Please try again.");
    }
  };

  return (
    <div>
      <Navbar />
      <ToastContainer />
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-center text-xl font-semibold text-gray-700 dark:text-gray-200 mb-6">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="text-blue-500">
              Sign Up Now
            </a>
          </h2>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                Email
              </label>
              <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-md">
                <FaEnvelope className="text-gray-500 dark:text-gray-400 ml-3" />
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Enter your email"
                  className="w-full p-2 bg-transparent focus:outline-none text-gray-700 dark:text-gray-200"
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                Password
              </label>
              <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-md">
                <FaLock className="text-gray-500 dark:text-gray-400 ml-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Enter your password"
                  className="w-full p-2 bg-transparent focus:outline-none text-gray-700 dark:text-gray-200"
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
              <a href="#" className="text-blue-500">
                Forgot Password?
              </a>
            </div>
            <button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 rounded-md focus:outline-none"
            >
              Login Now
            </button>
          </form>
          <div className="flex items-center justify-center mt-4">
            <button className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium py-2 rounded-md flex items-center justify-center focus:outline-none">
              <FcGoogle className="text-red-500 mr-2" />
              Login with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
