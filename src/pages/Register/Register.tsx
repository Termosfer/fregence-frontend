import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff, FiUser, FiMail, FiLock } from "react-icons/fi";
import api from "../../api/axios"; // Sizin axios instance
import type { AxiosError } from "axios";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  // Parolun görünməsi üçün state-lər
  const [showPass, setShowPass] = useState<boolean>(false);

  // Form datası
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Sadə validasiya
    if (!formData.name || !formData.email || !formData.password) {
      toast.warn("Zəhmət olmasa bütün xanaları doldurun!");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Şifrə ən azı 6 simvoldan ibarət olmalıdır!");
      return;
    }

    setLoading(true);
    try {
      // Backend-ə göndərilən data (backend-in gözlədiyi formatda)
      const registerData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };

      await api.post("/auth/register", registerData);

      toast.success("Qeydiyyat uğurla tamamlandı! Giriş edin.");

      // Uğurlu qeydiyyatdan sonra Login səhifəsinə göndəririk
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const errorMsg =
        error.response?.data?.message || "Qeydiyyat zamanı xəta baş verdi!";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    
      <div className=" flex items-center justify-center bg-gray-50 px-4  font-[Playfair] h-screen">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-xl border border-gray-100">
          <h2 className="text-3xl font-bold text-center mb-2 tracking-tight">
            Create Account
          </h2>
          <p className="text-center text-gray-500 mb-8 text-sm italic">
            Join our fragrance world
          </p>

          <form onSubmit={handleRegister} className="space-y-5">
            {/* Full Name */}
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none transition text-sm"
                placeholder="Name"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none transition text-sm"
                placeholder="Email Address"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPass ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 pl-10 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none transition text-sm"
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

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-lg font-bold text-white tracking-widest transition-all ${
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
