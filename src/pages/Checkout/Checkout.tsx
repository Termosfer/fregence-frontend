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
} from "react-icons/fi";
import type { CartItem, Order } from "../../types/perfume";
import type { AxiosError } from "axios";

const Checkout = () => {
const navigate = useNavigate();
  const { cartItems, cartTotal, cartCount, isLoading } = useCart();
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

  const SHIPPING_LIMIT = 180;
  const shippingCost = cartTotal < SHIPPING_LIMIT ? 10 : 0;
  const finalTotal = cartTotal + shippingCost;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return toast.error("Your cart is empty!");

    let hasError = false;
    const newErrors = { fullName: "", email: "", address: "", phone: "", deliveryTime: "" };

    if (!formData.fullName.trim()) { newErrors.fullName = "Full name is required"; hasError = true; }
    if (!formData.email.trim()) { newErrors.email = "Email is required"; hasError = true; }
    if (!formData.address.trim()) { newErrors.address = "Address is required"; hasError = true; }
    if (!formData.phone.trim()) { newErrors.phone = "Phone is required"; hasError = true; }
    if (!formData.deliveryTime.trim()) { newErrors.deliveryTime = "Delivery time is required"; hasError = true; }

    setErrors(newErrors);
    if (hasError) return;

    setLoading(true);
    try {
      const formattedTime = formData.deliveryTime ? `${formData.deliveryTime}:00` : "";

      // 1. Sorğunu göndəririk
       const res = (await api.post("/orders/checkout", null, {
        params: {
          address: formData.address,
          phoneNumber: formData.phone,
          preferredTime: formattedTime,
          note: formData.note,
        },
      })) as unknown as Order;

      // 2. ID-ni mütləq tutmaq üçün yoxlama
      const orderId = res.id
      

      if (orderId) {
        toast.success("Order placed successfully!");
        // 3. DÜZƏLİŞ: Backtick (``) istifadə edirik ki, dəyişən linkə düşsün
        navigate(`/order-success/${orderId}`);
      } else {
        // Əgər ID hansısa səbəbdən gəlməsə, 'confirmed' olaraq yönləndir
        navigate("/order-success/confirmed");
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
        {/* HƏRƏKƏT EDƏN SƏBƏT ANİMASİYASI */}
        <div className="relative w-64 md:w-80 h-[1px] bg-gray-200 mb-12">
          {/* Sürüşən Səbət */}
          <motion.div
            initial={{ x: "-20%", opacity: 0 }}
            animate={{ x: "120%", opacity: [0, 1, 1, 0] }}
            transition={{
              repeat: Infinity,
              duration: 2.5,
              ease: "easeInOut",
            }}
            className="absolute -top-8 text-[#81d8d0] flex flex-col items-center"
          >
            <motion.div
              animate={{
                rotate: [0, -10, 10, 0],
                y: [0, -2, 0],
              }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <FiShoppingBag size={32} />
            </motion.div>
            {/* Səbətin altındakı zərif kölgə */}
            <div className="w-6 h-1 bg-black/5 rounded-full blur-[2px] mt-1"></div>
          </motion.div>

          {/* Yol üzərindəki parıltı (Progress line) */}
          <motion.div
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-[#81d8d0]/50 to-transparent"
          />
        </div>

        {/* MƏTN HİSSƏSİ */}
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

        {/* Arxa planda böyük loqo silueti (Opsional, daha da lüks göstərir) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02]">
          <h1 className="text-[20vw] font-black uppercase tracking-tighter">
            MI
          </h1>
        </div>
      </div>
    );
  }

  // --- KRİTİK DÜZƏLİŞ: SƏBƏT BOŞDURSA BU EKRANI GÖSTƏR ---
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
            You need to add at least one fragrance to your bag to proceed with
            the checkout.
          </p>

          <Link
            to="/products"
            className="
                            relative  md:min-w-[200px]
                            h-[46px] w-[200px] overflow-hidden group
                            rounded-full bg-black text-white
                            border border-black transition
                            hover:bg-white hover:text-black
                            cursor-pointer
                            inline-flex items-center justify-center
                          "
          >
            <span className="absolute inset-0 flex items-center justify-center gap-1 text-sm font-semibold transition-transform duration-300 group-hover:-translate-y-full ">
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
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tighter text-gray-900">
            Secure Checkout
          </h1>
          <p className="text-gray-400 text-sm mt-2 tracking-widest">
            Complete your fragrance journey
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
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
                  <div className="relative group flex flex-col gap-1">
                    <div className="relative">
                      <FiUser className="absolute left-0 bottom-3 text-gray-300" />
                      <input
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Full Name"
                        className={`w-full pl-7 pb-2 border-b outline-none transition-all text-sm ${errors.fullName ? "border-red-500" : "border-gray-200 focus:border-black"}`}
                      />
                    </div>
                    {errors.fullName && (
                      <span className="text-red-500 text-[10px] font-bold uppercase text-left">
                        {errors.fullName}*
                      </span>
                    )}
                  </div>
                  <div className="relative group flex flex-col gap-1">
                    <div className="relative">
                      <FiMail className="absolute left-0 bottom-3 text-gray-300" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email Address"
                        className={`w-full pl-7 pb-2 border-b outline-none transition-all text-sm ${errors.email ? "border-red-500" : "border-gray-200 focus:border-black"}`}
                      />
                    </div>
                    {errors.email && (
                      <span className="text-red-500 text-[10px] font-bold uppercase text-left">
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
                  <div className="relative group flex flex-col gap-1">
                    <div className="relative">
                      <FiMapPin className="absolute left-0 bottom-3 text-gray-300" />
                      <input
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Shipping Address (Street, City, Building)"
                        className={`w-full pl-7 pb-2 border-b outline-none transition-all text-sm ${errors.address ? "border-red-500" : "border-gray-200 focus:border-black"}`}
                      />
                    </div>
                    {errors.address && (
                      <span className="text-red-500 text-[10px] font-bold uppercase text-left">
                        {errors.address}*
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="relative group flex flex-col gap-1">
                      <div className="relative">
                        <FiPhone className="absolute left-0 bottom-3 text-gray-300" />
                        <input
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Phone Number (+994 -- --- -- --)"
                          className={`w-full pl-7 pb-2 border-b outline-none transition-all text-sm ${errors.phone ? "border-red-500" : "border-gray-200 focus:border-black"}`}
                        />
                      </div>
                      {errors.phone && (
                        <span className="text-red-500 text-[10px] font-bold uppercase text-left">
                          {errors.phone}*
                        </span>
                      )}
                    </div>
                    <div className="relative group flex flex-col gap-1">
                      <div className="relative">
                        <FiClock className="absolute left-0 bottom-3 text-gray-300" />
                        <input
                          type="datetime-local"
                          name="deliveryTime"
                          value={formData.deliveryTime}
                          onChange={handleChange}
                          className={`w-full pl-7 pb-2 border-b outline-none transition-all text-sm text-gray-500 bg-transparent ${errors.deliveryTime ? "border-red-500" : "border-gray-200 focus:border-black"}`}
                        />
                      </div>
                      {errors.deliveryTime && (
                        <span className="text-red-500 text-[10px] font-bold uppercase text-left">
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
                      placeholder="Order Note (Optional: gate code, special instructions...)"
                      rows={2}
                      className="w-full pl-7 border-b border-gray-100 outline-none focus:border-black transition-all text-sm resize-none bg-transparent"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="cursor-pointer w-full bg-black text-white py-5 rounded-2xl font-bold uppercase tracking-[4px] text-xs hover:bg-gray-800 transition-all shadow-xl active:scale-[0.99] disabled:bg-gray-300"
              >
                {loading ? "Processing Order..." : "Confirm and Place Order"}
              </button>
            </form>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-lg font-bold uppercase tracking-widest flex items-center gap-2">
                  <FiShoppingBag /> Summary
                </h2>
                <span className="bg-gray-100 text-black px-3 py-1 rounded-full text-[10px] font-bold">
                  {cartCount} ITEMS
                </span>
              </div>

              <div className="max-h-[250px] overflow-y-auto pr-2 mb-6 space-y-4 custom-scrollbar">
                {cartItems.map((item: CartItem) => (
                  <div
                    key={item.cartItemId}
                    className="flex gap-4 items-center group"
                  >
                    <div className="w-16 h-20 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-50 p-1">
                      <img
                        src={item.imageUrl}
                        className="w-full h-full object-cover"
                        alt=""
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-gray-800 truncate uppercase">
                        {item.perfumeName}
                      </h4>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                        {item.brand}
                      </p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-500 font-medium font-[Jost]">
                          Qty: {item.quantity}
                        </span>
                        <span className="text-sm font-medium font-[Jost]">
                          {item.subTotal}
                          <span className="text-xs">.00 Azn</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-6 border-t border-dashed border-gray-200">
                <div className="flex justify-between items-center text-gray-500 text-sm">
                  <span>Subtotal</span>
                  <span className="font-medium font-[Jost] text-black">
                    {cartTotal} <span className="text-xs">.00 Azn</span>
                  </span>
                </div>
                <div className="flex justify-between items-center text-gray-500 text-sm ">
                  <span>Shipping Cost</span>
                  <span className="text-green-600 font-bold uppercase text-[10px] tracking-widest font-[Jost]">
                    Complimentary
                  </span>
                  {/* {shippingCost === 0 ? (
                    <span className="text-green-600 font-bold uppercase text-[10px] tracking-widest font-[Jost]">
                      Complimentary
                    </span>
                  ) : (
                    <span className="text-green-600 font-bold font-[Jost]">
                      +{shippingCost}.00 Azn
                    </span>
                  )} */}
                </div>
                <div className="flex justify-between text-xl font-bold pt-4 text-black border-t border-gray-100">
                  <span className="tracking-tighter uppercase text-sm">
                    Total
                  </span>
                  <span className="tracking-tight font-medium font-[Jost]">
                    {finalTotal} <span className="text-xs">.00 Azn</span>
                  </span>
                </div>
              </div>

              <div className="mt-8 p-4 bg-gray-50 rounded-2xl flex items-center gap-3">
                <div className="h-10 w-15 bg-white rounded-full flex items-center justify-center text-teal-500 shadow-sm border border-gray-100">
                  <FiShoppingBag />
                </div>
                <p className="text-[10px] text-gray-400 leading-tight font-medium uppercase tracking-wider">
                  Your order qualifies for{" "}
                  <span className="text-green-600 font-bold">FREE</span>{" "}
                  shipping.
                  {/* {cartTotal >= SHIPPING_LIMIT ? (
                    <>
                      Your order qualifies for{" "}
                      <span className="text-green-600 font-bold">FREE</span>{" "}
                      shipping.
                    </>
                  ) : (
                    <>
                      Add{" "}
                      <span className="text-black font-bold ">
                        {(SHIPPING_LIMIT - cartTotal)} AZN
                      </span>{" "}
                      more to qualify for{" "}
                      <span className="text-green-600 font-bold">FREE</span>{" "}
                      shipping.
                    </>
                  )} */}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
