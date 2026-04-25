import { useState, useEffect } from "react";
import { useUser } from "../../hooks/useUser";
import { FiUser,  FiEye, FiEyeOff,  FiShield, FiLoader } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { UserProfile, PasswordUpdateData } from "../../types/perfume";
import { useQueryClient } from "@tanstack/react-query";

const Profile = () => {
  const { user, updateProfile, isUpdating, changePassword, isChangingPassword } = useUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [profileStatus, setProfileStatus] = useState<{ msg: string; type: "success" | "error" | null }>({ msg: "", type: null });
  const [passStatus, setPassStatus] = useState<{ msg: string; type: "success" | "error" | null }>({ msg: "", type: null });

  const [profile, setProfile] = useState<UserProfile>({ name: "", email: "" });
  const [passData, setPassData] = useState<PasswordUpdateData>({ oldPassword: "", newPassword: "" });
  
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  useEffect(() => {
    if (user) setProfile({ name: user.name, email: user.email });
  }, [user]);

  // Ümumi Logout Funksiyası
  const forceLogout = (message: string) => {
    localStorage.clear();
    queryClient.clear(); // React Query cache-ini silir
    toast.info(message);
    setTimeout(() => navigate("/login"), 1000);
  };

  // 1. PROFIL YENİLƏMƏ
  const handleInfoUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (profile.name === user?.name && profile.email === user?.email) {
      setProfileStatus({ msg: "No changes detected.", type: "error" });
      return;
    }

    updateProfile(profile, {
      onSuccess: () => {
        setProfileStatus({ msg: "Profile updated! Logging out...", type: "success" });
        forceLogout("Security notice: Profile changed. Please login again.");
      },
      onError: (err) => {
        setProfileStatus({ msg: err.response?.data?.message || "Update failed.", type: "error" });
      }
    });
  };

  // 2. PAROL YENİLƏMƏ
  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passData.oldPassword || !passData.newPassword) {
      setPassStatus({ msg: "Fill all fields.", type: "error" });
      return;
    }

    changePassword(passData, {
      onSuccess: () => {
        setPassStatus({ msg: "Password changed! Logging out...", type: "success" });
        forceLogout("Security notice: Password changed. Please login again.");
      },
      onError: (err) => {
        setPassStatus({ msg: err.response?.data?.message || "Wrong current password.", type: "error" });
      }
    });
  };

  return (
    <div className="py-16 px-4 sm:px-8 lg:px-20 font-[Playfair] bg-[#fafafa] min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold uppercase tracking-tighter mb-12">My Account</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* PROFILE CARD */}
          <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col">
            <h2 className="text-xl font-bold uppercase tracking-widest mb-10 flex items-center gap-3">
              <FiUser /> Profile Info
            </h2>
            <form onSubmit={handleInfoUpdate} className="space-y-8 flex-1">
              <div className="group">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-2">Full Name</label>
                <input 
                  value={profile.name} 
                  autoComplete="new-name"
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })} 
                  className="w-full border-b border-gray-100 py-2 outline-none focus:border-black transition-all bg-transparent text-sm" 
                />
              </div>
              <div className="group">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={profile.email} 
                  autoComplete="new-email"
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })} 
                  className="w-full border-b border-gray-100 py-2 outline-none focus:border-black transition-all bg-transparent text-sm" 
                />
              </div>
              <div>
                <button disabled={isUpdating} className="w-full bg-black text-white py-4 rounded-2xl text-[10px] font-bold uppercase tracking-[3px] border-2 hover:bg-white  hover:text-black transition-all disabled:bg-gray-200 cursor-pointer flex justify-center items-center gap-2">
                  {isUpdating ? <FiLoader className="animate-spin" /> : "Save & Re-login"}
                </button>
                {profileStatus.msg && (
                  <p className={`mt-3 text-[11px] font-bold text-center uppercase tracking-widest ${profileStatus.type === "success" ? "text-green-600" : "text-red-500"}`}>
                    {profileStatus.msg}
                  </p>
                )}
              </div>
            </form>
          </div>

          {/* SECURITY CARD */}
          <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col">
            <h2 className="text-xl font-bold uppercase tracking-widest mb-10 flex items-center gap-3">
              <FiShield /> Security
            </h2>
            <form onSubmit={handlePasswordUpdate} className="space-y-8 flex-1">
              <div className="relative group">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-2">Current Password</label>
                <input 
                  type={showOld ? "text" : "password"} 
                  autoComplete="current-password"
                  value={passData.oldPassword} 
                  onChange={(e) => setPassData({ ...passData, oldPassword: e.target.value })} 
                  className="w-full border-b border-gray-100 py-2 pr-10 outline-none focus:border-black transition-all bg-transparent text-sm" 
                />
                <button type="button" onClick={() => setShowOld(!showOld)} className="absolute right-0 bottom-2 text-gray-400">{showOld ? <FiEyeOff /> : <FiEye />}</button>
              </div>
              <div className="relative group">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-2">New Password</label>
                <input 
                  type={showNew ? "text" : "password"} 
                  autoComplete="new-password"
                  value={passData.newPassword} 
                  onChange={(e) => setPassData({ ...passData, newPassword: e.target.value })} 
                  className="w-full border-b border-gray-100 py-2 pr-10 outline-none focus:border-black transition-all bg-transparent text-sm" 
                />
                <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-0 bottom-2 text-gray-400">{showNew ? <FiEyeOff /> : <FiEye />}</button>
              </div>
              <div>
                <button disabled={isChangingPassword} className="w-full bg-white text-black border-2 border-black py-4 rounded-2xl text-[10px] font-bold uppercase tracking-[3px] hover:bg-black hover:text-white transition-all disabled:opacity-30 cursor-pointer flex justify-center items-center gap-2">
                  {isChangingPassword ? <FiLoader className="animate-spin" /> : "Update & Re-login"}
                </button>
                {passStatus.msg && (
                  <p className={`mt-3 text-[11px] font-bold text-center uppercase tracking-widest ${passStatus.type === "success" ? "text-green-600" : "text-red-500"}`}>
                    {passStatus.msg}
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;