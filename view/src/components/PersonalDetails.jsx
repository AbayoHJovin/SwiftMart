

import { useState, useEffect, useContext } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Avatar,
  IconButton,
  Grid,
  useMediaQuery,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { useTheme } from "@mui/material/styles";
import { ThemeContext } from "../../constants/ThemeContext";

const PersonalDetails = () => {
  const { theme } = useContext(ThemeContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profilePicture: "",
  });

  const themeObj = useTheme();
  const isSmallScreen = useMediaQuery(themeObj.breakpoints.down("sm"));

  useEffect(() => {
    // Retrieve user data from session storage
    const userData = JSON.parse(sessionStorage.getItem("User"));

    if (userData) {
      const { userId, usernames: name, emails: email } = userData;
      setFormData((prevData) => ({
        ...prevData,
        id: userId || "",
        name: name || "",
        email: email || "",
      }));
    } else {
      console.log("No user data available in session storage.");
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    console.log("Form data is:",formData)
    try {
      const response = await fetch(
        `http://localhost:5000/user/update?userId=${formData.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            profilePicture: formData.profilePicture,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("User updated successfully:", data);
        setIsEditing(false);
        // Optionally update session storage with new user data
        sessionStorage.setItem(
          "User",
          JSON.stringify({
            id: formData.id,
            usernames: formData.name,
            emails: formData.email,
          })
        );
      } else {
        console.error("Failed to update user:", await response.json());
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target.result;
        setFormData((prevData) => ({
          ...prevData,
          profilePicture: imageDataUrl,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 3,
        maxWidth: "800px",
        margin: "0 auto",
        color: theme === "dark" ? "white" : "black",
        width: "100%",
      }}
    >
      <Grid
        container
        spacing={isSmallScreen ? 2 : 3}
        alignItems="center"
        sx={{
          flexDirection: isSmallScreen ? "column" : "row",
          width: "100%",
        }}
      >
        <Grid item xs={12} sm={3} md={2}>
          <Avatar
            src={formData.profilePicture || "https://via.placeholder.com/150"}
            sx={{
              width: { xs: 60, sm: 80 },
              height: { xs: 60, sm: 80 },
              margin: "0 auto",
            }}
          />
        </Grid>

        <Grid item xs={12} sm={9} md={10}>
          <Typography
            variant="h5"
            sx={{
              textAlign: isSmallScreen ? "center" : "left",
              color: theme === "dark" ? "white" : "black",
            }}
          >
            {formData.name}
          </Typography>
          <Box sx={{ textAlign: isSmallScreen ? "center" : "left" }}>
            <label htmlFor="upload-profile-picture">
              <input
                accept="image/*"
                id="upload-profile-picture"
                type="file"
                style={{ display: "none" }}
                onChange={handleProfilePictureChange}
              />
              <IconButton
                component="span"
                sx={{ color: theme === "dark" ? "white" : "black" }}
              >
                <PhotoCamera />
                profile picture
              </IconButton>
            </label>
          </Box>
        </Grid>
      </Grid>

      <Typography
        variant="h6"
        sx={{
          mb: 2,
          mt: 3,
          width: "100%",
          textAlign: isSmallScreen ? "center" : "left",
          color: theme === "dark" ? "white" : "black",
        }}
      >
        Personal
      </Typography>

      <TextField
        label="Full name"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        variant="outlined"
        fullWidth
        disabled={!isEditing}
        sx={{
          mb: 2,
          "& .MuiInputBase-input": {
            color: theme === "dark" ? "white" : "black",
            bgcolor: theme === "dark" ? "#424242" : "white",
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: theme === "dark" ? "white" : "black",
            },
            "&:hover fieldset": {
              borderColor: theme === "dark" ? "lightgray" : "gray",
            },
            "&.Mui-focused fieldset": {
              borderColor: theme === "dark" ? "lightgray" : "black",
            },
          },
          "& .MuiInputLabel-root": {
            color: theme === "dark" ? "lightgray" : "gray",
          },
        }}
      />
      <TextField
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        variant="outlined"
        fullWidth
        disabled={!isEditing}
        sx={{
          mb: 3,
          "& .MuiInputBase-input": {
            color: theme === "dark" ? "white" : "black",
            bgcolor: theme === "dark" ? "#424242" : "white",
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: theme === "dark" ? "white" : "black",
            },
            "&:hover fieldset": {
              borderColor: theme === "dark" ? "lightgray" : "gray",
            },
            "&.Mui-focused fieldset": {
              borderColor: theme === "dark" ? "lightgray" : "black",
            },
          },
          "& .MuiInputLabel-root": {
            color: theme === "dark" ? "lightgray" : "gray",
          },
        }}
      />

      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: isSmallScreen ? "column" : "row",
          gap: 2,
          justifyContent: "center",
        }}
      >
        {isEditing ? (
          <>
            <Button
              variant="contained"
              onClick={handleSave}
              sx={{
                width: isSmallScreen ? "100%" : "auto",
                maxWidth: "200px",
                bgcolor: theme === "dark" ? "gray" : "primary.main",
              }}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              onClick={handleEditToggle}
              sx={{
                width: isSmallScreen ? "100%" : "auto",
                maxWidth: "200px",
                color: theme === "dark" ? "white" : "primary.main",
              }}
            >
              Cancel
            </Button>
          </>
        ) : (
          <Button
            variant="contained"
            onClick={handleEditToggle}
            sx={{
              width: isSmallScreen ? "100%" : "auto",
              maxWidth: "200px",
              bgcolor: theme === "dark" ? "gray" : "primary.main",
            }}
          >
            Edit
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default PersonalDetails;
