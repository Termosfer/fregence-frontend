import React, { useState, useEffect } from "react";
import { useOrder } from "../../hooks/useOrder";
import {
  FiTruck, FiChevronDown, FiUser, FiMapPin,  FiTrash2,
   FiShoppingBag, FiPhone, FiMail, FiClock
} from "react-icons/fi";
import ShipOrderModal from "../../components/ShipOrderModal";
import type { Order } from "../../types/perfume";
/* import { useOutletContext } from "react-router-dom"; */
import { useQueryClient } from "@tanstack/react-query";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

const AdminOrders = () => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);

  // Hook-a səhifə məlumatlarını ötürürük
  const {
    ordersData,
    updateStatus,
    shipOrder,
    deleteOrder,
    
    isLoading,
    isShipping,
    
  } = useOrder(currentPage, pageSize);

  const [openOrderId, setOpenOrderId] = useState<number | null>(null);
  const [isShipModalOpen, setIsShipModalOpen] = useState(false);
  const [targetOrderId, setTargetOrderId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
 /*  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false); */
  
  /* const query = useOutletContext<string>(); */

  // --- 1. WEB-SOCKET LİSTENER (Canlı Yenilənmə) ---
  useEffect(() => {
    const socket = new SockJS(`${import.meta.env.VITE_API_URL.replace("/api", "")}/ws-notifications`);
    const stompClient = Stomp.over(socket);
    stompClient.debug = () => {}; 

    stompClient.connect({}, () => {
      stompClient.subscribe("/topic/admin-notifications", () => {
        queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      });
    });

    return () => {
      if (stompClient.connected) stompClient.disconnect();
    };
  }, [queryClient]);

  const [filters, setFilters] = useState({ status: "ALL", sortDir: "desc" });

  const allOrders = ordersData?.content || [];
  const totalElements = ordersData?.totalElements || 0;
  const totalPages = ordersData?.totalPages || 0;

  const getPaginationRange = () => {
    const range: (number | string)[] = [];
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i);
    range.push(0);
    if (currentPage > 2) range.push("...");
    const start = Math.max(1, currentPage - 1);
    const end = Math.min(totalPages - 2, currentPage + 1);
    for (let i = start; i <= end; i++) range.push(i);
    if (currentPage < totalPages - 3) range.push("...");
    range.push(totalPages - 1);
    return range;
  };

  const handleOpenShipModal = (e: React.MouseEvent | null, id: number) => {
    if (e) e.stopPropagation();
    setTargetOrderId(id);
    setIsShipModalOpen(true);
  };

  if (isLoading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-8 font-[Playfair]">
        <div className="relative w-20 h-20 bg-[#0F172A] text-white flex items-center justify-center rounded-3xl animate-[heartbeat_1.5s_ease-in-out_infinite]">
             <span className="text-2xl font-black italic">Mi</span>
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Syncing Order Records...</p>
        <style>{`@keyframes heartbeat { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.15); } }`}</style>
    </div>
  );

  return (
    <div className="space-y-8 font-[Playfair]">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-tight text-gray-900">Orders Hub</h1>
          <p className="text-[10px] text-neutral font-black uppercase tracking-[2px] mt-1">
            {totalElements} total records | Page {currentPage + 1} of {totalPages}
          </p>
        </div>

      {/*   <div className="flex items-center gap-3">
          <select 
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            className="px-4 py-3 rounded-xl border border-gray-100 text-[10px] font-bold uppercase outline-none bg-white cursor-pointer hover:border-black transition-all"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="PAID">Paid</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
          </select>


          <button onClick={() => setConfirmDeleteAll(true)} className="px-5 py-3 border border-red-200 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all cursor-pointer">
            Delete All
          </button>
        </div> */}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-[10px] font-black uppercase tracking-[2px] text-neutral border-b border-gray-100">
                <th className="px-8 py-6">Ref ID</th>
                <th className="px-6 py-6">Client</th>
                <th className="px-6 py-6">Placed At</th>
                <th className="px-6 py-6">Amount</th>
                <th className="px-6 py-6">Status</th>
                <th className="px-6 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {allOrders.map((order: Order) => {
                const isOpen = openOrderId === order.id;
                return (
                  <React.Fragment key={order.id}>
                    <tr onClick={() => setOpenOrderId(isOpen ? null : order.id)} className={`group cursor-pointer transition-all ${isOpen ? "bg-gray-50/80 shadow-inner" : "hover:bg-gray-50/40"}`}>
                      <td className="px-8 py-6 font-bold text-gray-900 text-sm">#{order.id}</td>
                      <td className="px-6 py-6">
                        <p className="text-sm font-bold text-gray-800 leading-none mb-1">{order.customerName}</p>
                        <p className="text-[10px] text-neutral font-bold uppercase tracking-tight">{order.phoneNumber}</p>
                      </td>
                      <td className="px-6 py-6 text-xs text-gray-500">{new Date(order.orderDate).toLocaleString("en-GB")}</td>
                      <td className="px-6 py-6 font-bold text-gray-900 text-sm">{order.totalAmount} AZN</td>
                      <td className="px-6 py-6">
                        <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest 
                          ${order.status === 'PAID' ? 'bg-teal-100 text-teal-700' : 
                            order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' : 
                            order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                          {order.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          {(order.status === "PAID" || order.status === "PENDING") && (
                            <button onClick={(e) => handleOpenShipModal(e, order.id)} className="p-2.5 text-blue-500 hover:bg-blue-100 rounded-xl transition cursor-pointer">
                              <FiTruck size={18} />
                            </button>
                          )}
                          <button onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(order.id); }} className="p-2.5 text-red-400 hover:bg-red-50 rounded-xl transition cursor-pointer">
                            <FiTrash2 size={18} />
                          </button>
                          <div className={`p-2.5 transition-transform duration-500 ${isOpen ? "rotate-180 text-black" : "text-gray-300"}`}>
                            <FiChevronDown size={18} />
                          </div>
                        </div>
                      </td>
                    </tr>

                    {isOpen && (
                      <tr className="bg-[#fafafa]">
                        <td colSpan={6} className="p-10 border-b border-gray-100">
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in fade-in slide-in-from-top-4 duration-500">
                            {/* 1. SÜTUN: MEHSULLAR */}
                            <div className="space-y-4">
                               <h4 className="text-[10px] font-black uppercase tracking-[2px] flex items-center gap-2"><FiShoppingBag /> Items Info</h4>
                               <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar space-y-3">
                                 {order.items.map((item) => (
                                   <div key={item.id} className="bg-white p-3 rounded-2xl border border-gray-100 flex items-center gap-4 shadow-sm">
                                      <img src={item.imageUrl} alt="" className="w-12 h-16 object-contain" />
                                      <div className="min-w-0 flex-1">
                                          <p className="text-[9px] font-black text-teal-600 uppercase">{item.brand}</p>
                                          <p className="text-sm font-bold truncate">{item.perfumeName}</p>
                                          <p className="text-[10px] font-bold text-gray-400">{item.quantity} x {item.price} AZN</p>
                                      </div>
                                   </div>
                                 ))}
                               </div>
                            </div>

                            {/* 2. SÜTUN: MÜŞTƏRİ VƏ TƏLƏB EDİLƏN VAXT */}
                            <div className="space-y-4">
                               <h4 className="text-[10px] font-black uppercase tracking-[2px]">Shipping Detail</h4>
                               <div className="bg-white p-6 rounded-4xl border border-gray-100 space-y-4 shadow-sm">
                                  <div className="space-y-2 text-sm">
                                      <div className="flex items-center gap-3 font-bold"><FiUser className="text-gray-300" /> {order.customerName}</div>
                                      <div className="flex items-center gap-3"><FiPhone className="text-gray-300" /> {order.phoneNumber}</div>
                                      <div className="flex items-center gap-3"><FiMail className="text-gray-300" /> {order.customerEmail}</div>
                                      <div className="flex items-start gap-3 text-gray-600"><FiMapPin className="text-gray-300 mt-1" /> {order.address}</div>
                                  </div>

                                  {/* YENİ: Müştərinin seçdiyi çatdırılma vaxtı */}
                                  {order.preferredDeliveryTime && (
                                    <div className="bg-teal-50 p-3 rounded-xl border border-teal-100 flex items-center gap-3">
                                       <FiClock className="text-teal-600" />
                                       <div>
                                          <p className="text-[8px] font-black text-teal-700 uppercase tracking-widest">Requested Delivery</p>
                                          <p className="text-xs font-bold text-teal-900">
                                            {new Date(order.preferredDeliveryTime).toLocaleString("en-GB", { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                          </p>
                                       </div>
                                    </div>
                                  )}

                                  {order.orderNote && (
                                    <div className="p-3 bg-orange-50 rounded-xl text-xs italic text-orange-800 border border-orange-100">
                                      "{order.orderNote}"
                                    </div>
                                  )}
                               </div>
                            </div>

                            {/* 3. SÜTUN: LOGİSTİKA VƏ KURYER VAXTI */}
                            <div className="space-y-4">
                               <h4 className="text-[10px] font-black uppercase tracking-[2px]">Logistics Control</h4>
                               {order.courierName ? (
                                 <div className="bg-black text-white p-6 rounded-4xl space-y-5 shadow-xl">
                                    <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[#81d8d0]">
                                            <FiTruck size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">{order.courierName}</p>
                                            <p className="text-[10px] opacity-50 uppercase tracking-widest">{order.courierPhone}</p>
                                        </div>
                                    </div>

                                    {/* YENİ: Kuryer üçün təyin olunan təxmini vaxt */}
                                    <div className="space-y-1">
                                       <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Est. Arrival Time</p>
                                       <p className="text-xs font-bold text-[#81d8d0]">
                                         {order.estimatedDeliveryTime 
                                            ? new Date(order.estimatedDeliveryTime).toLocaleString("en-GB", { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) 
                                            : "Calculating..."}
                                       </p>
                                    </div>

                                    {order.status === "SHIPPED" && (
                                        <button onClick={() => updateStatus({ id: order.id, status: "DELIVERED" })} className="w-full py-4 bg-[#81d8d0] text-black rounded-xl text-[10px] font-black uppercase hover:bg-white transition-all cursor-pointer">Mark as Delivered</button>
                                    )}
                                 </div>
                               ) : (
                                 <div className="p-8 border-2 border-dashed border-gray-200 rounded-4xl text-center space-y-4">
                                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-200"><FiTruck size={24} /></div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Waiting Assignment</p>
                                    <button onClick={() => handleOpenShipModal(null, order.id)} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase hover:bg-black transition-all cursor-pointer shadow-lg">Assign Courier</button>
                                 </div>
                               )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION - SAĞ TƏRƏFƏ YÖNLƏNDİRİLDİ */}
      <div className="flex justify-end items-center gap-2 pt-4">
        {getPaginationRange().map((p, idx) => (
          <button
            key={idx}
            onClick={() => typeof p === 'number' && setCurrentPage(p)}
            className={`w-10 h-10 rounded-xl text-[10px] font-black uppercase transition-all border cursor-pointer
                ${currentPage === p ? "bg-black text-white border-black shadow-lg scale-110" : "bg-white text-gray-400 border-gray-100 hover:border-black hover:text-black"}`}
            disabled={p === "..."}
          >
            {p === "..." ? "..." : (p as number) + 1}
          </button>
        ))}
      </div>

      {/* DELETE MODALS */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-200 backdrop-blur-sm">
           <div className="bg-white p-10 rounded-[2.5rem] max-w-sm w-full text-center space-y-6">
              <h3 className="text-xl font-bold uppercase">Remove Order #{confirmDeleteId}?</h3>
              <div className="flex gap-3">
                 <button onClick={() => setConfirmDeleteId(null)} className="flex-1 py-4 border rounded-2xl text-[10px] font-black uppercase cursor-pointer">Cancel</button>
                 <button onClick={() => { deleteOrder(confirmDeleteId); setConfirmDeleteId(null); }} className="flex-1 py-4 bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase cursor-pointer">Delete</button>
              </div>
           </div>
        </div>
      )}

      <ShipOrderModal 
        isOpen={isShipModalOpen} 
        onClose={() => setIsShipModalOpen(false)} 
        orderId={targetOrderId} 
        onConfirm={(data) => { if (targetOrderId) shipOrder({ id: targetOrderId, ...data }); setIsShipModalOpen(false); }} 
        isLoading={isShipping} 
      />
    </div>
  );
};

export default AdminOrders;