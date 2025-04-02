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

interface User {
  id: string;
  email: string;
  name: string;
  permissions: any[];
}

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const login = useMutation({
    mutationFn: async (data: LoginData) => {
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
      // เก็บข้อมูล user ไว้ใน React Query cache
      queryClient.setQueryData(["user"], data.user);

      Swal.fire({
        icon: "success",
        title: "เข้าสู่ระบบสำเร็จ",
        timer: 1500,
      });

      router.push("/dashboard");
    },
    onError: (error: Error) => {
      Swal.fire({
        icon: "error",
        title: "เข้าสู่ระบบไม่สำเร็จ",
        text: error.message,
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
