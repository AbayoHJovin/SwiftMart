/* eslint-disable no-unused-vars */
import Sidebar from "./Sidebar";
import PersonalDetails from "../components/PersonalDetails";
import Orders from "../../admin/Orders";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../../constants/ThemeContext";
import { CurrentUserContext } from "../../constants/currentUser";
import LogoutModal from "./logout";
import Loader from "../components/loader";
import { toast } from "react-toastify";
import { apiUrl } from "../lib/apis";
import { List, Lock, LogOut, User2 } from "lucide-react";
import Offers from "../../constants/Offers";

const NewAccount = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { theme } = useContext(ThemeContext);
  const { currentUser } = useContext(CurrentUserContext);
  const navigate = useNavigate();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${apiUrl}/protected`, {
      method: "POST",
      headers: { "Content-Type": "application/json", authorization: token },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Unauthorized") {
          console.log("error in viewing account data", data);
          setIsSignedIn(false);
        } else if (data.message === "Authorized") {
          setIsSignedIn(true);
        } else {
          setIsSignedIn(false);
        }
      })
      .catch((e) => {
        console.log("Error while checking the user", e);
        setIsSignedIn(false);
      });
  }, []);
  const handleConfirmLogout = () => {
    setIsLoggingOut(true);
    fetch(`${apiUrl}/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Logged out") {
          localStorage.removeItem("token");
          navigate("/");
        }
      })
      .catch(() => {
        toast.error("Can't logout!");
      })
      .finally(() => {
        setIsLoggingOut(false);
      });
  };
  const labels = [
    { icon: <User2 />, text: "Account", value: 1, page: <PersonalDetails /> },
    {
      icon: <List />,
      text: "Orders",
      value: 2,
      page: (
        <Offers>

        <Orders
          AdminOptions={false}
          currentUser={currentUser ? currentUser._id : null}
          />
          </Offers>
      ),
    },
    {
      icon: <Lock />,
      text: "Password",
      value: 3,
      page: (
        <>
          <h2>Security</h2>
          <p>Manage your security settings.</p>
        </>
      ),
    },
  ];

  return (
    <div className={`bg-gray-200 dark:bg-black`}>
      {isSignedIn ? (
        <Sidebar
          labels={labels}
          handleConfirmLogout={handleConfirmLogout}
          isLoggingOut={isLoggingOut}
        />
      ) : (
        <div className="flex justify-center items-center min-h-screen text-black dark:text-white p-5">
          <div className="mb-10 p-5 sm:p-10 rounded-lg bg-white dark:bg-black w-full max-w-md">
            <div className="flex flex-col justify-center items-start ssm:items-center text-start ssm:text-center">
              <h1 className="ssm:text-center my-5 font-bold text-2xl sm:text-xl">
                Not signed in!
              </h1>
              <h1 className="ssm:text-center text-base sm:text-lg">
                Log in or create an account to improve your shopping experience.
              </h1>
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-5 mt-5">
              <a href="/signup">
                <button className="bg-[#6ed629] text-white py-2 px-4 sm:py-3 sm:px-5 rounded-md text-sm sm:text-base">
                  Sign Up
                </button>
              </a>
              <a href="/login">
                <button className="bg-[#6ed629] text-white py-2 px-4 sm:py-3 sm:px-5 rounded-md text-sm sm:text-base">
                  Login
                </button>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewAccount;
