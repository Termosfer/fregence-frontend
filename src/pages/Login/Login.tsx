import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiAlertCircle, FiEye, FiEyeOff } from "react-icons/fi";
import api from "../../api/axios";
import type { AxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";

const Login = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient(); // <--- 1. BUNU ƏLAVƏ EDİN
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });

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

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("userName", response.data.name.split(" ")[0]);
      window.dispatchEvent(new Event("auth-change"));
      toast.success(`Welcome , ${response.data.name}!`);

      queryClient.fetchQuery({ queryKey: ["cart"] });
      queryClient.fetchQuery({ queryKey: ["wishlist"] });
      // Uğurlu girişdən sonra yönləndiririk
      navigate("/");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      if (error.response?.status === 401 || error.response?.status === 400) {
        setServerError("Email or password is wrong");
      } else {
        // Digər gözlənilməz sistem xətaları üçün
        setServerError("An unexpected error occurred. Please try again.");
      }
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
              autoComplete="current-email"
              onChange={(e) => {
                setEmail(e.target.value);
                // Yazmağa başlayan kimi həm lokal, həm server xətasını silirik
                if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                if (serverError) setServerError("");
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
                autoComplete="current-password"
                onChange={(e) => {
                  setPassword(e.target.value);
                  // Yazmağa başlayan kimi həm lokal, həm server xətasını silirik
                  if (errors.password)
                    setErrors((prev) => ({ ...prev, password: "" }));
                  if (serverError) setServerError("");
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

          {/* SERVER ERROR MESSAGE (Burada göstəririk) */}
          {serverError && (
            <div className="flex items-center gap-2 bg-red-50 p-3 rounded-lg border border-red-100 animate-in fade-in slide-in-from-top-1 duration-300">
              <FiAlertCircle className="text-red-500 shrink-0" />
              <p className="text-red-600 text-[11px] font-bold uppercase tracking-tighter">
                {serverError}
              </p>
            </div>
          )}
          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-bold text-white transition-all mt-2 cursor-pointer ${
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
