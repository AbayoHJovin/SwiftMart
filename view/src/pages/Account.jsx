
import { useContext, useEffect, useState } from "react";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";
import { FaSignOutAlt, FaList, FaLock, FaUser } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import PersonalDetails from "../components/PersonalDetails";
import { ThemeContext } from "../../constants/ThemeContext";

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
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  useEffect(() => {
    const userAuthKey = sessionStorage.getItem("user_token_id");
    const User = sessionStorage.getItem("User");
    if (userAuthKey && User) {
      setIsSignedIn(true);
    }
  }, []);

  const handleTabClick = (index) => {
    setTabValue(index);
  };

  return (
    <div className="dark:bg-black bg-white">
      <Navbar />
      {isSignedIn ? (
        <div>
          <Box
            sx={{
              display: "flex",
              height: "100vh",
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
                  onClick={() => {
                    sessionStorage.clear();
                    navigate("/login");
                  }}
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
                <Typography variant="h6">Orders</Typography>
                <Typography variant="body1">
                  Here you can view your past orders.
                </Typography>
              </TabPanel>
              <TabPanel value={tabValue} index={2}>
                <Typography variant="h6">Security</Typography>
                <Typography variant="body1">
                  Here you can manage your security settings.
                </Typography>
              </TabPanel>
            </Box>
          </Box>
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
