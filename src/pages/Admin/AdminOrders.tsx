import React, { useState } from "react";
import { useOrder } from "../../hooks/useOrder";
import {
  FiTruck,
  FiChevronDown,
  FiUser,
  FiMapPin,
  FiEdit3,
  FiTrash2,
  FiFilter,
  FiX,
  FiCheck,
  FiShoppingBag,
  FiPhone,
  FiMail,
  FiLoader,
} from "react-icons/fi";
import ShipOrderModal from "../../components/ShipOrderModal";
import type { Order, OrderFilters, OrderItem } from "../../types/perfume";
import { useOutletContext } from "react-router-dom";

const AdminOrders = () => {
  const {
    allOrders,
    updateStatus,
    shipOrder,
    deleteOrder,
    deleteAllOrders,
    isLoading,
    isShipping,
    isDeletingAll,
  } = useOrder();
  
  const [openOrderId, setOpenOrderId] = useState<number | null>(null);
  const [isShipModalOpen, setIsShipModalOpen] = useState(false);
  const [targetOrderId, setTargetOrderId] = useState<number | null>(null);
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);
const query = useOutletContext<string>(); // Bunu əlavə et


  // FİLTR STATE (Tiplərlə)
  const [filters, setFilters] = useState<OrderFilters>({
    search: "",
    status: "ALL",
    minPrice: undefined,
    maxPrice: undefined,
    sortBy: "orderDate",
    sortDir: "desc", // Default olaraq ən sonuncu yuxarıda
  });

  const handleOpenShipModal = (e: React.MouseEvent | null, id: number) => {
    if (e) e.stopPropagation();
    setTargetOrderId(id);
    setIsShipModalOpen(true);
  };

  // ANLIQ FİLTRLƏMƏ VƏ SIRALAMA
  const displayedOrders = [...allOrders]
  .filter((order: Order) => {
    // A) Global Axtarış (Layout-dakı search bar üçün)
    const q = query.toLowerCase();
    const matchesGlobal = 
      order.customerName.toLowerCase().includes(q) ||
      order.customerEmail.toLowerCase().includes(q) ||
      order.phoneNumber.includes(q) ||
      order.id.toString().includes(q);

    // B) Lokal Filtr (Səhifədəki filtr pəncərəsi üçün)
    const searchLower = filters.search.toLowerCase();
    const matchesLocalSearch = 
      order.customerName.toLowerCase().includes(searchLower) || 
      order.customerEmail.toLowerCase().includes(searchLower);
    
    const matchesStatus = filters.status === "ALL" || order.status === filters.status;
    const matchesMinPrice = filters.minPrice ? order.totalAmount >= filters.minPrice : true;
    const matchesMaxPrice = filters.maxPrice ? order.totalAmount <= filters.maxPrice : true;

    return matchesGlobal && matchesLocalSearch && matchesStatus && matchesMinPrice && matchesMaxPrice;
  })
  .sort((a: Order, b: Order) => {
    const dir = filters.sortDir === "asc" ? 1 : -1;
    if (filters.sortBy === "totalAmount") return (a.totalAmount - b.totalAmount) * dir;
    return (new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime()) * dir;
  });

  const handleClearFilter = () => {
    setFilters({
      search: "",
      status: "ALL",
      minPrice: undefined,
      maxPrice: undefined,
      sortBy: "orderDate",
      sortDir: "desc",
    });
    setIsFiltered(false);
    setIsFilterOpen(false);
  };

  if (isLoading)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-8 font-[Playfair]">
      {/* Ürək kimi döyünən Logo Area */}
      <div className="relative flex items-center justify-center">
        
        {/* Dalğa effekti (Logonun arxasından yayılan halqalar) */}
        <div className="absolute inset-0 rounded-3xl bg-teal-500/20 animate-ping shadow-2xl"></div>
        <div className="absolute inset-0 rounded-3xl bg-teal-500/10 animate-[ping_2s_linear_infinite] shadow-xl"></div>

        {/* Ana Logo Bloqu */}
        <div className="relative w-20 h-20 bg-[#0F172A] text-white flex items-center justify-center rounded-3xl shadow-2xl z-10 animate-[heartbeat_1.5s_ease-in-out_infinite]">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-black tracking-tighter italic">Mi</span>
            <div className="w-4 h-[1px] bg-teal-500 mt-0.5"></div>
          </div>
        </div>
      </div>

      {/* Yazı Hissəsi */}
      <div className="text-center space-y-2">
        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-gray-900 animate-pulse">
          Mi-Parfum
        </h2>
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-teal-600/60">
          Syncing Order Records...
        </p>
      </div>

      {/* Arxa planda solğun skeleton cədvəl (istifadəçiyə dərinlik hissi vermək üçün) */}
      <div className="absolute inset-0 -z-10 opacity-[0.03] pointer-events-none px-10 pt-32">
        <div className="space-y-6">
          {[1, 2, 3, 4]?.map((i) => (
            <div key={i} className="h-16 bg-black rounded-3xl w-full"></div>
          ))}
        </div>
      </div>

      {/* Ürək döyüntüsü üçün lazım olan xüsusi CSS (Tailwind ilə birlikdə) */}
      <style>{`
        @keyframes heartbeat {
          0% { transform: scale(1); }
          15% { transform: scale(1.12); }
          30% { transform: scale(1); }
          45% { transform: scale(1.15); }
          70% { transform: scale(1); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
    );

  return (
    <div className="space-y-8 font-[Playfair]">
      {/* HEADER PART */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-tight text-gray-900">
            Orders Hub
          </h1>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-[2px] mt-1">
            {displayedOrders.length} records in queue
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`cursor-pointer flex items-center gap-2 px-5 py-3 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all ${isFilterOpen || isFiltered ? "bg-black text-white border-black shadow-lg" : "bg-white text-gray-600 border-gray-100 hover:border-gray-400"}`}
            >
              <FiFilter size={14} /> Filter{" "}
              {isFiltered && <FiCheck className="ml-1" />}
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 top-full mt-3 w-[350px] md:w-[450px] bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 p-6 animate-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between mb-5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Filters
                  </p>
                  <button aria-label="fix"
                    onClick={() => setIsFilterOpen(false)}
                    className="cursor-pointer"
                  >
                    <FiX size={16} />
                  </button>
                </div>
                <div className="space-y-4">
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => {
                      setFilters((p) => ({ ...p, search: e.target.value }));
                      setIsFiltered(true);
                    }}
                    className="w-full border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:border-black bg-gray-50/30"
                    placeholder="Customer name, email or phone..."
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <select
                      value={filters.status}
                      onChange={(e) => {
                        setFilters((p) => ({ ...p, status: e.target.value }));
                        setIsFiltered(true);
                      }}
                      className="border border-gray-100 rounded-xl px-3 py-3 text-sm outline-none bg-transparent cursor-pointer"
                    >
                      <option value="ALL">All Status</option>
                      <option value="PENDING">Pending</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                    </select>
                    <select
                      value={filters.sortDir}
                      onChange={(e) => {
                        setFilters((p) => ({
                          ...p,
                          sortDir: e.target.value as "asc" | "desc",
                        }));
                        setIsFiltered(true);
                      }}
                      className="border border-gray-100 rounded-xl px-3 py-3 text-sm outline-none bg-transparent cursor-pointer"
                    >
                      <option value="desc">Newest First</option>
                      <option value="asc">Oldest First</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 mt-8 pt-4 border-t border-gray-50">
                  <button onClick={handleClearFilter} className="cursor-pointer px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-all">Reset</button>
                  <button onClick={() => setIsFilterOpen(false)} className="cursor-pointer flex-1 py-3 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Apply & Close</button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setConfirmDeleteAll(true)}
            className="cursor-pointer px-5 py-3 border border-red-200 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
          >
            Delete All
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-[10px] font-black uppercase tracking-[2px] text-gray-400 border-b border-gray-100">
                <th className="px-8 py-6">Ref ID</th>
                <th className="px-6 py-6">Client</th>
                <th className="px-6 py-6">Placed At</th>
                <th className="px-6 py-6">Amount</th>
                <th className="px-6 py-6">Status</th>
                <th className="px-6 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {displayedOrders?.map((order: Order) => {
                const isOpen = openOrderId === order.id;
                return (
                  <React.Fragment key={order.id}>
                    <tr
                      onClick={() => setOpenOrderId(isOpen ? null : order.id)}
                      className={`group cursor-pointer transition-all ${isOpen ? "bg-gray-50/80 shadow-inner" : "hover:bg-gray-50/40"}`}
                    >
                      <td className="px-8 py-6 font-bold text-gray-900 text-sm">
                        #{order.id}
                      </td>
                      <td className="px-6 py-6">
                        <p className="text-sm font-bold text-gray-800 leading-none mb-1">
                          {order.customerName}
                        </p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                          {order.phoneNumber}
                        </p>
                      </td>
                      <td className="px-6 py-6 text-xs text-gray-500">
                        {new Date(order.orderDate).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-6 py-6 font-bold text-gray-900 text-sm">
                        {order.totalAmount.toFixed(2)} AZN
                      </td>
                      <td className="px-6 py-6">
                        <span
                          className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${order.status === "DELIVERED" ? "bg-green-100 text-green-700" : order.status === "SHIPPED" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          {order.status === "PENDING" && (
                            <button aria-label="truck button"
                              onClick={(e) => handleOpenShipModal(e, order.id)}
                              className="p-2.5 text-blue-500 hover:bg-blue-100 rounded-xl transition cursor-pointer"
                            >
                              <FiTruck size={18} />
                            </button>
                          )}
                          <button aria-label="trash"
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmDeleteId(order.id);
                            }}
                            className="p-2.5 text-red-400 hover:bg-red-50 rounded-xl transition cursor-pointer"
                          >
                            <FiTrash2 size={18} />
                          </button>
                          <div
                            className={`p-2.5 transition-transform duration-500 ${isOpen ? "rotate-180 text-black" : "text-gray-300"}`}
                          >
                            <FiChevronDown size={18} />
                          </div>
                        </div>
                      </td>
                    </tr>

                    {/* EXPANDED - 3 SÜTUNLU STRUKTUR */}
                    {isOpen && (
                      <tr className="bg-[#fafafa]">
                        <td
                          colSpan={6}
                          className="p-10 border-b border-gray-100"
                        >
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in fade-in slide-in-from-top-4 duration-500">
                            {/* 1. SÜTUN: MEHSULLAR (ƏN ÖNƏMLİ HİSSƏ) */}
                            <div className="space-y-4">
                              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] flex items-center gap-2 mb-4">
                                <FiShoppingBag className="text-black" /> Items
                                Information
                              </h4>
                              <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar space-y-3">
                                {order?.items?.map((item: OrderItem) => (
                                  <div
                                    key={item.id}
                                    className="bg-white p-3 rounded-2xl border border-gray-100 flex items-center gap-4 shadow-sm"
                                  >
                                    <div className="w-14 h-14 bg-gray-50 rounded-xl overflow-hidden p-1 flex-shrink-0">
                                      <img
                                        src={item.imageUrl}
                                        alt={item.brand}
                                        className="w-full h-full object-contain"
                                      />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p className="text-[9px] font-black text-teal-600 uppercase tracking-widest">
                                        {item.brand}
                                      </p>
                                      <p className="text-sm font-bold text-gray-800 truncate">
                                        {item.perfumeName}
                                      </p>
                                      <p className="text-[11px] font-bold text-gray-400 mt-1">
                                        {item.quantity} x {item.price} AZN
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* 2. SÜTUN: MÜŞTƏRİ MƏLUMATLARI */}
                            <div className="space-y-6">
                              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-4">
                                Contact Info
                              </h4>
                              <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
                                <div className="space-y-3">
                                  <div className="flex items-center gap-3 text-sm font-bold text-gray-800">
                                    <FiUser className="text-gray-400" />{" "}
                                    {order.customerName}
                                  </div>
                                  <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
                                    <FiMail className="text-gray-400" />{" "}
                                    {order.customerEmail}
                                  </div>
                                  <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
                                    <FiPhone className="text-gray-400" />{" "}
                                    {order.phoneNumber}
                                  </div>
                                  <div className="flex items-start gap-3 text-sm font-medium text-gray-600  border-t border-gray-50">
                                    <FiMapPin className="text-gray-400 mt-1" />{" "}
                                    {order.address}
                                  </div>
                                </div>
                                {order?.orderNote && (
                                  <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100/50">
                                    <p className="text-xs italic text-orange-900 leading-relaxed">
                                      <FiEdit3 className="inline mr-1" />
                                      {order?.preferredDeliveryTime
                                        ? new Date(
                                            order.preferredDeliveryTime,
                                          ).toLocaleString("en-GB", {
                                            day: "2-digit",
                                            month: "short",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          })
                                        : "No preferred time set"}
                                    </p>{" "}
                                    <p className="text-xs italic text-orange-900 leading-relaxed">
                                      <FiEdit3 className="inline mr-1" /> "
                                      {order.orderNote}"
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* 3. SÜTUN: KURYER VƏ ÇATDIRILMA */}
                            <div className="space-y-6">
                              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-4">
                                Logistics
                              </h4>
                              {order.courierName ? (
                                <div className="bg-black text-white p-6 rounded-[2rem] shadow-xl space-y-5">
                                  <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-[#81d8d0]">
                                      <FiTruck size={24} />
                                    </div>
                                    <div>
                                      <p className="text-sm font-bold">
                                        {order.courierName}
                                      </p>
                                      <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">
                                        {order.courierPhone}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="pt-4 border-t border-white/10 text-xs">
                                    <p className="opacity-40 uppercase font-black text-[9px] mb-1">
                                      Estimated Delivery
                                    </p>
                                    <p className="font-bold text-[#81d8d0]">
                                      {order.estimatedDeliveryTime
                                        ? new Date(
                                            order.estimatedDeliveryTime,
                                          ).toLocaleString()
                                        : "Processing"}
                                    </p>
                                  </div>
                                  {order.status === "SHIPPED" && (
                                    <button
                                      onClick={() =>
                                        updateStatus({
                                          id: order.id,
                                          status: "DELIVERED",
                                        })
                                      }
                                      className="w-full py-4 bg-[#81d8d0] text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all cursor-pointer"
                                    >
                                      Mark Delivered
                                    </button>
                                  )}
                                </div>
                              ) : (
                                <div className="p-8 border-2 border-dashed border-gray-200 rounded-[2rem] flex flex-col items-center justify-center text-center space-y-4">
                                  <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                                    <FiTruck size={28} />
                                  </div>
                                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    Waiting for Assignment
                                  </p>
                                  <button
                                    onClick={() =>
                                      handleOpenShipModal(null, order.id)
                                    }
                                    className="px-6 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all cursor-pointer"
                                  >
                                    Assign Courier
                                  </button>
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

      {/* SİLMƏ MODALI */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[200] backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl space-y-6 mx-4 text-center">
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto text-red-500 animate-bounce">
              <FiTrash2 size={36} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 uppercase tracking-tighter">
              Remove Order #{confirmDeleteId}?
            </h3>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="cursor-pointer flex-1 py-4 border border-gray-100 rounded-2xl text-[10px] font-black uppercase text-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteOrder(confirmDeleteId);
                  setConfirmDeleteId(null);
                }}
                className="cursor-pointer flex-1 py-4 bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase hover:bg-red-600 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HAMISINI SİLMƏ MODALI */}
      {confirmDeleteAll && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[250] backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl space-y-6 mx-4 text-center transform animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto text-red-500 animate-bounce">
              <FiTrash2 size={36} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 uppercase tracking-tighter">
              Delete All?
            </h3>
            <p className="text-sm text-gray-500">
              Removing{" "}
              <span className="font-bold text-red-600">
                {allOrders.length} orders
              </span>{" "}
              permanently.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDeleteAll(false)}
                className="cursor-pointer flex-1 py-4 border border-gray-100 rounded-2xl text-[10px] font-black uppercase text-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteAllOrders();
                  setConfirmDeleteAll(false);
                }}
                disabled={isDeletingAll}
                className="cursor-pointer flex-1 py-4 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase hover:bg-red-700 transition-all"
              >
                {isDeletingAll ? (
                  <FiLoader className="animate-spin mx-auto" />
                ) : (
                  "Confirm All"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <ShipOrderModal
        isOpen={isShipModalOpen}
        onClose={() => setIsShipModalOpen(false)}
        orderId={targetOrderId}
        onConfirm={(data) => {
          if (targetOrderId) shipOrder({ id: targetOrderId, ...data });
          setIsShipModalOpen(false);
        }}
        isLoading={isShipping}
      />
    </div>
  );
};

export default AdminOrders;
