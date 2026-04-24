import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff, FiUser, FiMail, FiLock } from "react-icons/fi";
import api from "../../api/axios"; 
import type { AxiosError } from "axios";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [showPass, setShowPass] = useState<boolean>(false);

  // Form datası
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Xətaları izləmək üçün state
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // İstifadəçi yazmağa başlayanda həmin xananın xətasını silirik
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasiya məntiqi
    let hasError = false;
    const newErrors = { name: "", email: "", password: "" };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      hasError = true;
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      hasError = true;
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
      hasError = true;
    } else if (formData.password.length < 6) {
      newErrors.password = "Minimum 6 characters required";
      hasError = true;
    }

    setErrors(newErrors);
    if (hasError) return;

    setLoading(true);
    try {
      await api.post("/auth/register", formData);
      toast.success("Account created successfully! Please login.");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const errorMsg = error.response?.data?.message || "Registration failed!";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-50 px-4 font-[Playfair] h-screen">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-xl border border-gray-100">
        <h2 className="text-3xl font-bold text-center mb-2 tracking-tight text-gray-800">
          Create Account
        </h2>
        <p className="text-center text-gray-500 mb-8 text-sm italic">
          Join our fragrance world
        </p>

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Full Name */}
          <div className="flex flex-col gap-1">
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full p-3 pl-10 border rounded-lg focus:ring-2 outline-none transition text-sm ${
                  errors.name ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-black"
                }`}
                placeholder="Full Name"
              />
            </div>
            {errors.name && (
              <span className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-1 animate-pulse text-left">
                {errors.name}*
              </span>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-3 pl-10 border rounded-lg focus:ring-2 outline-none transition text-sm ${
                  errors.email ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-black"
                }`}
                placeholder="Email Address"
              />
            </div>
            {errors.email && (
              <span className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-1 animate-pulse text-left">
                {errors.email}*
              </span>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPass ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full p-3 pl-10 pr-12 border rounded-lg focus:ring-2 outline-none transition text-sm ${
                  errors.password ? "border-red-500 focus:ring-red-200 " : "border-gray-300 focus:ring-black"
                }`}
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black cursor-pointer"
              >
                {showPass ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
            {errors.password && (
              <span className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-1 animate-pulse text-left">
                {errors.password}*
              </span>
            )}
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 rounded-lg font-bold text-white tracking-widest transition-all mt-2 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black hover:bg-gray-800 active:scale-95 shadow-lg shadow-gray-200"
            }`}
          >
            {loading ? "CREATING ACCOUNT..." : "REGISTER"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-black font-bold hover:underline">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;