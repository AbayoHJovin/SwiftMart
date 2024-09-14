/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from "react";
import { CurrentUserContext } from "./currentUser";
import { useNavigate } from "react-router-dom";

export const CartContext = createContext();
export default function CartItems({ children }) {
  const [itemsOnCart, setIsOnCart] = useState([]);
  const { currentUser } = useContext(CurrentUserContext);
  useEffect(() => {
    if (currentUser) {
      const token = localStorage.getItem("token");
      fetch(
        `http://localhost:5000/getCartItems?currentUser=${currentUser._id}`,
        {
          method: "GET",
          headers: {
            authorization: token,
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          setIsOnCart(data.products);
        })
        .catch((e) => console.log("error getting products", e));
    }
  }, [currentUser]);
  const navigate = useNavigate();
  function addItemOncart(itemId) {
    if (!currentUser) {
      console.log("no user");
      navigate("/login");
      return;
    }
    fetch("http://localhost:5000/addItemOncart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: currentUser._id, prodId: itemId }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((e) => console.error(e));
  }
  function deleteItem(itemId) {
    if (currentUser._id) {
      fetch(
        `http://localhost:5000/deleteCartItem?itemId=${itemId}&userId=${currentUser._id}
`,
        {
          method: "DELETE",
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        })
        .catch((e) => console.error(e));
    }
  }

  return (
    <CartContext.Provider value={{ itemsOnCart, addItemOncart, deleteItem }}>
      {children}
    </CartContext.Provider>
  );
}
