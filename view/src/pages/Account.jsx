import { useContext, useEffect, useState } from "react";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";
import { FaSignOutAlt, FaList, FaLock, FaUser } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import PersonalDetails from "../components/PersonalDetails";
import { ThemeContext } from "../../constants/ThemeContext";
import LogoutModal from "./logout";
import { toast } from "react-toastify";
import Loader from "../components/loader";
import Orders from "../../admin/Orders";
import { CurrentUserContext } from "../../constants/currentUser";

function TabPanel(props) {
  // eslint-disable-next-line react/prop-types
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function Account() {
  const [isSignedIn, setIsSignedIn] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
const {currentUser}=useContext(CurrentUserContext)
  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  function handleConfirmLogout() {
    handleClose();
    setIsLoggingOut(true);
    fetch("http://localhost:5000/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Logged out") {
          // setIsLoggingOut(false)
          localStorage.removeItem("token");
          navigate("/");
        }
      })
      .catch((e) => {
        console.log(e);
        toast.error("Can't logout!");
      })
      .finally(() => {
        setIsLoggingOut(false);
      });
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/protected", {
      method: "POST",
      headers: { "Content-Type": "application/json", authorization: token },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Unauthorized") {
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

  const handleTabClick = (index) => {
    setTabValue(index);
  };
  if (isLoggingOut) {
    return <Loader text="Logging out ..." />;
  }
  return (
    <div className="dark:bg-black bg-white">
      <Navbar />
      {isSignedIn ? (
        <div>
          <Box
            sx={{
              display: "flex",
              bgcolor: theme === "dark" ? "black" : "white",
              color: theme === "dark" ? "white" : "black",
            }}
          >
            {/* Responsive Sidebar */}
            <Box
              sx={{
                width: { xs: "60px", md: "240px" }, // Adjust width for small and large screens
                flexShrink: 0,
                backgroundColor: theme === "dark" ? "black" : "white",
                color: theme === "dark" ? "white" : "black",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "20px 0",
              }}
            >
              <List sx={{ width: "100%" }}>
                {[
                  { name: "Account", icon: <FaUser /> },
                  { name: "Orders", icon: <FaList /> },
                  { name: "Password", icon: <FaLock /> },
                ].map((text, index) => (
                  <ListItem
                    button
                    key={text.name}
                    onClick={() => handleTabClick(index)}
                    sx={{
                      justifyContent: { xs: "center", md: "flex-start" }, // Center icons on smaller screens
                      padding: { xs: "10px 0", md: "10px 16px" },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <div className="mr-[10px]">{text.icon}</div>
                      {/* Hide text on smaller screens */}
                      <ListItemText
                        primary={text.name}
                        sx={{ display: { xs: "none", md: "block" } }}
                      />
                    </Box>
                  </ListItem>
                ))}
                <ListItem
                  button
                  onClick={handleOpen}
                  sx={{
                    justifyContent: { xs: "center", md: "flex-start" },
                    padding: { xs: "10px 0", md: "10px 16px" },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <FaSignOutAlt />
                    <ListItemText
                      primary="Logout"
                      sx={{ display: { xs: "none", md: "block" } }}
                    />
                  </Box>
                </ListItem>
              </List>
            </Box>

            {/* Content Area */}
            <Box
              sx={{
                flexGrow: 1,
                padding: 3,
                backgroundColor: theme === "dark" ? "black" : "grey.100",
              }}
            >
              <TabPanel value={tabValue} index={0}>
                <PersonalDetails />
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <Orders AdminOptions={false} currentUser={currentUser? currentUser._id: null}/>
              </TabPanel>
              <TabPanel value={tabValue} index={2}>
                <Typography variant="h6">Security</Typography>
                <Typography variant="body1">
                  Here you can manage your security settings.
                </Typography>
              </TabPanel>
            </Box>
          </Box>
          <LogoutModal
            handleClose={handleClose}
            open={modalOpen}
            handleConfirmLogout={handleConfirmLogout}
          />
        </div>
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
      <Footer />
    </div>
  );
}
