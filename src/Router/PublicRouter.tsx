import { Route, Routes } from "react-router-dom";
import About from "../pages/About/About";
import Contact from "../pages/Contact/Contact";
import Home from "../pages/Home/Home";
import Products from "../pages/Products/Products";
import Shops from "../pages/Shops/Shops";
import Wishlist from "../pages/Wishlist/Wishlist";
import ViewCart from "../pages/ViewCart/ViewCart";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Checkout from "../pages/Checkout/Checkout";
import Profile from "../pages/Profile/Profile";
import Order from "../pages/Order/Order";
import PrivacyPolicy from "../pages/PrivacyPolicy/PrivacyPolicy";
import TermsOfService from "../pages/TermsOfService/TermsOfService";
import FAQs from "../pages/FAQs/FAQs";


const PublicRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/products" element={<Products />} />
      <Route path="/shops" element={<Shops />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/viewcart" element={<ViewCart />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/profile/*" element={<Profile />} />
      <Route path="/orders" element={<Order />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/faq" element={<FAQs />} />
      
      <Route path="*" element={<div className="text-center py-20 text-xl">404 - Page Not Found</div>} />
      
    </Routes>
  );
};

export default PublicRouter;
