"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/navbar/Navbar";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    department: "",
    position: "",
  });

  // State for password change modal +++++++++++++++
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    length: "",
    uppercase: "",
    lowercase: "",
    number: "",
    confirm: "",
    form: "",
  });

  useEffect(() => {
    // Function to fetch profile data **************
    const fetchProfile = async () => {
      try {
        // Get user ID from localStorage
        const userData = localStorage.getItem("userData");
        console.log(userData);
        if (userData) {
          const { user } = JSON.parse(userData);

          // Fetch profile data
          const response = await axios.get(`/api/users/profile/${user.id}`);

          // Update form data with API response
          setFormData({
            username: response.data.email || "",
            name: response.data.name || "",
            department: response.data.department || "",
            position: response.data.position || "",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Function to handle form submission ++++++++++++++++++++++
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);

    // Add API call to save data here *************
    try {
      // Get user ID from localStorage
      const userData = localStorage.getItem("userData");
      if (userData) {
        const { user } = JSON.parse(userData);

        // Make API call to update profile
        await axios.put(`/api/users/profile/${user.id}`, {
          // email: formData.username,
          name: formData.name,
          department: formData.department,
          position: formData.position,
        });

        // Update successful
        setIsEditing(false);

        // Optional: Add success notification here
        alert("Profile updated successfully");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      // Optional: Add error notification here
      alert("Failed to update profile");
    }
  };

  const validatePassword = (password: string) => {
    const newErrors = {
      length: "",
      uppercase: "",
      lowercase: "",
      number: "",
      confirm: "",
      form: "",
    };

    if (password.length < 8) {
      newErrors.length = "Password must be at least 8 characters long";
    }
    if (!/[A-Z]/.test(password)) {
      newErrors.uppercase =
        "Password must include at least one uppercase letter";
    }
    if (!/[a-z]/.test(password)) {
      newErrors.lowercase =
        "Password must include at least one lowercase letter";
    }
    if (!/\d/.test(password)) {
      newErrors.number = "Password must include at least one number";
    }
    if (password !== confirmPassword) {
      newErrors.confirm = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const handlePasswordSave = async () => {
      // Check if all fields are filled
  if (!oldPassword || !newPassword || !confirmPassword) {
    setErrors({ ...errors, form: "Required All Fields" });
    return;
  }
    if (validatePassword(newPassword)) {
      try {
        const userData = localStorage.getItem("userData");
        if (userData) {
          const { user } = JSON.parse(userData);
          await axios.put(`/api/users/profile/${user.id}`, {
            oldPassword,
            newPassword,
          });
          setIsModalOpen(false);
          alert("Password changed successfully");
        }
      } catch (error) {
        setErrors({ ...errors, form: "Failed to change password" });
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setErrors({
      length: "",
      uppercase: "",
      lowercase: "",
      number: "",
      confirm: "",
      form: "",
    });
  };

  if (isLoading) {
    return (
      <>
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
          <div className="text-xl font-semibold text-gray-600">Loading...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 bg-gray-200 rounded-full mb-4 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold">{formData.name}</h2>
            <p className="text-gray-600">{formData.username}</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="email"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  disabled={true}
                  className="mt-1 block w-full rounded-md border-gray-300 bg-[#eae9e9] shadow-sm p-2 border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Department
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Position
                </label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) =>
                    setFormData({ ...formData, position: e.target.value })
                  }
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                />
              </div>

              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300"
              >
                Edit
              </button>

              {isEditing && (
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                >
                  Save
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
              >
                Change Password
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ++++++++++++++ Password Change Modal ++++++++++++++++++ */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#000000bf] bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm relative">
            <div className="flex justify-between items-start mb-5">
              <h2 className="text-xl font-semibold">Change Password</h2>

              <button
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                className="absolute right-5 flex items-center text-gray-500 space-x-2"
                style={{ fontSize: "0.9rem" }}
              >
                <span>Show/Hide</span>
                {showPasswords ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Old Password</label>
              <input
                type={showPasswords ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">New Password</label>
              <input
                type={showPasswords ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              {errors.length && (
                <p className="text-red-500 text-sm mt-1">{errors.length}</p>
              )}
              {errors.uppercase && (
                <p className="text-red-500 text-sm mt-1">{errors.uppercase}</p>
              )}
              {errors.lowercase && (
                <p className="text-red-500 text-sm mt-1">{errors.lowercase}</p>
              )}
              {errors.number && (
                <p className="text-red-500 text-sm mt-1">{errors.number}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Confirm Password</label>
              <input
                type={showPasswords ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              {errors.confirm && (
                <p className="text-red-500 text-sm mt-1">{errors.confirm}</p>
              )}
              {errors.form && (
                <p className="text-red-500 text-sm mt-1">{errors.form}</p>
              )}
            </div>

            <p className="text-sky-800 text-sm my-5">
              *** Password must be at least 8 characters long and include at
              least one lowercase letter, one uppercase letter, and one number.
            </p>

            <div className="flex flex-col space-y-2 pt-5">
              <button
                type="button"
                onClick={handleModalClose}
                className="bg-[#D1D5DC] text-dark py-2 px-4 rounded-md hover:bg-[#d1d5dcc0] focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePasswordSave}
                className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-green-200"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {/* End Password Change Modal +++++++++++++++++ */}
    </>
  );
}
