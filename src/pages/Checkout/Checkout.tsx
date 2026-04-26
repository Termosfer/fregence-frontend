import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { toast } from "react-toastify";
import { useCart } from "../../hooks/useCart";
import {
  FiMapPin,
  FiPhone,
  FiClock,
  FiEdit3,
  FiShoppingBag,
  FiUser,
  FiMail,
  FiArrowLeft,
  FiShield,
  FiLock,
  FiLoader,
} from "react-icons/fi";
import type { CartItem, Order } from "../../types/perfume";
import type { AxiosError } from "axios";

// --- STRIPE İMPORTLARI ---
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// Stripe açarını başladırıq
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutContent = () => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const { cartItems, cartTotal, cartCount, isLoading, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    address: "",
    phone: "",
    deliveryTime: "",
  });

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    phone: "",
    deliveryTime: "",
    note: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    // STRIPE YOXLANIŞI
    if (!stripe || !elements) {
      toast.error("Stripe has not loaded yet.");
      return;
    }

    if (cartItems.length === 0) return toast.error("Your cart is empty!");

    // VALIDASIYA
    let hasError = false;
    const newErrors = {
      fullName: "",
      email: "",
      address: "",
      phone: "",
      deliveryTime: "",
    };

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
      hasError = true;
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      hasError = true;
    }
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
      hasError = true;
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
      hasError = true;
    }
    if (!formData.deliveryTime.trim()) {
      newErrors.deliveryTime = "Delivery time is required";
      hasError = true;
    }

    setErrors(newErrors);
    if (hasError) return;

    setLoading(true);

    try {
      // 1. BACKEND-DƏN ÖDƏNİŞ NİYYƏTİ (CLIENT SECRET) ALIRIQ
      const paymentIntentRes = await api.post<{ clientSecret: string }>(
        `/payment/create-payment-intent?amount=${cartTotal}`,
      );

      // .data hissəsini mütləq əlavə edirik!
      const clientSecret = paymentIntentRes.data.clientSecret;

      // Test üçün konsola çıxaraq ki, görək kod gəlirmi:
      // 2. STRIPE İLƏ KARTI TƏSDİQLƏYİRİK
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            name: formData.fullName,
            email: formData.email,
          },
        },
      });

      if (result.error) {
        toast.error(result.error.message);
        setLoading(false);
        return;
      }

      // 3. ÖDƏNİŞ UĞURLUDURSA, SİFARİŞİ YARADIRIQ (Sənin orijinal kodun)
      if (result.paymentIntent.status === "succeeded") {
        const formattedTime = formData.deliveryTime
          ? `${formData.deliveryTime}:00`
          : "";

        const res = await api.post<Order>("/orders/checkout", null, {
          params: {
            address: formData.address,
            phoneNumber: formData.phone,
            preferredTime: formattedTime,
            note: formData.note,
          },
        });

        const orderId = res.data.id;


        if (orderId) {
          toast.success("Order placed successfully!");
          clearCart();
          navigate(`/order-success/${orderId}`);
        } else {
          navigate("/order-success/confirmed");
        }
      }
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(error.response?.data?.message || "Checkout failed.");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 bg-[#fafafa] min-h-[70vh] font-[Playfair] overflow-hidden">
        <div className="relative w-64 md:w-80 h-[1px] bg-gray-200 mb-12">
          <motion.div
            initial={{ x: "-20%", opacity: 0 }}
            animate={{ x: "120%", opacity: [0, 1, 1, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className="absolute -top-8 text-[#81d8d0] flex flex-col items-center"
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, 0], y: [0, -2, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <FiShoppingBag size={32} />
            </motion.div>
            <div className="w-6 h-1 bg-black/5 rounded-full blur-[2px] mt-1"></div>
          </motion.div>
          <motion.div
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-[#81d8d0]/50 to-transparent"
          />
        </div>
        <div className="text-center space-y-3 relative">
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex flex-col items-center gap-3"
          >
            <div className="flex items-center gap-2 text-gray-400">
              <FiShield className="text-[#81d8d0] animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-[6px]">
                Securing Checkout
              </span>
            </div>
            <p className="text-[9px] text-gray-300 uppercase tracking-widest italic">
              Verifying your fragrance selection...
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="py-40 px-4 flex flex-col items-center justify-center font-[Playfair] bg-[#fafafa] min-h-screen">
        <div className="text-center p-12 bg-white rounded-[2rem] shadow-xl max-w-lg w-full border border-gray-100 flex flex-col items-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6">
            <FiShoppingBag size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-tighter mb-4">
            Your bag is empty
          </h2>
          <p className="text-gray-400 italic mb-8">
            You need to add at least one fragrance to your bag to proceed.
          </p>
          <Link
            to="/products"
            className="relative md:min-w-[200px] h-[46px] w-[200px] overflow-hidden group rounded-full bg-black text-white border border-black transition hover:bg-white hover:text-black cursor-pointer inline-flex items-center justify-center"
          >
            <span className="absolute inset-0 flex items-center justify-center gap-1 text-sm font-semibold transition-transform duration-300 group-hover:-translate-y-full">
              <FiArrowLeft /> Start Shopping
            </span>
            <span className="absolute inset-0 flex items-center justify-center gap-1 text-sm font-semibold text-black translate-y-full transition-transform duration-300 group-hover:translate-y-0 ">
              <FiArrowLeft /> Start Shopping
            </span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 px-4 sm:px-8 lg:px-20 font-[Playfair] bg-[#fafafa] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 text-left">
          <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tighter text-gray-900">
            Secure Checkout
          </h1>
          <p className="text-gray-400 text-sm mt-2 tracking-widest uppercase font-bold">
            Complete your fragrance journey
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-8">
            <form onSubmit={handleCheckout} className="space-y-8">
              {/* SECTION 1: CONTACT INFO */}
              <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold mb-8 flex items-center gap-3 uppercase tracking-wider border-b pb-4 text-gray-800">
                  <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-[Jost]">
                    1
                  </span>
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-1">
                    <div className="relative">
                      <FiUser className="absolute left-0 bottom-3 text-gray-300" />
                      <input
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Full Name"
                        className={`w-full pl-7 pb-2 border-b outline-none transition-all text-sm bg-transparent ${errors.fullName ? "border-red-500" : "border-gray-200 focus:border-black"}`}
                      />
                    </div>
                    {errors.fullName && (
                      <span className="text-red-500 text-[10px] font-bold uppercase">
                        {errors.fullName}*
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="relative">
                      <FiMail className="absolute left-0 bottom-3 text-gray-300" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email Address"
                        className={`w-full pl-7 pb-2 border-b outline-none transition-all text-sm bg-transparent ${errors.email ? "border-red-500" : "border-gray-200 focus:border-black"}`}
                      />
                    </div>
                    {errors.email && (
                      <span className="text-red-500 text-[10px] font-bold uppercase">
                        {errors.email}*
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION 2: SHIPPING DETAILS */}
              <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold mb-8 flex items-center gap-3 uppercase tracking-wider border-b pb-4 text-gray-800">
                  <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-[Jost]">
                    2
                  </span>
                  Shipping Details
                </h2>
                <div className="space-y-8">
                  <div className="flex flex-col gap-1">
                    <div className="relative">
                      <FiMapPin className="absolute left-0 bottom-3 text-gray-300" />
                      <input
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Street, City, Building..."
                        className={`w-full pl-7 pb-2 border-b outline-none transition-all text-sm bg-transparent ${errors.address ? "border-red-500" : "border-gray-200 focus:border-black"}`}
                      />
                    </div>
                    {errors.address && (
                      <span className="text-red-500 text-[10px] font-bold uppercase">
                        {errors.address}*
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-1">
                      <div className="relative">
                        <FiPhone className="absolute left-0 bottom-3 text-gray-300" />
                        <input
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Phone Number"
                          className={`w-full pl-7 pb-2 border-b outline-none transition-all text-sm bg-transparent ${errors.phone ? "border-red-500" : "border-gray-200 focus:border-black"}`}
                        />
                      </div>
                      {errors.phone && (
                        <span className="text-red-500 text-[10px] font-bold uppercase">
                          {errors.phone}*
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="relative">
                        <FiClock className="absolute left-0 bottom-3 text-gray-300" />
                        <input
                          type="datetime-local"
                          name="deliveryTime"
                          value={formData.deliveryTime}
                          onChange={handleChange}
                          className={`w-full pl-7 pb-2 border-b outline-none transition-all text-sm text-gray-400 bg-transparent ${errors.deliveryTime ? "border-red-500" : "border-gray-200 focus:border-black cursor-pointer"}`}
                        />
                      </div>
                      {errors.deliveryTime && (
                        <span className="text-red-500 text-[10px] font-bold uppercase">
                          {errors.deliveryTime}*
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="relative group">
                    <FiEdit3 className="absolute left-0 top-1 text-gray-300" />
                    <textarea
                      name="note"
                      value={formData.note}
                      onChange={handleChange}
                      placeholder="Order Note (Optional...)"
                      rows={2}
                      className="w-full pl-7 border-b border-gray-100 outline-none focus:border-black transition-all text-sm resize-none bg-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: STRIPE PAYMENT */}
              <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold mb-8 flex items-center gap-3 uppercase tracking-wider border-b pb-4 text-gray-800">
                  <span className="w-8 h-8 rounded-full bg-[#81d8d0] text-black flex items-center justify-center text-xs font-bold font-[Jost]">
                    3
                  </span>
                  Payment Method
                </h2>
                <div className="p-5 border border-gray-200 rounded-2xl bg-gray-50 shadow-inner">
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "#1a1a1a",
                          fontFamily: "Playfair Display, serif",
                          "::placeholder": { color: "#aab7c4" },
                        },
                      },
                    }}
                  />
                </div>
                <div className="mt-4 flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                  <FiLock /> Secure encrypted transaction by Stripe
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !stripe}
                className="cursor-pointer w-full bg-black text-white py-5 rounded-2xl font-bold uppercase tracking-[4px] text-[11px] hover:bg-gray-800 transition-all shadow-xl active:scale-[0.99] disabled:bg-gray-300 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <FiLoader className="animate-spin" />
                ) : (
                  "Confirm and Place Order"
                )}
              </button>
            </form>
          </div>

          {/* SUMMARY SIDEBAR */}
          <div className="lg:col-span-4">
            <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-gray-100 sticky top-24 flex flex-col">
              <div className="flex justify-between items-center mb-8 border-b border-gray-50 pb-5">
                <h2 className="text-sm font-bold uppercase tracking-[2px] flex items-center gap-2 text-gray-800">
                  <FiShoppingBag /> Summary
                </h2>
                <span className="bg-[#FAFAF9] text-gray-400 px-3 py-1 rounded-full text-[10px] font-black border border-gray-50">
                  {cartCount} ITEMS
                </span>
              </div>

              <div className="max-h-[250px] overflow-y-auto pr-2 mb-8 space-y-5 custom-scrollbar">
                {cartItems.map((item: CartItem) => (
                  <div
                    key={item.cartItemId}
                    className="flex gap-4 items-center group transition-all hover:opacity-70"
                  >
                    <div className="w-14 h-18 bg-[#FAFAF9] rounded-xl overflow-hidden flex-shrink-0 border border-gray-50 p-1 flex items-center justify-center">
                      <img
                        src={item.imageUrl}
                        className="max-h-full max-w-full object-contain"
                        alt=""
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[11px] font-bold text-gray-800 truncate uppercase tracking-tighter">
                        {item.perfumeName}
                      </h4>
                      <p className="text-[9px] text-gray-400 uppercase tracking-widest">
                        {item.brand}
                      </p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-[10px] text-gray-400 font-bold uppercase">
                          Qty: {item.quantity}
                        </span>
                        <span className="text-xs font-bold font-[Jost] text-black">
                          {item.subTotal}.00 Azn
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-6 border-t border-dashed border-gray-200 mt-auto">
                <div className="flex justify-between text-gray-500 text-[11px]  tracking-widest font-bold">
                  <span className="tracking-tighter uppercase ">Subtotal</span>
                  <span className="text-black font-medium font-[Jost]">
                    {cartTotal}
                    <span className="text-xs">.00 Azn</span>
                  </span>
                </div>
                <div className="flex justify-between text-gray-500 text-[11px] uppercase tracking-widest font-bold">
                  <span>Shipping</span>
                  <span className="text-green-600 font-black italic tracking-widest uppercase">
                    Complimentary
                  </span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-6 text-black border-t border-gray-100">
                  <span className="tracking-tighter uppercase text-sm">
                    Total
                  </span>
                  <span className="tracking-tight font-medium font-[Jost]">
                    {cartTotal}
                    <span className="text-xs">.00 Azn</span>
                  </span>
                </div>
              </div>

              <div className="mt-8 p-5 bg-[#FAFAF9] rounded-2xl border border-gray-50 flex items-center gap-4">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#81d8d0] shadow-sm border border-gray-100 flex-shrink-0">
                  <FiShoppingBag size={14} />
                </div>
                <p className="text-[10px] text-gray-400 leading-relaxed font-bold uppercase tracking-wider">
                  Your order qualifies for{" "}
                  <span className="text-green-600 font-bold">FREE</span>{" "}
                  shipping.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- STRIPE ELEMENTS WRAPPER ---
const Checkout = () => (
  <Elements stripe={stripePromise}>
    <CheckoutContent />
  </Elements>
);

export default Checkout;
