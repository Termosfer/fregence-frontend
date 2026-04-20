import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";
import api from "../../api/axios"; // Sizin axios instance
import type { AxiosError } from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.warn("Zəhmət olmasa bütün xanaları doldurun!");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/login", { email, password });
      
      // 1. Tokeni yadda saxla
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role); // Məsələn: "ADMIN"
      localStorage.setItem("userName", response.data.name.split(" ")[0]); // Adın bir hissəsi
      // 2. Uğurlu bildiriş göstər
      toast.success("Xoş gəldiniz! Giriş uğurludur.");

      // 3. 2 saniyə sonra Ana Səhifəyə yönləndir
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const errorMsg =
        error.response?.data?.message || "Email və ya parol səhvdir!";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" flex items-center justify-center bg-gray-50 px-4 font-[Playfair] h-screen">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-8 tracking-tight">
          Login
        </h2> 

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email */}
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none transition"
              placeholder="example@gmail.com"
            />
          </div>

          {/* Password with Eye Icon */}
          <div className="relative">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none transition"
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
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-bold text-white transition-all ${
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
