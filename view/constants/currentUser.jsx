/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
import { apiUrl } from "../src/lib/apis";
import Loader2 from "../src/components/loader2";

export const CurrentUserContext = createContext();
const CurrentUser = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({});
  const [isLoading, setISLoading] = useState(false);
  const [isAnAdmin, setIsAnAdmin] = useState(null);
  useEffect(() => {
    function getUser() {  
      const userToken = localStorage.getItem("token");
      setISLoading(true);
      fetch(`${apiUrl}/currentUser`, {
        method: "GET",
        headers: { token: userToken },
      })
        .then((response) => response.json())
        .then((data) => {
          setCurrentUser(data.user);
          if(data.isAdmin == true){
            setIsAnAdmin(true);
          }
          else{
            setIsAnAdmin(false)
          }
        })
        .catch((e) => console.error(e))
        .finally(() => {
          setISLoading(false);
        });
    }
    getUser();
  }, [isAnAdmin]);
  useEffect(() => {
  }, [isAnAdmin]);
  if (isLoading) {
    return <Loader2 />;
  }
  return (
    <CurrentUserContext.Provider value={{ isLoading,currentUser, isAnAdmin }}>
      {children}
    </CurrentUserContext.Provider>
  );
};

export default CurrentUser;
