import React, { useState } from "react";
import { useOrder } from "../../hooks/useOrder";
import {
  FiTruck,
  FiCheckCircle,
  FiChevronDown,
  FiUser,
  FiClock,
  FiMapPin,
  FiEdit3,
} from "react-icons/fi";
import ShipOrderModal from "../../components/ShipOrderModal";
import type { Order } from "../../types/perfume";
const AdminOrders = () => {
  const { allOrders, updateStatus, shipOrder, isLoading, isShipping } =
    useOrder();
  const [openOrderId, setOpenOrderId] = useState<number | null>(null);
  const [isShipModalOpen, setIsShipModalOpen] = useState(false);
  const [targetOrderId, setTargetOrderId] = useState<number | null>(null);
  console.log(allOrders, "adsadsadasd");
  const handleOpenShipModal = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setTargetOrderId(id);
    setIsShipModalOpen(true);
  };

  if (isLoading)
    return (
      <div className="py-20 text-center animate-pulse font-bold">
        LOADING...
      </div>
    );

  return (
    <div className="space-y-6 font-[Playfair]">
      <h1 className="text-2xl font-bold uppercase tracking-tighter">Orders</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b">
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {allOrders.map((order: Order) => {
              const isOpen = openOrderId === order.id;

              return (
                <React.Fragment key={order.id}>
                  {/* ANA SƏTİR */}
                  <tr
                    onClick={() => setOpenOrderId(isOpen ? null : order.id)}
                    className={`group cursor-pointer transition-colors ${isOpen ? "bg-gray-50/50" : "hover:bg-gray-50/30"}`}
                  >
                    <td className="px-6 py-5 font-bold text-gray-800">
                      #{order.id}
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-500">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-5 font-bold text-gray-900">
                      {order.totalAmount} Azn
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-tighter ${
                          order.status === "DELIVERED"
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        {order.status === "PENDING" && (
                          <button
                            onClick={(e) => handleOpenShipModal(e, order.id)}
                            className="p-2 text-blue-500 hover:bg-blue-100 rounded-lg transition"
                          >
                            <FiTruck size={16} />
                          </button>
                        )}
                        {order.status === "SHIPPED" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateStatus({
                                id: order.id,
                                status: "DELIVERED",
                              });
                            }}
                            className="p-2 text-green-500 hover:bg-green-100 rounded-lg transition"
                          >
                            <FiCheckCircle size={16} />
                          </button>
                        )}
                        <div
                          className={`p-2 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                        >
                          <FiChevronDown />
                        </div>
                      </div>
                    </td>
                  </tr>

                  {/* AÇILAN DETAL BÖLMƏSİ */}
                  {isOpen && (
                    <tr className="bg-[#fafafa]">
                      <td
                        colSpan={5}
                        className="px-8 py-8 border-b border-gray-100 shadow-inner"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-in slide-in-from-top-2 duration-300">
                          {/* SOL: MÜŞTƏRİ TƏLƏBİ (ÜNVAN VƏ NOT) */}
                          <div className="space-y-6">
                            <div>
                              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-3">
                                Delivery Destination
                              </h4>
                              <div className="flex items-start gap-3">
                                <div className="p-2 bg-white rounded-lg border border-gray-100 text-gray-400">
                                  <FiMapPin />
                                </div>
                                <p className="text-sm font-medium text-gray-700 leading-relaxed">
                                  {order.address}
                                </p>
                              </div>
                            </div>

                            {/* MÜŞTƏRİ NOTU BURADA GÖSTƏRİLİR */}
                            <div>
                              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-3">
                                Customer's Note
                              </h4>
                              <div className="flex items-start gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                                <div className="p-2 text-[#81d8d0]">
                                  <FiEdit3 />
                                </div>
                                <p className="text-sm italic text-gray-600">
                                  {order.orderNote
                                    ? `"${order.orderNote}"`
                                    : "No special instructions provided by the customer."}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* SAĞ: KURYER TƏYİNATI */}
                          <div className="space-y-6">
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-3">
                              Courier Assignment
                            </h4>

                            {order.courierName ? (
                              <div className="bg-white p-6 rounded-3xl border border-blue-100 shadow-lg shadow-blue-900/5 space-y-4">
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
                                    <FiUser />
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold text-gray-800">
                                      {order.courierName}
                                    </p>
                                    <p className="text-xs text-blue-600 font-bold">
                                      {order.courierPhone}
                                    </p>
                                  </div>
                                </div>
                                <div className="pt-4 border-t border-gray-50 flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
                                    <FiClock />
                                  </div>
                                  <div>
                                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">
                                      Scheduled Delivery
                                    </p>
                                    <p className="text-xs font-bold text-gray-800">
                                      {order.estimatedDeliveryTime
                                        ? new Date(
                                            order.estimatedDeliveryTime,
                                          ).toLocaleString("en-GB", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            day: "2-digit",
                                            month: "short",
                                          })
                                        : "Not assigned"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="p-10 border-2 border-dashed border-gray-200 rounded-3xl text-center">
                                <p className="text-xs text-gray-300 uppercase font-bold tracking-widest">
                                  Waiting for shipment
                                </p>
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
