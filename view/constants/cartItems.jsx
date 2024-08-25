/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
import CurrentUser from "./currentUser";
// import { redirect, useNavigate } from "react-router-dom";

export const CartContext = createContext();
export default function CartItems({ children }) {
  const [itemsOnCart, setIsOnCart] = useState([]);
  const { currentUserId } = CurrentUser();
  // const navigate = useNavigate();
  useEffect(() => {
    fetch(`http://localhost:5000/getCartItems?currentUser=${currentUserId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        setIsOnCart(data.data.products);
      })
      .catch((e) => console.error(e));
  }, [currentUserId]);

  function addItemOncart(itemId) {
    if (!currentUserId) {
      // navigate("/login");
      console.log("Unauthorized");
    }
    fetch("http://localhost:5000/addItemOncart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: currentUserId, prodId: itemId }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((e) => console.error(e));
  }
  function deleteItem(itemId) {
    fetch(
      `http://localhost:5000/deleteCartItem?itemId=${itemId}&userId=${currentUserId}
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
  return (
    <CartContext.Provider value={{ itemsOnCart, addItemOncart, deleteItem }}>
      {children}
    </CartContext.Provider>
  );
}
