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
import PrivacyPolicy from "../pages/PrivacyPolicy/PrivacyPolicy";
import TermsOfService from "../pages/TermsOfService/TermsOfService";
import FAQs from "../pages/FAQs/FAQs";
import ProtectedRoute from "./ProtectedRoute";
import OrderHistory from "../pages/Order/Order";
import NotFound from "../pages/NotFound/NotFound";
import OrderSuccess from "../pages/Order/OrderSuccess";

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
      <Route path="/order-success/:orderId" element={<OrderSuccess />} />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile/*"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <OrderHistory />
          </ProtectedRoute>
        }
      />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/faq" element={<FAQs />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default PublicRouter;
