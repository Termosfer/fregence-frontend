import {
  Outlet,
  Link,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import {
  FiPieChart,
  FiBox,
  FiLogOut,
  FiHome,
  FiSearch,
  FiBell,
  FiSettings,
  FiShoppingBag,
  FiUsers,
  FiMail,
} from "react-icons/fi";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { LuContact } from "react-icons/lu";
import SockJS from "sockjs-client";
import { Client } from '@stomp/stompjs';
import { toast } from "react-toastify";
import sound from "../../../public/freesound_community-service-bell-ring-14610.mp3";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const globalQuery = searchParams.get("query") || "";

  // --- BİLDİRİŞ STATE-LƏRİ ---
  const [notifications, setNotifications] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const audioRef = useRef(new Audio(sound));
  const audioUnlockedRef = useRef(false);
  const stompClientRef = useRef<Client | null>(null);

  const navItems = [
    { path: "/admin", icon: <FiPieChart />, label: "Dashboard" },
    { path: "/admin/products", icon: <FiBox />, label: "Products" },
    { path: "/admin/orders", icon: <FiShoppingBag />, label: "Orders" },
    { path: "/admin/contacts", icon: <LuContact />, label: "Contacts" },
    { path: "/admin/subscribers", icon: <FiMail />, label: "Subscribers" },
    { path: "/admin/users", icon: <FiUsers />, label: "Users" },
    { path: "/admin/settings", icon: <FiSettings />, label: "Settings" },
  ];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      setSearchParams({ query: value });
    } else {
      searchParams.delete("query");
      setSearchParams(searchParams);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    audioUnlockedRef.current = audioUnlocked;
  }, [audioUnlocked]);

  const playNotificationSound = useCallback(() => {
    if (!audioUnlockedRef.current) return;
    const audio = audioRef.current;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }, []);

  // Dropdown kənarına klikləyəndə bağlanması üçün
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (stompClientRef.current) return;

    const client = new Client({
      webSocketFactory: () => new SockJS(`${import.meta.env.VITE_API_BASE_URL}/ws-notifications`),
      onConnect: () => {
        client.subscribe("/topic/admin-notifications", (message) => {
          if (message.body) {
            playNotificationSound();
            
            // 1. Yeni bildirişi siyahıya əlavə et
            setNotifications(prev => [message.body, ...prev]);
            
            // 2. Toast göstər
            toast.info(`🚨 ${message.body}`, {
              icon: () => "📦",
              position: "top-right",
            });
          }
        });
      },
      reconnectDelay: 5000,
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      if (stompClientRef.current) {
        client.deactivate();
        stompClientRef.current = null;
      }
    };
  }, [playNotificationSound]);

  useEffect(() => {
    const unlockAudio = () => {
      const audio = audioRef.current;
      audio.volume = 0;
      audio.play().then(() => {
        audio.pause();
        audio.volume = 1;
        setAudioUnlocked(true);
        window.removeEventListener("click", unlockAudio);
        window.removeEventListener("touchstart", unlockAudio);
      }).catch(() => {});
    };
    window.addEventListener("click", unlockAudio);
    window.addEventListener("touchstart", unlockAudio);
    return () => {
      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] font-[Playfair]">
      <aside className="w-64 bg-[#0F172A] text-white flex flex-col fixed h-full z-[100] shadow-xl">
        <div className="p-8 border-b border-white/5">
          <h2 className="text-xl font-bold tracking-widest uppercase flex items-center  gap-2">
            <span className="w-8 h-8 bg-white text-black flex items-center justify-center rounded-lg">Mi</span>-Parfum
          </h2>
          <p className="text-[10px] text-gray-500 mt-2 font-bold tracking-[3px] uppercase">Control Panel</p>
        </div>

        <nav className="flex-1 p-4 mt-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                location.pathname === item.path ? "bg-white text-black shadow-lg" : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className={`text-lg ${location.pathname === item.path ? "text-black" : "group-hover:text-white"}`}>{item.icon}</span>
              <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-2">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition-all text-xs font-bold uppercase tracking-widest">
            <FiHome /> Back to Website
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full text-red-400 hover:bg-red-500/10 rounded-xl transition-all text-xs font-bold uppercase tracking-widest cursor-pointer">
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-10 sticky top-0 z-[90]">
          <div className="relative w-full max-w-md group">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" />
            <input
              type="text"
              placeholder="Search products, orders, customers..."
              className="w-full bg-gray-100/50 border border-transparent rounded-2xl py-2.5 pl-12 pr-4 text-sm focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-black/5 transition-all outline-none"
              value={searchParams.get("query") || ""}
              onChange={handleSearch}
            />
          </div>

          <div className="flex items-center gap-8">
            {/* --- NOTIFICATIONS DROPDOWN --- */}
            <div className="relative" ref={dropdownRef}>
              <div 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="relative cursor-pointer text-gray-400 hover:text-black transition-all p-2"
              >
                <FiBell size={20} />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] flex items-center justify-center rounded-full border-2 border-white font-bold animate-pulse">
                    {notifications.length}
                  </span>
                )}
              </div>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-100 shadow-2xl rounded-2xl overflow-hidden z-[110] animate-in fade-in slide-in-from-top-2">
                  <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">Recent Notifications</span>
                    {notifications.length > 0 && (
                      <button onClick={() => setNotifications([])} className="text-[9px] text-red-500 font-bold hover:underline uppercase">Clear all</button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-10 text-center">
                        <FiBell className="mx-auto text-gray-200 mb-2" size={24} />
                        <p className="text-[11px] text-gray-400 font-medium">No new alerts at the moment.</p>
                      </div>
                    ) : (
                      notifications.map((note, index) => (
                        <div key={index} className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors">
                          <div className="flex gap-3">
                            <div className="w-2 h-2 bg-teal-500 rounded-full mt-1.5 shrink-0" />
                            <div>
                              <p className="text-xs text-gray-700 leading-relaxed font-medium">{note}</p>
                              <span className="text-[9px] text-gray-400 font-bold mt-1 block uppercase">New Update</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 border-l pl-8 border-gray-100">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-gray-900 uppercase tracking-tighter">Super Admin</p>
                <p className="text-[10px] text-teal-500 font-bold uppercase">Online</p>
              </div>
              <div className="relative group cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-[#0F172A] text-white flex items-center justify-center font-bold shadow-lg group-hover:scale-105 transition-transform">A</div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-8 lg:p-12 flex-1">
          <Outlet context={globalQuery} />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;