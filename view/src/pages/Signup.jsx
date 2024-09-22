import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import Navbar from "../components/Navbar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.min.css";
import { apiUrl } from "../lib/apis";

const SignupForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = localStorage.getItem("userInfo");
    if (checkUser) {
      navigate("/login");
    }
  }, [navigate]);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      fetch(`${apiUrl}/signup`, {
        method: "POST",
        body: JSON.stringify({username,email,password}),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          toast.success(data);
        })
        .catch((e) => toast.error(e));
        navigate("/login");
    } catch (err) {
      setError("Signup failed. Please try again.");
      console.error(err);
    }
  };

  const handleGoogleAuth = () => {
    // Implement Google Auth logic here
    // Typically, this will involve redirecting to your backend's Google OAuth route
    window.location.href = "/api/auth/google";
  };

  return (
    <div>
      <Navbar />
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <ToastContainer />
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-center text-xl font-semibold text-gray-700 dark:text-gray-200 mb-6">
            Sign Up
          </h2>
          <form onSubmit={handleSignup}>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full p-2 bg-transparent border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none text-gray-700 dark:text-gray-200"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full p-2 bg-transparent border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none text-gray-700 dark:text-gray-200"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full p-2 bg-transparent border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none text-gray-700 dark:text-gray-200"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full p-2 bg-transparent border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none text-gray-700 dark:text-gray-200"
                required
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 rounded-md focus:outline-none"
            >
              Sign Up
            </button>
          </form>
          <div className="my-4">
            <button
              onClick={handleGoogleAuth}
              className="w-full flex justify-center items-center bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 rounded-md focus:outline-none"
            >
              <FcGoogle className="mr-2" size={24} /> Sign Up with Google
            </button>
          </div>
          <div className="text-center text-gray-600 dark:text-gray-400 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500">
              Login here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
