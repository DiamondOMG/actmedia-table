"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/navbar/Navbar";
import axios from "axios";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    department: "",
    position: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    // Add API call to save data here
  };

  useEffect(() => {
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

  if (isLoading) {
    return (
      <>
        <Navbar />
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
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
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
                className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
              >
                Change Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
