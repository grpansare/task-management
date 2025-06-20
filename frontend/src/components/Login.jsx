import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../authcontext/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";

import { Box, TextField, IconButton, InputAdornment } from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const validateField = (field, value) => {
    switch (field) {
      case "email":
        if (!value) return "Email is required";
        if (!/\S+@\S+\.\S+/.test(value)) return "Email is invalid";
        break;
      case "password":
        if (!value) return "Password is required";
        if (value.length < 6) return "Password must be at least 6 characters";
        break;
      default:
        return "";
    }
    return "";
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);

    // Live clear error only if already touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      email: validateField("email", email),
      password: validateField("password", password),
    };

    setErrors(newErrors);
    setTouched({ email: true, password: true });
    return !Object.values(newErrors).some(Boolean);
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8080/auth/login", {
        email,
        password,
      });

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Login successful!",
          toast: true,
          timer: 2000,
          showConfirmButton: false,
          position: "top-end",
        });

        // Save user details in context/localStorage etc.
        login({
          email,
          username: response.data.username,
          token: response.data.token,
          userid: response.data.id,
        });
        navigate("/dashboard");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login failed",
        text: error?.response?.data?.message || "Invalid credentials",
        toast: true,
        timer: 2500,
        showConfirmButton: false,
        position: "top-end",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="relative bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md border border-gray-200">
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl mb-6 shadow-lg">
              <AccountCircle className="text-white text-2xl" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-3">
              Welcome Back
            </h1>
            <p className="text-gray-600 text-lg">
              Sign in to manage your tasks
            </p>
          </div>

          <div className="space-y-8">
            {/* Email Field */}
            <Box sx={{ display: "flex", alignItems: "flex-end" }}>
              <AccountCircle sx={{ color: "action.active", mr: 1, my: 0.5 }} />
              <TextField
                name="email"
                label="Email"
                variant="standard"
                fullWidth
                value={email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.email}
                helperText={touched.email && errors.email}
              />
            </Box>

            {/* Password Field */}
            <Box sx={{ display: "flex", alignItems: "flex-end" }}>
              <LockIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
              <TextField
                name="password"
                label="Password"
                variant="standard"
                type={showPassword ? "text" : "password"}
                fullWidth
                value={password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.password}
                helperText={touched.password && errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <button
              onClick={handleLogin}
              disabled={loading}
              className={`w-full relative group overflow-hidden bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 text-white py-4 rounded-2xl font-semibold text-lg shadow-2xl transition-all duration-300 ${
                loading
                  ? "opacity-60 cursor-not-allowed"
                  : "hover:shadow-purple-500/25 hover:scale-105 active:scale-95"
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    ></path>
                  </svg>
                ) : (
                  <>
                    Sign In
                    <div className="w-0 group-hover:w-5 transition-all duration-300 overflow-hidden">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </div>
                  </>
                )}
              </span>
            </button>
          </div>

          <div className="text-center mt-8">
            <div className="flex items-center justify-center mb-6">
              <div className="h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent w-full"></div>
              <span className="px-4 text-gray-400 text-sm">or</span>
              <div className="h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent w-full"></div>
            </div>

            <p className="text-gray-700 text-lg">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/register")}
                className="text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text hover:from-purple-300 hover:to-pink-300 font-semibold transition-all duration-300 hover:underline underline-offset-4"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
