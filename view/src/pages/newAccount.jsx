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
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { theme } = useContext(ThemeContext);
  const { currentUser } = useContext(CurrentUserContext);
  const navigate = useNavigate();

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  const handleConfirmLogout = () => {
    handleClose();
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
    {
      icon: <LogOut />,
      text: "Logout",
      value: 4,
      page: (
        <LogoutModal
          handleClose={handleClose}
          open={modalOpen}
          handleConfirmLogout={handleConfirmLogout}
        />
      ),
    },
  ];

  if (isLoggingOut) {
    return <Loader text="Logging out ..." />;
  }

  return (
    <div className={`dark:bg-black bg-white`}>
      <Sidebar labels={labels}/>
    </div>
  );
};

export default NewAccount;
