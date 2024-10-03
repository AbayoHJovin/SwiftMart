/* eslint-disable no-unused-vars */
import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../../constants/ThemeContext";
import { CurrentUserContext } from "../../constants/currentUser";
import { apiUrl } from "../lib/apis";

const PersonalDetails = () => {
  const { theme } = useContext(ThemeContext);
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
        id: currentUser._id,
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
    <div
      className={`flex flex-col items-center p-6 max-w-xl mx-auto ${
        theme === "dark" ? "text-white bg-black" : "text-black bg-white "
      }`}
    >
      <div className="flex flex-col sm:flex-row items-center w-full space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gray-200">
          <img
            src={formData.profilePicture || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-full h-full rounded-full object-cover"
          />
        </div>
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-semibold">{formData.name}</h2>
          <label
            htmlFor="upload-profile-picture"
            className="flex items-center justify-center sm:justify-start cursor-pointer text-blue-500"
          >
            <input
              accept="image/*"
              id="upload-profile-picture"
              type="file"
              className="hidden"
              onChange={handleProfilePictureChange}
            />
            Add Photo
          </label>
        </div>
      </div>

      <h3 className="mt-8 mb-4 text-lg font-medium w-full text-center sm:text-left">
        Personal Details
      </h3>

      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        disabled={!isEditing}
        className={`w-full p-5 mb-4 ${
          isEditing
            ? "border-none border-l-8 border-green-800 focus:outline-[#58982e] outline-none"
            : "border-none"
        } rounded bg-[#e6fad9] text-gray-900`}
        placeholder="Full Name"
        required
      />

      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        disabled={!isEditing}
        className={`w-full p-5 mb-4 ${
          isEditing
            ? "border-none border-l-8 border-green-800 focus:outline-[#58982e] outline-none"
            : "border-none"
        } rounded bg-[#e6fad9] text-gray-900`}
        placeholder="Email"
        required
      />
      {isAnAdmin ? null : (
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="w-full sm:w-auto px-4 py-2 bg-[#58982e] text-white rounded shadow"
              >
                Save
              </button>
              <button
                onClick={handleEditToggle}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded shadow"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={handleEditToggle}
              className="w-full sm:w-auto px-4 py-2 bg-[#58982e] text-white rounded shadow"
            >
              Edit
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PersonalDetails;
