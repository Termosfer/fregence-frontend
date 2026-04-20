import { useState } from "react";
import { useUser } from "../../hooks/useUser";

import { 
  FiPackage, FiChevronDown, FiCheckCircle, 
  FiClock, FiTruck, FiAlertCircle, FiShoppingBag, FiPhone 
} from "react-icons/fi";
import { Link } from "react-router-dom";
import type { Order, OrderItem, OrderStatus } from "../../types/perfume";

const OrderHistory = () => {
  const { orders, isLoading } = useUser();
  const [openOrderId, setOpenOrderId] = useState<number | null>(null);
console.log(orders)
  // Statusa uyğun rəng, ikon və mətni təyin edən funksiya
  const getStatusDetails = (status: OrderStatus) => {
    switch (status) {
      case "DELIVERED":
        return { color: "text-green-600 bg-green-50 border-green-100", icon: <FiCheckCircle /> };
      case "SHIPPED":
        return { color: "text-blue-600 bg-blue-50 border-blue-100", icon: <FiTruck /> };
      case "PENDING":
        return { color: "text-orange-500 bg-orange-50 border-orange-100", icon: <FiClock /> };
      case "CANCELLED":
        return { color: "text-red-500 bg-red-50 border-red-100", icon: <FiAlertCircle /> };
      default:
        return { color: "text-gray-500 bg-gray-50 border-gray-100", icon: <FiPackage /> };
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center animate-pulse uppercase tracking-[4px] font-bold text-gray-400">
        Syncing your history...
      </div>
    );
  }

  return (
    <div className="py-16 px-4 sm:px-8 lg:px-20 font-[Playfair] bg-[#fafafa] min-h-screen">
      <div className="max-w-5xl mx-auto">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h1 className="text-4xl font-bold uppercase tracking-tighter text-gray-900">My Orders</h1>
            <p className="text-gray-400 text-sm mt-2 uppercase tracking-widest">Review your past purchases and tracking</p>
          </div>
          <div className="bg-white px-6 py-2 rounded-full shadow-sm border border-gray-100 text-[10px] font-black uppercase tracking-widest">
            Total: {orders.length}
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white p-20 text-center rounded-[2rem] border border-dashed border-gray-200 flex flex-col items-center gap-6">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
               <FiShoppingBag size={30} />
            </div>
            <p className="text-gray-500 italic">You haven't placed any orders yet.</p>
            <Link to="/products" className="bg-black text-white px-10 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 transition shadow-lg">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order: Order) => {
              const isOpen = openOrderId === order.id;
              const { color, icon } = getStatusDetails(order.status);

              return (
                <div 
                  key={order.id} 
                  className={`bg-white rounded-[2rem] border transition-all duration-500 ${
                    isOpen ? "border-black shadow-xl" : "border-gray-100 shadow-sm hover:shadow-md"
                  }`}
                >
                  {/* ACCORDION HEADER */}
                  <div 
                    onClick={() => setOpenOrderId(isOpen ? null : order.id)}
                    className="p-6 md:p-8 flex flex-wrap items-center justify-between cursor-pointer gap-6"
                  >
                    <div className="flex items-center gap-6">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner ${color}`}>
                        {icon}
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-2">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Order ID</span>
                          <span className="text-sm font-bold text-gray-800">#{order.id}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Date</span>
                          <span className="text-sm font-bold text-gray-800">{new Date(order.orderDate).toLocaleDateString('en-GB')}</span>
                        </div>
                        <div className="flex flex-col hidden sm:flex">
                          <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Total</span>
                          <span className="text-sm font-bold text-[#81d8d0] tracking-tighter">{order.totalAmount} Azn</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 ml-auto sm:ml-0">
                      <span className={`text-[10px] font-black px-4 py-1.5 rounded-full border uppercase tracking-widest ${color}`}>
                        {order.status}
                      </span>
                      <div className={`p-2 rounded-full bg-gray-50 transition-transform duration-300 ${isOpen ? "rotate-180 bg-black text-black" : ""}`}>
                        <FiChevronDown />
                      </div>
                    </div>
                  </div>

                  {/* ACCORDION CONTENT (Expanded) */}
                  <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    isOpen ? "max-h-[1200px] opacity-100" : "max-h-0 opacity-0"
                  }`}>
                    <div className="px-8 pb-8 pt-2 border-t border-gray-50">
                      
                      {/* 1. KURYER MƏLUMATLARI (Yalnız Sifariş Yoldadırsa) */}
                      {order.status === "SHIPPED" && order.courierName && (
                        <div className="mt-6 mb-8 p-6 bg-blue-50 rounded-3xl border border-blue-100 flex flex-col md:flex-row justify-between items-center gap-6">
                           <div className="flex items-center gap-5">
                              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
                                 <FiTruck size={24} />
                              </div>
                              <div>
                                 <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Track Shipment</p>
                                 <p className="text-base font-bold text-gray-800">{order.courierName}</p>
                                 <p className="text-sm text-blue-700 font-medium">{order.courierPhone}</p>
                              </div>
                           </div>
                           
                           <div className="text-center md:text-right">
                              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Estimated Delivery</p>
                              <p className="text-base font-bold text-gray-800 tracking-tight">
                                 {order.estimatedDeliveryTime ? new Date(order.estimatedDeliveryTime).toLocaleString('en-GB', { 
                                    hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' 
                                 }) : "Pending..."}
                              </p>
                           </div>

                           <a 
                             href={`tel:${order.courierPhone}`}
                             className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                           >
                             <FiPhone /> Call Courier
                           </a>
                        </div>
                      )}

                      {/* 2. MƏHSUL SİYAHISI */}
                      <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[3px] mb-6 mt-4">Order Items</h3>
                      <div className="space-y-4">
                        {order.items.map((item: OrderItem) => (
                          <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-[#fafafa] border border-gray-100">
                            <div className="flex items-center gap-5">
                              <div className="w-16 h-20 bg-white rounded-xl overflow-hidden border border-gray-100 p-2 shadow-sm">
                                <img src={item.imageUrl} className="w-full h-full object-contain" alt={item.perfumeName} />
                              </div>
                              <div>
                                <p className="text-sm font-bold uppercase text-gray-800 leading-tight">{item.perfumeName}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-widest">
                                  Qty: <span className="text-black">{item.quantity}</span> • Unit Price: <span className="text-black">{item.price} Azn</span>
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-gray-800 tracking-tighter">{(item.price * item.quantity)} Azn</p>
                            </div>
                          </div>
                        ))}
                      </div>

                     
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;