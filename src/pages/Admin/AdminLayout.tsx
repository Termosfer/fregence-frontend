import { Outlet, Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { 
  FiPieChart, FiBox, FiLogOut, FiHome, FiSearch, 
  FiBell, FiSettings, FiShoppingBag, FiUsers, 
  FiMail
} from "react-icons/fi";
import React from "react";
import { LuContact } from "react-icons/lu";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Menyu elementləri - mərkəzi idarəetmə üçün
  const navItems = [
    { path: "/admin", icon: <FiPieChart />, label: "Dashboard" },
    { path: "/admin/products", icon: <FiBox />, label: "Products" },
    { path: "/admin/orders", icon: <FiShoppingBag />, label: "Orders" },
    { path: "/admin/contacts", icon: <LuContact  />, label: "Contacts" },
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

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] font-[Playfair]">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-[#0F172A] text-white flex flex-col fixed h-full z-[100] shadow-xl">
        <div className="p-8 border-b border-white/5">
          <h2 className="text-xl font-bold tracking-widest uppercase flex items-center  gap-2">
            <span className="w-8 h-8 bg-white text-black flex items-center justify-center rounded-lg">Mi</span>
            -Parfum
          </h2>
          <p className="text-[10px] text-gray-500 mt-2 font-bold tracking-[3px] uppercase">Control Panel</p>
        </div>

        <nav className="flex-1 p-4 mt-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                location.pathname === item.path 
                  ? "bg-white text-black shadow-lg" 
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className={`text-lg ${location.pathname === item.path ? "text-black" : "group-hover:text-white"}`}>
                {item.icon}
              </span>
              <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-2">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition-all text-xs font-bold uppercase tracking-widest">
            <FiHome /> Back to Website
          </Link>
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-3 px-4 py-3 w-full text-red-400 hover:bg-red-500/10 rounded-xl transition-all text-xs font-bold uppercase tracking-widest cursor-pointer"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>

      {/* --- RIGHT WRAPPER --- */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        
        {/* --- STICKY HEADER --- */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-10 sticky top-0 z-[90]">
          
          {/* Search Bar */}
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

          {/* Right Actions */}
          <div className="flex items-center gap-8">
            {/* Notifications */}
            <div className="relative cursor-pointer text-gray-400 hover:text-black transition-all">
              <FiBell size={20} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-4 border-l pl-8 border-gray-100">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-gray-900 uppercase tracking-tighter">Super Admin</p>
                <p className="text-[10px] text-teal-500 font-bold uppercase">Online</p>
              </div>
              <div className="relative group cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-[#0F172A] text-white flex items-center justify-center font-bold shadow-lg group-hover:scale-105 transition-transform">
                  A
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* --- MAIN CONTENT AREA --- */}
        <main className="p-8 lg:p-12 flex-1">
          {/* Səhifə daxili məzmun burada görünəcək */}
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;