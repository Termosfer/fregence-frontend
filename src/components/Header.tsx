import {
  FiChevronDown,
  FiHeart,
  FiLayout,
  FiLoader,
  FiLogOut,
  FiPackage,
  FiSearch,
  FiShoppingCart,
  FiUser,
  FiXCircle,
} from "react-icons/fi";
import "./style.css";
import logo from "../assets/black.png";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import ShoppingCart from "./ShoppingCart";
import { FiMenu, FiX } from "react-icons/fi";
import { useWishlist } from "../hooks/useWishlist";
import { useCart } from "../hooks/useCart";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import type { PageResponse, Perfume } from "../types/perfume";

const Header = () => {
   const [isOpen, setIsOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [mobileMenu, setMobileMenu] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isMobileProfileOpen, setIsMobileProfileOpen] = useState<boolean>(false);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");
  const userName = localStorage.getItem("userName") || "Profile";

  const { wishlistCount } = useWishlist();
  const { cartItems } = useCart();

  const { data: searchResults, isLoading: isSearchLoading } = useQuery<PageResponse<Perfume>>({
    queryKey: ["global-search", searchQuery],
    queryFn: () =>
      api.get(`/perfumes?query=${searchQuery}&size=5`).then((res) => res.data),
    enabled: searchQuery.trim().length > 1, 
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenu]);

  const handleLogout = () => {
    localStorage.clear();
    queryClient.clear();
    setIsProfileOpen(false);
    setIsMobileProfileOpen(false);
    setMobileMenu(false);
    navigate("/");
  };

  const handleResultClick = (productName: string) => {
    navigate(`/products?query=${encodeURIComponent(productName)}`);
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length > 1) {
      navigate(`/products?query=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };
  return (
    <div
      className={`header flex items-center py-5 px-4 sm:px-8 lg:px-20 transition-all duration-300 ${
        scrolled ? "header-scrolled shadow-md" : ""
      }`}
    >
      <div className="flex items-center flex-1">
        <button
          onClick={() => setMobileMenu(!mobileMenu)}
          className="lg:hidden text-xl "
        >
          <span className={`menu-icon ${mobileMenu ? "open" : ""}`}>
            {mobileMenu ? <FiX /> : <FiMenu />}
          </span>
        </button>
        <Link to="/">
          <img
            src={logo}
            alt="Logo"
            className="hidden lg:block w-40 object-contain"
          />
        </Link>
      </div>

      <div className="flex justify-center flex-1">
        <Link to="/">
          <img
            src={logo}
            alt="Logo"
            className="lg:hidden w-24  object-contain"
          />
        </Link>

        <ul className="hidden lg:flex gap-10 items-center text-base text-black font-medium">
          <Link to="/" className="hover:text-[#00000080]">
            Home
          </Link>
          <Link to="/shops" className="hover:text-[#00000080]">
            Shops
          </Link>
          <Link to="/products" className="hover:text-[#00000080]">
            Products
          </Link>
          <Link to="/about" className="hover:text-[#00000080]">
            About
          </Link>
          <Link to="/contact" className="hover:text-[#00000080]">
            Contact
          </Link>
        </ul>
      </div>

      <div className="flex items-center justify-end gap-4 flex-1 z-10">
        <div className="flex items-center justify-end gap-4 flex-1 z-10">
          {/* DESKTOP AUTH SECTION */}
          <div className="relative">
            {!token ? (
              <Link
                to="/login"
                className="hidden lg:block text-base font-medium underline hover:text-[#00000080]"
              >
                LOGIN
              </Link>
            ) : (
              <div className="relative hidden lg:block">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-1 text-base font-medium cursor-pointer hover:text-[#00000080]"
                >
                  <FiUser /> {userName.toUpperCase()}{" "}
                  <FiChevronDown
                    className={`transition-transform ${isProfileOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isProfileOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-0"
                      onClick={() => setIsProfileOpen(false)}
                    ></div>
                    <div className="absolute right-0 mt-3 w-52 bg-white border border-gray-100 shadow-xl rounded-lg py-2 z-10 animate-in fade-in zoom-in duration-200">
                      {/* 1. ADMIN DASHBOARD */}
                      {userRole === "ADMIN" && (
                        <Link
                          to="/admin"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                        >
                          <FiLayout className="text-blue-500" /> Dashboard
                        </Link>
                      )}

                      {/* 2. MY ACCOUNT (Profil məlumatları üçün) */}
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                      >
                        <FiUser /> My Account
                      </Link>

                      {/* 3. ORDERS (Sifariş tarixçəsi üçün) */}
                      <Link
                        to="/orders"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                      >
                        <FiPackage /> Orders
                      </Link>

                      <div className="h-[1px] bg-gray-100 my-1"></div>

                      {/* 5. LOGOUT */}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer font-bold"
                      >
                        <FiLogOut /> Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="relative" ref={searchRef}>
            <div
              className="relative cursor-pointer loginStyle text-black flex items-center"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <FiSearch className="xl:text-xl text-lg" />
              {/* <div className="loginHover text-sm">Search</div> */}
            </div>

            {isSearchOpen && (
              <div className="absolute right-0 mt-6 w-[320px] md:w-[450px] bg-white shadow-2xl rounded-2xl border border-gray-100 p-5 animate-in fade-in zoom-in duration-300 z-[150]">
                <form onSubmit={handleSearchSubmit}>
                  <div className="relative group">
                    <input
                      autoFocus
                      type="text"
                      placeholder="What are you looking for?"
                      className="w-full bg-gray-50 border-none rounded-xl py-4 pl-12 pr-10 text-sm outline-none focus:ring-2 focus:ring-black/5 transition-all font-[Playfair] italic"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={18} />
                    {searchQuery && (
                       <FiXCircle 
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-black cursor-pointer transition-colors" 
                        onClick={() => setSearchQuery("")}
                       />
                    )}
                  </div>
                </form>

                {searchQuery.trim().length > 1 && (
                  <div className="mt-6 space-y-3 max-h-[400px] overflow-y-auto no-scrollbar">
                    {isSearchLoading ? (
                      <div className="flex flex-col items-center py-6 gap-2 text-gray-400">
                        <FiLoader className="animate-spin" size={24} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Searching...</span>
                      </div>
                    ) : searchResults?.content && searchResults.content.length > 0 ? (
                      <>
                        <p className="text-[9px] font-black text-gray-300 uppercase tracking-[2px] mb-2 px-1">Top Matches</p>
                        {searchResults.content.map((p) => (
                          <div
                            key={p.id}
                            onClick={() => handleResultClick(p.name)}
                            className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-2xl cursor-pointer transition-all border border-transparent hover:border-gray-100"
                          >
                            <div className="w-14 h-16 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 p-1 border">
                               <img src={p.imageUrl} alt="" className="w-full h-full object-contain" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-gray-900 truncate uppercase tracking-tighter leading-tight">{p.name}</p>
                              <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">{p.brand}</p>
                              <p className="text-[11px] font-bold text-[#81d8d0] mt-1">{p.price}.00 AZN</p>
                            </div>
                          </div>
                        ))}
                        <button 
                          onClick={handleSearchSubmit}
                          className="w-full py-3 text-[10px] font-black uppercase tracking-[2px] text-gray-400 hover:text-black transition-colors border-t mt-2"
                        >
                          View all results
                        </button>
                      </>
                    ) : (
                      <div className="py-10 text-center">
                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest italic">No essence found</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          <Link
            to="/wishlist"
            className="hidden lg:block relative loginStyle text-black"
          >
            <FiHeart className="xl:text-xl text-lg" />
            {/* <div className="loginHover text-sm">Favorites</div> */}
            {wishlistCount > 0 && (
              <div className="badge text-[12px] 2xl:w-[20px] 2xl:h-[20px] w-[15px] h-[15px] ">
                {wishlistCount}
              </div>
            )}
          </Link>
          <div
            className="relative cursor-pointer loginStyle text-black"
            onClick={() => setIsOpen(true)}
          >
            <FiShoppingCart className="xl:text-xl text-lg" />
            {/* <div className="loginHover text-sm">Cart</div> */}
            {cartItems.length > 0 && (
              <div className="badge text-[12px] 2xl:w-[20px] 2xl:h-[20px] w-[15px] h-[15px]">
                {cartItems.length}
              </div>
            )}
          </div>
        </div>

        {/* MOBILE MENU SECTION */}
        <div
          className={`fixed top-[65px] left-0 h-[calc(100dvh-65px)] w-[65%] sm:w-[50%] bg-white shadow-lg
            py-8 px-6 text-[14px] font-normal lg:hidden z-40 mobile-menu flex flex-col justify-between
            transition-all duration-300 ${mobileMenu ? "open" : ""}`}
        >
          <div className="flex flex-col gap-6">
            {/* LİNKLƏR */}
            <nav className="flex flex-col gap-6 text-[Playfair] font-medium text-base">
              <Link onClick={() => setMobileMenu(false)} to="/">
                Home
              </Link>
              <Link onClick={() => setMobileMenu(false)} to="/shops">
                Shops
              </Link>
              <Link onClick={() => setMobileMenu(false)} to="/products">
                Products
              </Link>
              <Link onClick={() => setMobileMenu(false)} to="/about">
                About
              </Link>
              <Link onClick={() => setMobileMenu(false)} to="/contact">
                Contact
              </Link>
            </nav>

            {/* MOBİL LOGIN / PROFILE (Yuxarı qaldırıldı) */}
            <div className="border-t pt-6 mt-2">
              {!token ? (
                <Link
                  onClick={() => setMobileMenu(false)}
                  to="/login"
                  className="font-medium underline text-base"
                >
                  LOGIN
                </Link>
              ) : (
                <div className="flex flex-col">
                  <button
                    onClick={() => setIsMobileProfileOpen(!isMobileProfileOpen)}
                    className="flex items-center justify-between w-full font-medium text-base text-black uppercase"
                  >
                    <span className="flex items-center gap-2">
                      <FiUser /> {userName}
                    </span>
                    <FiChevronDown
                      className={`transition-transform duration-300 ${isMobileProfileOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* MOBİL DROPDOWN İÇİ */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ${isMobileProfileOpen ? "max-h-48 mt-4 ml-2" : "max-h-0"}`}
                  >
                    <div className="flex flex-col gap-4">
                      {userRole === "ADMIN" && (
                        <Link
                          onClick={() => setMobileMenu(false)}
                          to="/admin"
                          className="flex items-center gap-2 text-blue-600 font-bold"
                        >
                          <FiLayout /> Dashboard
                        </Link>
                      )}
                      <Link
                        onClick={() => setMobileMenu(false)}
                        to="/profile"
                        className="flex items-center gap-2 font-medium"
                      >
                        <FiUser />My Account
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setMobileMenu(false)}
                        className="flex items-center gap-2 font-medium"
                      >
                        <FiPackage /> Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-red-500 font-medium text-left"
                      >
                        <FiLogOut /> Logout
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* FAVORTIES AT THE BOTTOM OF MENU */}
          <div className="flex items-center justify-between gap-6 border-t pt-6">
            <Link
              to="/wishlist"
              onClick={() => setMobileMenu(false)}
              className="relative flex items-center gap-2 font-medium text-base"
            >
              <FiHeart className="text-xl" />
              <span>Favorites</span>
              {wishlistCount > 0 && (
                <span className="bg-black text-white text-[10px] px-2 py-0.5 rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
      <ShoppingCart isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

export default Header;
