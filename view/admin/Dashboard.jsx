/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Switch,
  FormControlLabel,
  Collapse,
} from "@mui/material";
import {
  FaBars,
  FaBox,
  FaSignOutAlt,
  FaChartBar,
  FaUsers,
  FaBell,
  FaCog,
  FaTag,
  FaTimes,
  FaPlus,
  FaMinus,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ProductTable from "./Products";

function TabPanel(props) {
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

export default function AdminDashboard() {
  const [tabValue, setTabValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [productsOpen, setProductsOpen] = useState(true);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleThemeChange = () => {
    setDarkMode(!darkMode);
  };

  const handleProductsToggle = () => {
    setProductsOpen(!productsOpen);
  };

  const handleTabClick = (index) => {
    setTabValue(index);
    if (open) {
      setOpen(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        bgcolor: darkMode ? "grey.900" : "background.paper",
        color: darkMode ? "white" : "black",
      }}
    >
      {/* Hamburger Icon for Mobile */}
      <IconButton
        aria-label="open drawer"
        onClick={handleDrawerToggle}
        sx={{
          position: "absolute",
          top: 10,
          left: 10,
          display: { xs: "block", md: "none" },
        }}
      >
        <FaBars />
      </IconButton>

      {/* Sidebar Drawer */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 240,
            height: "100vh",
          },
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <IconButton
            aria-label="close drawer"
            onClick={handleDrawerToggle}
            sx={{
              alignSelf: "flex-end",
              m: 1,
            }}
          >
            <FaTimes />
          </IconButton>
          <List>
            <ListItem button onClick={() => handleTabClick(0)}>
              <FaBox style={{ marginRight: 8 }} />
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button onClick={handleProductsToggle}>
              <FaTag style={{ marginRight: 8 }} />
              <ListItemText primary="Products" />
              {productsOpen ? <FaMinus /> : <FaPlus />}
            </ListItem>
            <Collapse in={productsOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem
                  button
                  sx={{ pl: 4 }}
                  onClick={() => handleTabClick(1)}
                >
                  <ListItemText primary="Product List" />
                </ListItem>
              </List>
            </Collapse>
            <ListItem button onClick={() => handleTabClick(3)}>
              <FaChartBar style={{ marginRight: 8 }} />
              <ListItemText primary="Sales" />
            </ListItem>
            <ListItem button onClick={() => handleTabClick(4)}>
              <FaUsers style={{ marginRight: 8 }} />
              <ListItemText primary="Customers" />
            </ListItem>
            <ListItem button onClick={() => handleTabClick(5)}>
              <FaChartBar style={{ marginRight: 8 }} />
              <ListItemText primary="Analytics" />
            </ListItem>
            <ListItem button onClick={() => handleTabClick(6)}>
              <FaBell style={{ marginRight: 8 }} />
              <ListItemText primary="Notifications" />
            </ListItem>
            <ListItem button onClick={() => handleTabClick(7)}>
              <FaCog style={{ marginRight: 8 }} />
              <ListItemText primary="Settings" />
            </ListItem>
            <ListItem button onClick={() => navigate("/")}>
              <FaSignOutAlt style={{ marginRight: 8 }} />
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        sx={{
          display: "flex",
          flex: 1,
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        {/* Sidebar for larger screens */}
        <Box
          sx={{
            width: 240,
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            bgcolor: darkMode ? "grey.800" : "background.default",
            color: darkMode ? "white" : "black",
            height: "100%",
          }}
        >
          <List>
            <ListItem button onClick={() => handleTabClick(0)}>
              <FaBox style={{ marginRight: 8 }} />
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button onClick={handleProductsToggle}>
              <FaTag style={{ marginRight: 8 }} />
              <ListItemText primary="Products" />
              {productsOpen ? <FaMinus /> : <FaPlus />}
            </ListItem>
            <Collapse in={productsOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem
                  button
                  sx={{ pl: 4 }}
                  onClick={() => handleTabClick(1)}
                >
                  <ListItemText primary="Product List" />
                </ListItem>
              </List>
            </Collapse>
            <ListItem button onClick={() => handleTabClick(3)}>
              <FaChartBar style={{ marginRight: 8 }} />
              <ListItemText primary="Sales" />
            </ListItem>
            <ListItem button onClick={() => handleTabClick(4)}>
              <FaUsers style={{ marginRight: 8 }} />
              <ListItemText primary="Customers" />
            </ListItem>
            <ListItem button onClick={() => handleTabClick(5)}>
              <FaChartBar style={{ marginRight: 8 }} />
              <ListItemText primary="Analytics" />
            </ListItem>
            <ListItem button onClick={() => handleTabClick(6)}>
              <FaBell style={{ marginRight: 8 }} />
              <ListItemText primary="Notifications" />
            </ListItem>
            <ListItem button onClick={() => handleTabClick(7)}>
              <FaCog style={{ marginRight: 8 }} />
              <ListItemText primary="Settings" />
            </ListItem>
            <ListItem button onClick={() => navigate("/")}>
              <FaSignOutAlt style={{ marginRight: 8 }} />
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>

        <Box
          sx={{
            flex: 1,
            p: 3,
            display: "flex",
            flexDirection: "column",
            overflowY: "scroll",
          }}
        >
          {/* Dark Mode Switch */}
          <FormControlLabel
            control={<Switch checked={darkMode} onChange={handleThemeChange} />}
            label="Dark Mode"
            sx={{ position: "absolute", top: 10, right: 10 }}
          />

          {/* Tab Panels */}
          <TabPanel value={tabValue} index={0}>
            {/* Dashboard Content */}
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <ProductTable />
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            {/* Sales Content */}
          </TabPanel>
          <TabPanel value={tabValue} index={4}>
            {/* Customers Content */}
          </TabPanel>
          <TabPanel value={tabValue} index={5}>
            {/* Analytics Content */}
          </TabPanel>
          <TabPanel value={tabValue} index={6}>
            {/* Notifications Content */}
          </TabPanel>
          <TabPanel value={tabValue} index={7}>
            {/* Settings Content */}
          </TabPanel>
        </Box>
      </Box>
    </Box>
  );
}
