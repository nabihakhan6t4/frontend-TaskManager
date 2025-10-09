import React, { useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // 🔹 Input Validation
    if (!email || !validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password || password.length < 8) {
      setError("Your password must be at least 8 characters long.");
      return;
    }

    // 🔹 Login Logic (API Call)
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token, role } = response.data;

      if (token) {
        localStorage.setItem("token", token);

        // Redirect based on user role
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h2 className="text-xl font-semibold text-black">Welcome Back</h2>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Please enter your login credentials to access your account.
        </p>

        <form onSubmit={handleLogin}>
          <Input
            type="text"
            label="Email Address"
            placeholder="Enter your email address"
            value={email}
            onChange={({ target }) => setEmail(target.value)}
          />

          <Input
            type="password"
            label="Password"
            placeholder="At least 8 characters"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button type="submit" className="btn-primary">
            Log In
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            Don’t have an account?{" "}
            <Link className="font-medium text-blue-600 underline" to="/SignUp">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
