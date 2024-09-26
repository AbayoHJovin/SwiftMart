/* eslint-disable react/prop-types */
import ProductTable from "./Products";
import Orders from "./Orders";
import PopularProds from "./PopularProds";
import { apiUrl } from "../src/lib/apis";
import { LayoutDashboard } from "lucide-react";
import {
  AiFillLike,
  AiFillProduct,
  AiOutlineOrderedList,
} from "react-icons/ai";
import Sidebar from "../src/pages/Sidebar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("admTokn") || "";
    fetch(`${apiUrl}/adminProtected`, {
      method: "POST",
      headers: { "Content-Type": "application/json", authorization: token },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Unauthorized") {
          navigate("/try/admin/auth");
        } else if (data.message === "Authorized") {
          console.log("Authorized");
        } else {
          navigate("/try/admin/auth");
        }
      })
      .catch((e) => {
        console.log("Error while checking the user", e);
      });
  }, [navigate]);

  const handleConfirmLogout = () => {
    setIsLoggingOut(true);
    fetch(`${apiUrl}/adminLogout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Logged out") {
          localStorage.removeItem("admTokn");
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
    { icon: <LayoutDashboard />, text: "Dashboard", value: 1, page: "" },
    {
      icon: <AiFillProduct />,
      text: "products",
      value: 2,
      page: <ProductTable />,
    },
    {
      icon: <AiFillLike />,
      text: "P.Products",
      value: 3,
      page: <PopularProds />,
    },
    {
      icon: <AiOutlineOrderedList />,
      text: "Orders",
      value: 4,
      page: <Orders AdminOptions={true} />,
    },
  ];
  return <Sidebar labels={labels} handleConfirmLogout={handleConfirmLogout} isLoggingOut={isLoggingOut}/>;
}
