import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData extends LoginData {
  name: string;
  department: string;
  position: string;
}

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const login = useMutation({
    mutationFn: async (data: LoginData) => {
      // Show loading alert
      Swal.fire({
        title: "กำลังเข้าสู่ระบบ",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Login failed");
      }

      return response.json();
    },
    onSuccess: (data) => {
      // Store user data in React Query cache
      queryClient.setQueryData(["user"], data.user);

      // Store in localStorage
      localStorage.setItem(
        "userData",
        JSON.stringify({
          user: data.user,
          token: data.token, // assuming you have a token in response
          lastLogin: new Date().toISOString(),
        })
      );

      Swal.fire({
        icon: "success",
        title: "เข้าสู่ระบบสำเร็จ",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        router.push("/home");
      });
    },
    onError: (error: Error) => {
      Swal.fire({
        icon: "error",
        title: "เข้าสู่ระบบไม่สำเร็จ",
        text: error.message,
        confirmButtonText: "ตกลง",
      });
    },
  });

  const register = useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Registration failed");
      }

      return response.json();
    },
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "ลงทะเบียนสำเร็จ",
        text: "กรุณาเข้าสู่ระบบ",
      });

      router.push("/");
    },
    onError: (error: Error) => {
      Swal.fire({
        icon: "error",
        title: "ลงทะเบียนไม่สำเร็จ",
        text: error.message,
      });
    },
  });

  return { login, register };
}
