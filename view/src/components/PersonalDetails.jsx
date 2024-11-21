/* eslint-disable no-unused-vars */
import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../../constants/ThemeContext";
import { CurrentUserContext } from "../../constants/currentUser";
import { apiUrl } from "../lib/apis";
import UserNav from "./UserAccountNav";

const PersonalDetails = () => {
  const { theme,toggleTheme } = useContext(ThemeContext);
  const { currentUser, isAnAdmin } = useContext(CurrentUserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    profilePicture: "",
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        id: currentUser.userId,
        name: currentUser.username,
        email: currentUser.email,
        profilePicture: currentUser.profilePicture,
      });
    }
  }, [currentUser]);

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
    try {
      const response = await fetch(
        `${apiUrl}/user/update?userId=${formData.id}`,
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
        setIsEditing(false);
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
    <div>
      <UserNav />
      <div
        className={`flex flex-col bg-white text-black dark:text-white dark:bg-gray-950 items-center p-6 max-w-4xl mx-auto space-y-6 ${
          theme === "dark" ? "text-white bg-gray-800" : "text-black bg-white"
        } rounded-lg `}
      >
        {/* Profile Details Section */}
        <div className="w-full bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Profile Details</h3>
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative group text-center">
              <img
                src={
                  formData.profilePicture || "https://via.placeholder.com/150"
                }
                alt="Profile"
                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border border-gray-300"
              />
              <input
                accept="image/*"
                id="upload-profile-picture"
                type="file"
                className="hidden"
                onChange={handleProfilePictureChange}
              />
              {/* Hover Overlay */}
              <label
                htmlFor="upload-profile-picture"
                className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full cursor-pointer"
              >
                Change Profile Picture
              </label>
            </div>

            <div className="flex-grow">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Username
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full p-3 border rounded-md transition-colors duration-300 ${
                    isEditing
                      ? "border-green-500 focus:outline-none focus:border-green-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200"
                      : "border-gray-300 bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full p-3 border rounded-md transition-colors duration-300 ${
                    isEditing
                      ? "border-green-500 focus:outline-none focus:border-green-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200"
                      : "border-gray-300 bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                  }`}
                />
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="bg-green-500 text-white px-4 py-2 rounded-md"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleEditToggle}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEditToggle}
                  className="bg-green-500 text-white px-4 py-2 rounded-md"
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Additional Sections */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 ">
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Subscriptions</h3>
            <p className="text-sm text-gray-600 dark:text-gray-200 mb-4">
              You can subscribe to our newsletter so that you can get the
              regular updates on mail from us !!
            </p>
            <button className="bg-green-500 text-white px-4 py-2 rounded-md">
              Subscribe
            </button>
          </div>
          <div className="space-y-4 ">
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Change Password</h3>
              <p className="text-sm text-gray-600 dark:text-gray-200 mb-4">
                Your password will be immediately changed
              </p>
              <button
                onClick={() => (window.location.href = "/account/password")}
                className="bg-green-500 text-white px-4 py-2 rounded-md"
              >
                Change Password
              </button>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Danger Zone</h3>
              <p className="text-sm text-gray-600 dark:text-gray-200 mb-4">
                You can permanently delete or temporarily freeze your account.
              </p>
              <button className="bg-red-500 text-white px-4 py-2 rounded-md">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetails;
