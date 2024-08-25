/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
import CurrentUser from "./currentUser";
// import { redirect, useNavigate } from "react-router-dom";

export const FavContext = createContext();
export default function FavItems({ children }) {
  const [itemsOnFav, setIsOnFav] = useState([]);
  const { currentUserId } = CurrentUser();
  // const navigate = useNavigate();
  useEffect(() => {
    fetch(`http://localhost:5000/getFavItems?currentUser=${currentUserId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        setIsOnFav(data.data.products);
      })
      .catch((e) => console.error(e));
  }, [currentUserId]);

  function addItemOnFav(itemId) {
    if (!currentUserId) {
      // navigate("/login");
      console.log("Unauthorized");
    }
    fetch("http://localhost:5000/addItemOnFav", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: currentUserId, prodId: itemId }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((e) => console.error(e));
  }
  function deleteItemFromFav(itemId) {
    fetch(
      `http://localhost:5000/deleteFavItem?itemId=${itemId}&userId=${currentUserId}
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
    <FavContext.Provider value={{ itemsOnFav, addItemOnFav, deleteItemFromFav }}>
      {children}
    </FavContext.Provider>
  );
}
