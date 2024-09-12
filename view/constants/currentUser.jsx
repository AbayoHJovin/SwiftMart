/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
import Loader from "../src/components/loader";

export const CurrentUserContext = createContext();
const CurrentUser = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({});
  const [isLoading, setISLoading] = useState(false);
  useEffect(() => {
    const userToken = localStorage.getItem("token");
    setISLoading(true);
    fetch("http://localhost:5000/currentUser", {
      method: "GET",
      headers: { token: userToken },
    })
      .then((response) => response.json())
      .then((data) => {
        setCurrentUser(data.user);
      })
      .catch((e) => console.error(e))
      .finally(() => {
        setISLoading(false);
      });
  }, []);
  if (isLoading) {
    return <Loader text="Loading the page ..."/>
  }
  return (
    <CurrentUserContext.Provider value={{ currentUser }}>
      {children}
    </CurrentUserContext.Provider>
  );
};

export default CurrentUser;
