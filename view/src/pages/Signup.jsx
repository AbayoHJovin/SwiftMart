import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/ReactToastify.min.css";
import { apiUrl } from "../lib/apis";

const SignupForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      fetch(`${apiUrl}/signup`, {
        method: "POST",
        body: JSON.stringify({ username, email, password }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message == "User created successfully") {
            setTimeout(() => {
              navigate("/login");
            }, 5000);
            toast.success("Account created");
          } else {
            toast.error(data.message, {
              style: { backgroundColor: "red", color: "white" },
            });
          }
        })
        .catch((e) => toast.error(e));
    } catch (err) {
      setError("Signup failed. Please try again.");
      console.error(err);
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = "/api/auth/google";
  };

  return (
    <div className="relative bg-white dark:bg-black">
      <ToastContainer position="top-left" closeOnClick />
      <div className="flex min-h-screen">
        {/* Form Section */}
        <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-6 overflow-y-auto">
          <div className=" p-6 rounded-lg w-full max-w-md">
            <a
              className="flex justify-center my-5"
              href="/"
            >
              <img
                src="./logo.svg"
                alt="logo"
                className="w-44 cursor-pointer"
              />
            </a>
            <h2 className="text-center font-montserrat text-xl font-semibold text-gray-700 dark:text-gray-200 mb-6">
              Sign Up
            </h2>
            <h1 className="text-center text-lg text-black dark:text-white">
              Join to improve your shopping experience
            </h1>
            <form onSubmit={handleSignup} className="my-10">
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                  Username
                </label>
                <div className="flex items-center border-l-4 outline-none border-green-800 rounded-md">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full p-5 bg-[#e6fad9] dark:bg-gray-900 outline-none text-gray-700 dark:text-gray-200"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                  Email
                </label>
                <div className="flex items-center border-l-4 outline-none border-green-800 rounded-md">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                <div className="flex items-center border-l-4 outline-none border-green-800 rounded-md">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full p-5 bg-[#e6fad9] dark:bg-gray-900 outline-none text-gray-700 dark:text-gray-200"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                  Confirm Password
                </label>
                <div className="flex items-center border-l-4 outline-none border-green-800 rounded-md">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full p-5 bg-[#e6fad9] dark:bg-gray-900 outline-none text-gray-700 dark:text-gray-200"
                    required
                  />
                </div>
              </div>
              {error && <p className="text-red-500">{error}</p>}
              <button
                type="submit"
                className="w-full bg-green-800 hover:bg-green-900 text-white font-medium py-2 rounded-md focus:outline-none"
              >
                Sign Up Now
              </button>
            </form>
            <h1 className="text-center text-lg text-black dark:text-white">
              Or
            </h1>
            <div className="flex items-center justify-center mt-4">
              <button
                onClick={handleGoogleAuth}
                className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium py-2 rounded-md flex items-center justify-center focus:outline-none"
              >
                <FcGoogle className="text-red-500 mr-2" />
                Sign Up with Google
              </button>
            </div>
            <h1 className="text-center my-4 text-black dark:text-white">
              Already have an account?{" "}
              <a href="/login" className="font-semibold hover:underline">
                Login
              </a>
            </h1>
          </div>
        </div>

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

export default SignupForm;
