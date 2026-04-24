import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import { useCart } from '../../hooks/useCart';
import { FiMapPin, FiPhone, FiClock, FiEdit3, FiShoppingBag, FiUser, FiMail } from 'react-icons/fi';
import type { CartItem } from '../../types/perfume';
import type { AxiosError } from 'axios';


const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, cartCount, isLoading } = useCart();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '', // Profil məlumatlarından da çəkmək olar
    email: '',
    address: '',
    phone: '',
    deliveryTime: '',
    note: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return toast.error("Your cart is empty!");

    setLoading(true);
    try {
      const formattedTime = formData.deliveryTime ? `${formData.deliveryTime}:00` : "";

      await api.post('/orders/checkout', null, {
        params: {
          address: formData.address,
          phoneNumber: formData.phone,
          preferredTime: formattedTime,
          note: formData.note
        }
      });

      toast.success("Order placed successfully!");
      navigate('/'); 
    } catch (err) {
        const error = err as AxiosError<{ message: string }>;
      toast.error(error.response?.data?.message || "Checkout failed.");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <div className="py-20 text-center animate-pulse uppercase">Syncing...</div>;

  return (
    <div className="py-10 px-4 sm:px-8 lg:px-20 font-[Playfair] bg-[#fafafa] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
           <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tighter">Secure Checkout</h1>
           <p className="text-gray-400 text-sm mt-2  tracking-widest">Complete your fragrance journey</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT SIDE: FORM (8 columns on large screens) */}
          <div className="lg:col-span-8">
            <form onSubmit={handleCheckout} className="space-y-8">
              
              {/* SECTION 1: CONTACT INFO */}
              <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold mb-8 flex items-center gap-3 uppercase tracking-wider border-b pb-4">
                  <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs">1</span>
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="relative group">
                      <FiUser className="absolute left-0 bottom-3 text-gray-300 group-focus-within:text-black transition-colors" />
                      <input 
                        name="fullName" required placeholder="Full Name"
                        className="w-full pl-7 pb-2 border-b border-gray-200 outline-none focus:border-black transition-all text-sm"
                      />
                   </div>
                   <div className="relative group">
                      <FiMail className="absolute left-0 bottom-3 text-gray-300 group-focus-within:text-black transition-colors" />
                      <input 
                        type="email" name="email" required placeholder="Email Address"
                        className="w-full pl-7 pb-2 border-b border-gray-200 outline-none focus:border-black transition-all text-sm"
                      />
                   </div>
                </div>
              </div>

              {/* SECTION 2: SHIPPING DETAILS */}
              <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold mb-8 flex items-center gap-3 uppercase tracking-wider border-b pb-4">
                  <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs">2</span>
                  Shipping Details
                </h2>
                <div className="space-y-8">
                   <div className="relative group">
                      <FiMapPin className="absolute left-0 bottom-3 text-gray-300 group-focus-within:text-black transition-colors" />
                      <input 
                        name="address" required value={formData.address} onChange={handleChange}
                        placeholder="Shipping Address (Street, City, Building)"
                        className="w-full pl-7 pb-2 border-b border-gray-200 outline-none focus:border-black transition-all text-sm"
                      />
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="relative group">
                        <FiPhone className="absolute left-0 bottom-3 text-gray-300 group-focus-within:text-black transition-colors" />
                        <input 
                          name="phone" required value={formData.phone} onChange={handleChange}
                          placeholder="Phone Number (+994 -- --- -- --)"
                          className="w-full pl-7 pb-2 border-b border-gray-200 outline-none focus:border-black transition-all text-sm"
                        />
                      </div>
                      <div className="relative group">
                        <FiClock className="absolute left-0 bottom-3 text-gray-300 group-focus-within:text-black transition-colors" />
                        <input 
                          type="datetime-local" name="deliveryTime" required 
                          value={formData.deliveryTime} onChange={handleChange}
                          className="w-full pl-7 pb-2 border-b border-gray-200 outline-none focus:border-black transition-all text-sm text-gray-500"
                        />
                      </div>
                   </div>

                   <div className="relative group">
                      <FiEdit3 className="absolute left-0 top-1 text-gray-300 group-focus-within:text-black transition-colors" />
                      <textarea 
                        name="note" value={formData.note} onChange={handleChange}
                        placeholder="Order Note (Optional: gate code, special instructions...)"
                        rows={2}
                        className="w-full pl-7 border-b border-gray-200 outline-none focus:border-black transition-all text-sm resize-none"
                      />
                   </div>
                </div>
              </div>

              <button 
                type="submit" disabled={loading}
                className="cursor-pointer w-full bg-black text-white py-5 rounded-2xl font-bold uppercase tracking-[4px] text-xs hover:bg-gray-800 transition-all shadow-xl active:scale-[0.99] disabled:bg-gray-300"
              >
                {loading ? "Processing Order..." : "Confirm and Place Order"}
              </button>
            </form>
          </div>

          {/* RIGHT SIDE: ORDER SUMMARY (4 columns) */}
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
              
              {/* SCROLLABLE ITEM LIST */}
              <div className="max-h-[250px] overflow-y-auto pr-2 mb-6 space-y-4 custom-scrollbar">
                {cartItems.map((item: CartItem) => (
                  <div key={item.cartItemId} className="flex gap-4 items-center group">
                    <div className="w-16 h-20 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-50 p-1">
                       <img src={item.imageUrl} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-gray-800 truncate uppercase">{item.perfumeName}</h4>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest">{item.brand}</p>
                      <div className="flex justify-between items-center mt-1">
                         <span className="text-xs text-gray-500 font-medium">Qty: {item.quantity}</span>
                         <span className="text-sm font-medium font-[Jost]">{item.subTotal}<span className="text-xs">.00 Azn</span></span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CALCULATION */}
              <div className="space-y-4 pt-6 border-t border-dashed border-gray-200">
                <div className="flex justify-between items-center text-gray-500 text-sm">
                  <span>Subtotal</span>
                  <span className="font-medium font-[Jost] text-black">{cartTotal} <span className="text-xs">00 Azn</span></span>
                </div>
                <div className="flex justify-between items-center text-gray-500 text-sm ">
                  <span>Shipping Cost</span>
                  <span className="text-green-600 font-bold uppercase text-[10px] tracking-widest font-medium font-[Jost]">Complimentary</span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-4 text-black border-t border-gray-100">
                  <span className="tracking-tighter">Estimated Total</span>
                  <span className="tracking-tight font-medium font-[Jost]">{cartTotal} <span className="text-xs">00 Azn</span></span>
                </div>
              </div>

              <div className="mt-8 p-4 bg-gray-50 rounded-2xl flex items-center gap-3">
                 <div className="h-10 w-15  bg-white rounded-full flex items-center justify-center text-teal-500 shadow-sm">
                    <FiShoppingBag />
                 </div>
                 <p className="text-[10px] text-gray-400 leading-tight  font-medium">
                    Taxes and shipping are calculated at the next step, but shipping is currently <span className="text-black font-bold">FREE</span> for you.
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