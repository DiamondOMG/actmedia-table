"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/navbar/Navbar";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2"; // Import SweetAlert2 for notifications

interface FormData {
  username: string;
  name: string;
  department: string;
  position: string;
}

interface Errors {
  length: string;
  uppercase: string;
  lowercase: string;
  number: string;
  confirm: string;
  form: string;
}

interface Department {
  id: number;
  name: string;
  positions: string[];
}

interface UserData {
  user: {
    id: string | number;
  };
}

interface ApiResponse {
  email: string;
  password: string;
  name: string;
  department: string;
  position: string;
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState<any>(false); // State to manage edit mode
  const [isLoading, setIsLoading] = useState<boolean>(true); // State to manage loading state
  const [displayName, setDisplayName] = useState<string>(""); // State to manage display name
  const [displayUsername, setDisplayUsername] = useState<string>(""); // State to manage display username
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // State to manage modal visibility
  const [showPasswords, setShowPasswords] = useState<boolean>(false); // State to manage password visibility
  const [newPassword, setNewPassword] = useState<string>(""); // State to manage new password
  const [confirmPassword, setConfirmPassword] = useState<string>(""); // State to manage confirm password
  const [formProfileError, setFormProfileError] = useState<string>(""); // State to manage form profile error

  // State to manage form data profile
  const [formData, setFormData] = useState<FormData>({
    username: "",
    name: "",
    department: "",
    position: "",
  });

  // State to manage form errors
  const [errors, setErrors] = useState<Errors>({
    length: "",
    uppercase: "",
    lowercase: "",
    number: "",
    confirm: "",
    form: "",
  });

  //  Mock data of department ++++++++++++++++++++++++++++
  const mockDepartments: Department[] = [
    {
      id: 1,
      name: "Digital Product Development",
      positions: [
        "Digital Product Manager",
        "Software Engineer",
        "System Engineer & Project Coordinator",
      ],
    },
    {
      id: 2,
      name: "Operations",
      positions: [
        "Operations Manager",
        "Operations Officer",
        "Operations Coordinator",
      ],
    },
    {
      id: 3,
      name: "Media",
      positions: ["Media Manager", "Graphic Designer", "Video Editor"],
    },
    {
      id: 4,
      name: "Sales",
      positions: ["Sales Director", "Sales Manager", "Sales Supervisor"],
    },
  ];

  // Fetch profile data when component mounts +++++++++++++++++++++++++++++
  useEffect(() => {
    // Function to fetch profile data **************
    const fetchProfile = async () => {
      try {
        // Get user ID from localStorage *************************************
        const userData = localStorage.getItem("userData");
        console.log(userData);
        if (userData) {
          const { user } = JSON.parse(userData);

          // Fetch profile data
          const response = await axios.get<ApiResponse>(
            `/api/users/profile/${user.id}`
          );

          // Update form data with API response
          setFormData({
            username: response.data.email || "",
            name: response.data.name || "",
            department: response.data.department || "",
            position: response.data.position || "",
          });
          setDisplayName(response.data.name); // set name แสดงผลแยกต่างหาก
          setDisplayUsername(response.data.email); // set username แสดงผลแยกต่างหาก
        }
      } catch (error: unknown) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Function to handle form submission ++++++++++++++++++++++++++++++++++++
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check if any required field is empty  เชคการกรอกข้อมูลฟอร์ม Profile ต้องกรอกให้ครบ
    if (!formData.name || !formData.department || !formData.position) {
      setFormProfileError("Required All Fields"); // set error message
      return;
    }
    setIsEditing(false); // Disable edit mode after saving
    setFormProfileError(""); // Clear error if all fields are filled

    // Add API call to save data here ******************************
    try {
      // Get user ID from localStorage
      const userData = localStorage.getItem("userData");
      if (userData) {
        const parsedUserData = JSON.parse(userData) as UserData;
        const { user } = parsedUserData;

        // Make API call to update profile   ***************************
        await axios.put<ApiResponse>(`/api/users/profile/${user.id}`, {
          name: formData.name,
          department: formData.department,
          position: formData.position,
        });

        // Update successful
        setIsEditing(false);
        // Optional: Add success notification here
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Profile updated successfully",
          showConfirmButton: true,
        });
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      // Optional: Add error notification here
      Swal.fire({
        icon: "warning",
        title: "warning!",
        text: "Failed to update profile",
        showConfirmButton: true,
      });
    }
  };

  // Function to validate password +++++++++++++++++++++++++++++
  const validatePassword = (password: string): boolean => {
    const newErrors = {
      // Initialize error messages
      length: "",
      uppercase: "",
      lowercase: "",
      number: "",
      confirm: "",
      form: "",
    };

    if (password.length < 8) {
      newErrors.length = "Password must be at least 8 characters long"; // check length
    }
    if (!/[A-Z]/.test(password)) {
      newErrors.uppercase =
        "Password must include at least one uppercase letter"; // regex for uppercase
    }
    if (!/[a-z]/.test(password)) {
      newErrors.lowercase =
        "Password must include at least one lowercase letter"; // regex for lowercase
    }
    if (!/\d/.test(password)) {
      newErrors.number = "Password must include at least one number"; // regex for number
    }
    if (password !== confirmPassword) {
      newErrors.confirm = "Passwords do not match"; // check if passwords match
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === ""); // check if all errors are empty
  };

  // Function to handle password save ++++++++++++++++++++++++++++++++++++++++++++
  const handlePasswordSave = async (): Promise<void> => {
    console.log("new password: " + newPassword);
    // Check if all fields are filled
    if (!newPassword || !confirmPassword) {
      setErrors({ ...errors, form: "Required All Fields" });
      return;
    }
    if (validatePassword(newPassword)) {
      // validate password
      try {
        const userData = localStorage.getItem("userData"); // get user ID from localStorage
        if (userData) {
          const { user } = JSON.parse(userData);
          await axios.put<ApiResponse>(`/api/users/profile/${user.id}`, {
            // update password
            password: newPassword,
          });
          setIsModalOpen(false);
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Password changed successfully",
            timer: 1500,
            showConfirmButton: false,
          });
          handleModalClose(); // clear form
        }
      } catch (error: any) {
        console.error("Password change error:", error);
        setErrors({
          ...errors,
          form: error.response?.data?.error || "Failed to change password",
        });

        // Optional: Add error notification here
        Swal.fire({
          icon: "warning",
          title: "warning!",
          text: "Failed to change password",
          showConfirmButton: true,
        });
      }
    }
  };

  // Function to close the modal and reset form fields  ++++++++++++++++++++++++++++
  const handleModalClose = () => {
    setIsModalOpen(false);
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

  // Loading data state +++++++++++++++++++++++++++++++++++++
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
        <div className="bg-white m-3 p-8 rounded-lg shadow-md w-full max-w-md">
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
            <h2 className="text-xl font-semibold">{displayName}</h2>
            <p className="text-gray-600">{displayUsername}</p>
          </div>

          {/* ******************* Form profile ******************** */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email ( @omgthailand.com )
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
                  Full name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  disabled={!isEditing}
                  className="mt-1 disabled:text-[#5C5C5C] block w-full rounded-md  bg-white border-gray-300 shadow-sm p-2 border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Department
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      department: e.target.value, // Update department
                      position: "", // Reset position when department changes
                    });
                  }}
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                >
                  <option value="">Select Department</option>
                  {mockDepartments.map(
                    (
                      dept // Loop through mock data
                    ) => (
                      <option key={dept.id} value={dept.name}>
                        {dept.name}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Position
                </label>
                <select
                  value={formData.position}
                  onChange={
                    (e) =>
                      setFormData({ ...formData, position: e.target.value }) // Update position
                  }
                  disabled={!isEditing || !formData.department}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                >
                  <option value="">Select Position</option>
                  {mockDepartments
                    .find((dept) => dept.name === formData.department)
                    ?.positions.map(
                      (
                        position // Loop through positions based on selected department
                      ) => (
                        <option key={position} value={position}>
                          {position}
                        </option>
                      )
                    )}
                </select>
              </div>
              {formProfileError && (
                <p className="text-red-500 text-sm mt-1 bg-red-50 p-2 rounded">
                  {formProfileError}
                </p>
              )}
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
                  className="w-full bg-[#118DCE] text-white py-2 px-4 rounded-md hover:bg-[#118ccebe]"
                >
                  Save
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-[#FFC107] text-gray-800 py-2 px-4 rounded-md hover:bg-[#ffc10783]"
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
                className="bg-[#118DCE] text-white py-2 px-4 rounded-md hover:bg-[#118cced1] focus:outline-none focus:ring-2 focus:ring-grey-200"
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
