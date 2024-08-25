import { useEffect, useState } from "react";
import UseUsers from "./Users";

const CurrentUser = () => {
  const [currentName, setName] = useState("");
  const [currentEmail, setEmail] = useState("");
  const [currentUserId, setUserId] = useState("");
  const { users } = UseUsers();

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem("User"));

    if (userData) {
      console.log(userData);
      const { userId, usernames, emails } = userData;
      if (!userId || !usernames || !emails) {
        console.log("No auth is available");
      } else {
        const availableUser = users.filter((user) => user._id === userId);
        if (availableUser.length === 0) {
          console.log("No current user!");
        } else {
          setName(usernames);
          setEmail(emails);
          setUserId(userId);
        }
      }
    } else {
      console.log("No user data available in session storage.");
    }
  }, [users]);

  return { currentName, currentEmail, currentUserId };
};

export default CurrentUser;
