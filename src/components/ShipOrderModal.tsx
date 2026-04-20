import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { FiUser, FiPhone, FiClock, FiSend } from "react-icons/fi";
import { toast } from "react-toastify";

interface ShipOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: number | null;
  onConfirm: (data: { courierName: string; courierPhone: string; estimatedTime: string }) => void;
  isLoading: boolean;
}

const ShipOrderModal = ({ isOpen, onClose, orderId, onConfirm, isLoading }: ShipOrderModalProps) => {
  const [formData, setFormData] = useState({
    courierName: "",
    courierPhone: "",
    estimatedTime: ""
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Sadə validasiya
    if (!formData.courierName || !formData.courierPhone || !formData.estimatedTime) {
      toast.warn("Please fill in all courier details.");
      return;
    }

    onConfirm(formData);
  };

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center px-4">
      {/* Arxa fonu qaraldan hissə */}
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Qutusu */}
      <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden font-[Playfair] animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-[#fafafa]">
          <div>
            <h2 className="text-xl font-bold uppercase tracking-tighter text-gray-800">Assign Courier</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Order ID: #{orderId}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-all cursor-pointer">
            <IoMdClose size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* Courier Name */}
          <div className="space-y-2 group">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 group-focus-within:text-black transition-colors">
              <FiUser /> Courier Full Name
            </label>
            <input 
              required
              className="w-full border-b border-gray-100 py-2 outline-none focus:border-black transition-all text-sm bg-transparent"
              placeholder="e.g. Ahmet Yilmaz"
              value={formData.courierName}
              onChange={(e) => setFormData({...formData, courierName: e.target.value})}
            />
          </div>

          {/* Courier Phone */}
          <div className="space-y-2 group">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 group-focus-within:text-black transition-colors">
              <FiPhone /> Contact Number
            </label>
            <input 
              required
              type="tel"
              className="w-full border-b border-gray-100 py-2 outline-none focus:border-black transition-all text-sm bg-transparent"
              placeholder="+994 -- --- -- --"
              value={formData.courierPhone}
              onChange={(e) => setFormData({...formData, courierPhone: e.target.value})}
            />
          </div>

          {/* Estimated Arrival */}
          <div className="space-y-2 group">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 group-focus-within:text-black transition-colors">
              <FiClock /> Estimated Delivery Time
            </label>
            <input 
              required
              type="datetime-local"
              className="w-full border-b border-gray-100 py-2 outline-none focus:border-black transition-all text-sm text-gray-500 bg-transparent cursor-pointer"
              value={formData.estimatedTime}
              onChange={(e) => setFormData({...formData, estimatedTime: e.target.value})}
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white py-4 rounded-2xl font-bold uppercase tracking-[3px] text-xs mt-4 hover:bg-gray-800 transition-all shadow-xl active:scale-[0.98] disabled:bg-gray-300 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? "Processing..." : <><FiSend /> Ship Order Now</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShipOrderModal;