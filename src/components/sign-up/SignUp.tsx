"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import AppTheme from "../shared-theme/AppTheme";
import ColorModeSelect from "../shared-theme/ColorModeSelect";
import { GoogleIcon, SitemarkIcon } from "./components/CustomIcons";
import { useAuth } from "@/hook/useAuth";
import Swal from "sweetalert2";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

interface Department {
  id: number;
  name: string;
  positions: string[];
}

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  maxHeight: "90vh", // ควบคุมความสูงสูงสุด
  overflowY: "auto", // เพิ่ม scroll bar ในแนวตั้งเมื่อเนื้อหาเกินขนาด
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    width: "450px",
  },
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
  // เพิ่มสไตล์ให้กับ scrollbar
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-track": {
    background:
      theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.05)"
        : "rgba(0, 0, 0, 0.05)",
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb": {
    background:
      theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.2)"
        : "rgba(0, 0, 0, 0.2)",
    borderRadius: "4px",
    "&:hover": {
      background:
        theme.palette.mode === "dark"
          ? "rgba(255, 255, 255, 0.3)"
          : "rgba(0, 0, 0, 0.3)",
    },
  },
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

export default function SignUp(props: { disableCustomTheme?: boolean }) {
  const { register } = useAuth();
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    department: "",
    position: "",
  });
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState("");
  const [showPasswords, setShowPasswords] = React.useState<{
    password: boolean;
    confirmPassword: boolean;
  }>({
    password: false,
    confirmPassword: false,
  });

  // Add the mock data
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateInputs = () => {
    const email = document.getElementById("email") as HTMLInputElement;
    const password = document.getElementById("password") as HTMLInputElement;
    const confirmPassword = document.getElementById(
      "confirmPassword"
    ) as HTMLInputElement;
    const name = document.getElementById("name") as HTMLInputElement;

    // ตรวจสอบว่าทุกฟิลด์ต้องไม่ว่าง
    if (
      !email.value ||
      !password.value ||
      !confirmPassword.value ||
      !name.value ||
      !formData.department ||
      !formData.position
    ) {
      Swal.fire({
        icon: "error",
        title: "Required All Fields",
        text: "Please fill out all fields before submitting.",
      });
      return false; // หยุดการตรวจสอบทันที
    }

    let isValid = true;

    // Validate email format  *************
    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      Swal.fire({
        icon: "error",
        title: "Invalid Email",
        text: "Please enter a valid email address.",
      });
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    // Validate password length ************

    // Password validation
    if (!password.value) {
      setPasswordError(true);
      setPasswordErrorMessage("Password is required.");
      Swal.fire({
        icon: "error",
        title: "Invalid Password",
        text: "Password is required.",
      });
      isValid = false;
    } else {
      // Check length
      if (password.value.length < 8) {
        setPasswordError(true);
        setPasswordErrorMessage("Password must be at least 8 characters long.");
        Swal.fire({
          icon: "error",
          title: "Invalid Password",
          text: "Password must be at least 8 characters long.",
        });
        isValid = false;
      }
      // Check uppercase
      else if (!/[A-Z]/.test(password.value)) {
        setPasswordError(true);
        setPasswordErrorMessage(
          "Password must include at least one uppercase letter."
        );
        Swal.fire({
          icon: "error",
          title: "Invalid Password",
          text: "Password must include at least one uppercase letter.",
        });
        isValid = false;
      }
      // Check lowercase
      else if (!/[a-z]/.test(password.value)) {
        setPasswordError(true);
        setPasswordErrorMessage(
          "Password must include at least one lowercase letter."
        );
        Swal.fire({
          icon: "error",
          title: "Invalid Password",
          text: "Password must include at least one lowercase letter.",
        });
        isValid = false;
      }
      // Check number
      else if (!/\d/.test(password.value)) {
        setPasswordError(true);
        setPasswordErrorMessage("Password must include at least one number.");
        Swal.fire({
          icon: "error",
          title: "Invalid Password",
          text: "Password must include at least one number.",
        });
        isValid = false;
      } else {
        setPasswordError(false);
        setPasswordErrorMessage("");
      }
    }

    // Validate name ************
    if (!name.value || name.value.length < 1) {
      setNameError(true);
      setNameErrorMessage("Name is required.");
      Swal.fire({
        icon: "error",
        title: "Invalid Name",
        text: "Name is required.",
      });
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage("");
    }

    // Validate department
    if (!formData.department) {
      Swal.fire({
        icon: "error",
        title: "Invalid Department",
        text: "Please select a department.",
      });
      return false; // หยุดการตรวจสอบทันที
      // isValid = false;
    }

    // Validate position
    if (!formData.position) {
      Swal.fire({
        icon: "error",
        title: "Invalid Position",
        text: "Please select a position.",
      });
      return false; // หยุดการตรวจสอบทันที
      // isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Passwords do not match",
        text: "Please check your passwords and try again.",
      });
      return;
    }

    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // เรียก validateInputs และตรวจสอบผลลัพธ์
    if (!validateInputs()) {
      return; // หยุดการทำงานหากการตรวจสอบไม่ผ่าน
    }

    register.mutate({
      email: formData.email,
      password: formData.password,
      name: formData.name,
      department: formData.department,
      position: formData.position,
    });
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <ColorModeSelect sx={{ position: "fixed", top: "1rem", right: "1rem" }} />
      <SignUpContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <SitemarkIcon />
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
          >
            Sign up
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <FormControl>
              <FormLabel htmlFor="email">Email ( @omgthailand.com )</FormLabel>
              <TextField
                fullWidth
                id="email"
                name="email"
                placeholder="your@email.com"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="name">Full name</FormLabel>
              <TextField
                autoComplete="name"
                name="name"
                fullWidth
                id="name"
                placeholder="Jon Snow"
                value={formData.name}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                // required
                fullWidth
                name="password"
                placeholder="••••••"
                type={showPasswords.password ? "text" : "password"}
                id="password"
                value={formData.password}
                onChange={handleChange}
                slotProps={{
                  input: {
                    endAdornment: (
                      <Button
                        onClick={() =>
                          setShowPasswords((prev) => ({
                            ...prev,
                            password: !prev.password,
                          }))
                        }
                        sx={{
                          minWidth: "auto", // ลดขนาดปุ่ม
                          padding: 0, // เอา padding ออก
                          backgroundColor: "transparent", // ไม่มีสีพื้นหลัง
                          "&:hover": {
                            backgroundColor: "transparent", // ไม่มีสีพื้นหลังตอน hover
                          },
                        }}
                      >
                        {showPasswords.password ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </Button>
                    ),
                  },
                }}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
              <TextField
                // required
                fullWidth
                name="confirmPassword"
                placeholder="••••••"
                type={showPasswords.confirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                slotProps={{
                  input: {
                    endAdornment: (
                      <Button
                        onClick={() =>
                          setShowPasswords((prev) => ({
                            ...prev,
                            confirmPassword: !prev.confirmPassword,
                          }))
                        }
                        sx={{
                          minWidth: "auto", // ลดขนาดปุ่ม
                          padding: 0, // เอา padding ออก
                          backgroundColor: "transparent", // ไม่มีสีพื้นหลัง
                          "&:hover": {
                            backgroundColor: "transparent", // ไม่มีสีพื้นหลังตอน hover
                          },
                        }}
                      >
                        {showPasswords.confirmPassword ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </Button>
                    ),
                  },
                }}
              />
            </FormControl>
            <p className="text-sky-800 text-sm mt-0">
              *** Password must be at least 8 characters long and include at
              least one lowercase letter, one uppercase letter, and one number.
            </p>

            <FormControl>
              <FormLabel htmlFor="department">Department</FormLabel>
              <TextField
                select
                fullWidth
                name="department"
                id="department"
                value={formData.department}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    department: e.target.value,
                    position: "", // Reset position when department changes
                  });
                }}
                slotProps={{
                  select: {
                    native: true,
                  },
                }}
                sx={{
                  "& select": {
                    padding: "7px",
                  },
                }}
              >
                <option value="">Select Department</option>
                {mockDepartments.map((dept) => (
                  <option key={dept.id} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </TextField>
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="position">Position</FormLabel>
              <TextField
                select
                fullWidth
                name="position"
                id="position"
                value={formData.position}
                onChange={(e) =>
                  setFormData({ ...formData, position: e.target.value })
                }
                disabled={!formData.department}
                slotProps={{
                  select: {
                    native: true,
                  },
                }}
                sx={{
                  "& select": {
                    padding: "7px",
                  },
                }}
              >
                <option value="">Select Position</option>
                {mockDepartments
                  .find((dept) => dept.name === formData.department)
                  ?.positions.map((position) => (
                    <option key={position} value={position}>
                      {position}
                    </option>
                  ))}
              </TextField>
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}
            >
              Sign up
            </Button>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography sx={{ textAlign: "center" }}>
              Already have an account?{" "}
              <Link href="/" variant="body2" sx={{ alignSelf: "center" }}>
                Sign in
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignUpContainer>
    </AppTheme>
  );
}
