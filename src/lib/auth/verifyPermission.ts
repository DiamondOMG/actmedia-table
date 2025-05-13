interface Permission {
  menu: string;
  level: number;
}

interface UserData {
  user: {
    permissions: Permission[];
  };
}

export const verifyPermission = (path: string): boolean => {
  try {
    // Get user data from localStorage
    const userDataStr = localStorage.getItem("userData");
    if (!userDataStr) {
      console.log("No userData found in localStorage");
      return false;
    }

    // Parse user data
    const userData: UserData = JSON.parse(userDataStr);
    console.log("userDataStr", userData);

    // Split path and get the second segment (sequence)
    const pathSegments = path.split("/").filter(Boolean); // ลบส่วนที่ว่างเปล่า
    const menu = pathSegments[1] || pathSegments[0] || ""; // ใช้ segment ที่ 2 (index 1) หรือ fallback ไปที่ segment แรก
    console.log("menu", menu);

    // Find matching permission
    const permission = userData.user.permissions.find((p) => p.menu === menu);
    if (!permission) {
      console.log(`No permission found for menu: ${menu}`);
    } else {
      console.log("permission found", permission);
    }

    // Return true if permission level is greater than or equal to 2
    return permission ? permission.level >= 2 : false;
  } catch (error) {
    console.error("Error verifying permission:", error);
    return false;
  }
};