import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";
import api from "../../api/axios";
import type { AxiosError } from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  // Xətaları izləmək üçün state
  const [errors, setErrors] = useState({ email: "", password: "" });

  useEffect(() => {
    if (serverError) setServerError("");
  }, [email, password]);
  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setServerError(""); 

  // 1. Validasiya məntiqi - MÜTLƏQ AKTİV OLMALIDIR
  let hasError = false;
  const newErrors = { email: "", password: "" };

  if (!email.trim()) {
    newErrors.email = "Email is required";
    hasError = true;
  }
  if (!password.trim()) {
    newErrors.password = "Password is required";
    hasError = true;
  }

  setErrors(newErrors);

  // Əgər inputlar boşdursa, funksiyanı saxla, API-ya sorğu göndərmə!
  if (hasError) return; 

  setLoading(true);

  // KRİTİK ADDIM: Yeni girişdən əvvəl köhnə qalıqları silirik
  localStorage.clear(); 

  try {
    const response = await api.post("/auth/login", { email, password });

    // Yalnız sorğu uğurlu olanda (200-299 status) bura işləyəcək
    console.log("Login successful:", response.data);

    localStorage.setItem("token", response.data.token);
    localStorage.setItem("role", response.data.role);
    localStorage.setItem("userName", response.data.name.split(" ")[0]);

    toast.success(`Welcome back, ${response.data.name}!`);

    // Uğurlu girişdən sonra yönləndiririk
    setTimeout(() => {
      window.location.href = "/";
    }, 1500);

  } catch (err) {
    // Səhv parol yazıldıqda (401, 400 və s.) birbaşa bura düşəcək
    console.log("Login failed!");
    
    const error = err as AxiosError<{ message: string }>;
    const errorMsg = error.response?.data?.message || "Invalid email or password!";
    
    setServerError(errorMsg); // Xətanı göstəririk
    // HEÇ BİR YÖNLƏNDİRMƏ (navigate) ETMİRİK!
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex items-center justify-center bg-gray-50 px-4 font-[Playfair] h-screen">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-8 tracking-tight text-gray-800">
          Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <div className="flex flex-col gap-1">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: "" }); // Yazmağa başlayanda xətanı sil
              }}
              className={`w-full p-3 border rounded-lg focus:ring-2 outline-none transition ${
                errors.email
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-black"
              }`}
              placeholder="example@mail.com"
            />
            {errors.email && (
              <span className="text-red-500 text-xs font-bold animate-pulse text-left">
                {errors.email}*
              </span>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: "" });
                }}
                className={`w-full p-3 pr-12 border rounded-lg focus:ring-2 outline-none transition ${
                  errors.password
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-black"
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black cursor-pointer"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
            {errors.password && (
              <span className="text-red-500 text-xs font-bold animate-pulse text-left">
                {errors.password}*
              </span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-bold text-white transition-all mt-2 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black hover:bg-gray-800 active:scale-95"
            }`}
          >
            {loading ? "Signing..." : "SIGN IN"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-black font-bold hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
