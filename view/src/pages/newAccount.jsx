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

const NewAccount = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { theme } = useContext(ThemeContext);
  const { currentUser } = useContext(CurrentUserContext);
  const navigate = useNavigate();
  const [isSignedIn, setIsSignedIn] = useState(false);

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

  const labels = [
    { icon: <User2 />, text: "Account", value: 1, page: <PersonalDetails /> },
    {
      icon: <List />,
      text: "Orders",
      value: 2,
      page: (
        <Orders
          AdminOptions={false}
          currentUser={currentUser ? currentUser._id : null}
        />
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
    <div className={`dark:bg-black bg-white`}>
      {isSignedIn ? (
        <Sidebar labels={labels} />
      ) : (
        <div className=" text-black dark:text-white bg-white dark:bg-black">
          <div className="my-10">
            <div className="flex flex-col justify-center items-start ssm:items-center text-start ssm:text-center p-5 font-bold text-xl">
              <h1 className="ssm:text-center">
                Dear user, You are not signed in. Better Create an account
              </h1>
              <h1 className="self-start ssm:self-center mt-4 ssm:mt-2">Or</h1>
              <h1 className="ssm:text-center">
                Login into your account if you want.
              </h1>
            </div>

            <div className="flex p-5 flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-5 my-10">
              <a href="/signup">
                <button className="bg-green-900 text-white py-2 px-4 sm:py-3 sm:px-5 rounded-md text-sm sm:text-base">
                  Sign Up
                </button>
              </a>
              <a href="/login">
                <button className="bg-green-900 text-white py-2 px-4 sm:py-3 sm:px-5 rounded-md text-sm sm:text-base">
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
