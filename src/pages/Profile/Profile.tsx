import { useState, useEffect } from "react";
import { useUser } from "../../hooks/useUser";
import {
  FiUser,
  FiLock,
  FiEye,
  FiEyeOff,
  FiMail,
  FiShield,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const {
    user,
    updateProfile,
    isUpdating,
    changePassword,
    isChangingPassword,
  } = useUser();
  const navigate = useNavigate();
  // Profil State
  const [profile, setProfile] = useState({ name: "", email: "" });

  // Parol State
  const [passData, setPassData] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  useEffect(() => {
    if (user) setProfile({ name: user.name, email: user.email });
  }, [user]);

  const handleInfoUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(profile);
    navigate("/");
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    changePassword({
      oldPassword: passData.oldPassword,
      newPassword: passData.newPassword,
    });
    navigate("/");
  };

  return (
    <div className="py-16 px-4 sm:px-8 lg:px-20 font-[Playfair] bg-[#fafafa] min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold uppercase tracking-tighter text-gray-900">
            My Account
          </h1>
          <p className="text-gray-400 text-sm mt-2 uppercase tracking-widest">
            Manage your profile and security settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* CARD 1: GENERAL INFORMATION */}
          <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-gray-100 transition-all hover:shadow-md">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-black">
                <FiUser size={20} />
              </div>
              <h2 className="text-xl font-bold uppercase tracking-widest">
                Profile Info
              </h2>
            </div>

            <form onSubmit={handleInfoUpdate} className="space-y-8">
              <div className="group relative">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-2 group-focus-within:text-black transition-colors">
                  Full Name
                </label>
                <div className="flex items-center gap-3 border-b border-gray-100 py-2 group-focus-within:border-black transition-all">
                  <FiUser className="text-gray-300" />
                  <input
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                    className="w-full outline-none bg-transparent text-sm placeholder:text-gray-200"
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              <div className="group relative">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-2 group-focus-within:text-black transition-colors">
                  Email Address
                </label>
                <div className="flex items-center gap-3 border-b border-gray-100 py-2 group-focus-within:border-black transition-all">
                  <FiMail className="text-gray-300" />
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                    className="w-full outline-none bg-transparent text-sm placeholder:text-gray-200"
                    placeholder="Email address"
                  />
                </div>
              </div>

              <button
                disabled={isUpdating}
                className="cursor-pointer w-full bg-black text-white py-4 rounded-2xl text-[10px] font-bold uppercase tracking-[3px] hover:bg-white hover:text-black  hover:border-2 border-2 transition-all active:scale-[0.98] disabled:bg-gray-300 shadow-lg shadow-gray-200"
              >
                {isUpdating ? "Processing..." : "Save Profile Changes"}
              </button>
            </form>
          </div>

          {/* CARD 2: SECURITY / PASSWORD */}
          <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-gray-100 transition-all hover:shadow-md">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-black">
                <FiShield size={20} />
              </div>
              <h2 className="text-xl font-bold uppercase tracking-widest">
                Security
              </h2>
            </div>

            <form onSubmit={handlePasswordUpdate} className="space-y-8">
              {/* Old Password */}
              <div className="group relative">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-2 group-focus-within:text-black transition-colors">
                  Current Password
                </label>
                <div className="flex items-center gap-3 border-b border-gray-100 py-2 group-focus-within:border-black transition-all">
                  <FiLock className="text-gray-300" />
                  <input
                    type={showOld ? "text" : "password"}
                    autoComplete="current-password"
                    value={passData.oldPassword}
                    onChange={(e) =>
                      setPassData({ ...passData, oldPassword: e.target.value })
                    }
                    className="w-full outline-none bg-transparent text-sm"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOld(!showOld)}
                    className="text-gray-300 hover:text-black transition-colors"
                  >
                    {showOld ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="group relative">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-2 group-focus-within:text-black transition-colors">
                  New Password
                </label>
                <div className="flex items-center gap-3 border-b border-gray-100 py-2 group-focus-within:border-black transition-all">
                  <FiLock className="text-gray-300" />
                  <input
                    type={showNew ? "text" : "password"}
                    autoComplete="new-password"
                    value={passData.newPassword}
                    onChange={(e) =>
                      setPassData({ ...passData, newPassword: e.target.value })
                    }
                    className="w-full outline-none bg-transparent text-sm"
                    placeholder="Min. 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="text-gray-300 hover:text-black transition-colors"
                  >
                    {showNew ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
              </div>

              <button
                disabled={isChangingPassword}
                className="cursor-pointer w-full bg-white text-black border-2 border-black py-4 rounded-2xl text-[10px] font-bold uppercase tracking-[3px] hover:bg-black hover:text-white transition-all active:scale-[0.98] disabled:border-gray-200 disabled:text-gray-300 shadow-sm"
              >
                {isChangingPassword ? "Updating..." : "Change Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
