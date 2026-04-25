import { IoMdClose } from "react-icons/io";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { RiShoppingBag2Fill } from "react-icons/ri";
import { BsArrowLeft } from "react-icons/bs";

interface ShoppingCartProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const ShoppingCart = ({ isOpen, setIsOpen }: ShoppingCartProps) => {
  const {
    cartItems,
    cartTotal,
    removeFromCart,
    updateQuantity,
    isUpdating,
    updatingVariables,
  } = useCart();

  // Kuryer hesablama məntiqi
  const SHIPPING_LIMIT = 180;
  const shippingCost = cartTotal < SHIPPING_LIMIT && cartItems.length > 0 ? 10 : 0;
  const finalTotal = cartTotal + shippingCost;

  const sortedItems = [...cartItems].sort(
    (a, b) => a.cartItemId - b.cartItemId,
  );

  // 1. SKROLUN QARŞISINI ALMAQ ÜÇÜN MÜKƏMMƏL EFFEKT
  useEffect(() => {
    if (isOpen) {
      // Skrolu bağla
      document.body.style.overflow = "hidden";
      // Bəzi mobil brauzerlər üçün əlavə sığorta
      document.documentElement.style.overflow = "hidden";
    } else {
      // Skrolu geri qaytar
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Overlay: Arxa fonu qaraldır */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-black/50 z-[998] transition-opacity duration-500 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* Drawer: Səbət menyusu */}
      <div
        className={`
          fixed top-0 right-0 z-[999] bg-white 
          w-full sm:w-[450px] md:w-[500px]
          h-[100dvh] shadow-[-10px_0_30px_rgba(0,0,0,0.1)] 
          transition-all duration-500 ease-in-out
          flex flex-col font-[Playfair]
          /* SAĞA DOĞRU SKROLU ARADAN QALDIRAN KLASLAR: */
          ${isOpen ? "translate-x-0 visible" : "translate-x-full invisible"}
        `}
      >
        {/* Header - flex-shrink-0 (Sabit) */}
        <div className="p-6 flex justify-between items-center border-b border-gray-100 flex-shrink-0">
          <h1 className="text-xl font-bold uppercase tracking-widest text-gray-800">
            Shopping Cart ({cartItems.length})
          </h1>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-full cursor-pointer transition-all duration-300 hover:bg-black hover:rotate-180 hover:text-white"
          >
            <IoMdClose className="text-2xl" />
          </button>
        </div>

      
        <div className="flex-1 min-h-0 overflow-y-auto">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <div className="relative mb-6">
                <div className="absolute -inset-5 bg-gray-50 rounded-full animate-pulse"></div>
                <RiShoppingBag2Fill

                  size={80}
                  strokeWidth={1}
                  className="relative text-gray-300 animate-pulse"
                />
              </div>
              <p className="italic">Your cart is empty</p>
              <Link
                to="/products"
                onClick={() => setIsOpen(false)}
                className="mt-4 text-black underline font-bold uppercase text-xs tracking-widest flex items-center gap-1 transition-transform duration-300  group"
              >
                 <BsArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Shop Now
              </Link>
            </div>
          ) : (
            <div className="flex flex-col">
              {sortedItems.map((item) => {
                const isThisUpdating =
                  isUpdating && updatingVariables?.perfumeId === item.perfumeId;
                return (
                  <div
                    key={item.cartItemId}
                    className="flex items-center gap-4 p-6 border-b border-gray-50 bg-white"
                  >
                    <div className="w-20 h-24 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.imageUrl}
                        alt=""
                        className="w-full h-full object-fill p-2"
                      />
                    </div>

                    <div className="flex-1 text-left">
                      <h2 className="text-sm font-bold text-gray-800 uppercase leading-tight">
                        {item.perfumeName}
                      </h2>
                      <p className="text-gray-400 text-xs mb-3 uppercase">
                        {item.brand}
                      </p>

                      <div className="flex items-center justify-between ">
                        <div className="flex items-center gap-4 border border-gray-200 px-3 py-1.5 rounded-full bg-white">
                          <button
                            onClick={() =>
                              item.quantity > 1 &&
                              updateQuantity({
                                perfumeId: item.perfumeId,
                                quantity: -1,
                              })
                            }
                            className={`cursor-pointer ${item.quantity <= 1 || isThisUpdating ? "text-gray-200" : "text-gray-500"}`}
                            disabled={isThisUpdating}
                          >
                            <FiMinus size={14} />
                          </button>
                          <span
                            className={`text-sm font-bold tabular-nums ${isThisUpdating ? "animate-pulse" : ""}`}
                          >
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity({
                                perfumeId: item.perfumeId,
                                quantity: 1,
                              })
                            }
                            className={`cursor-pointer ${isThisUpdating ? "text-gray-200" : "text-gray-500"}`}
                            disabled={isThisUpdating}
                          >
                            <FiPlus size={14} />
                          </button>
                        </div>
                        <span className="font-medium font-[Jost] text-[#81d8d0] text-xs">
                          {item.subTotal}
                          <span className="text-xs">.00 Azn</span>
                        </span>
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="relative inline-block align-middle overflow-hidden group tracking-widest cursor-pointer"
                        >
                          <span className="absolute bottom-0 left-0 h-[1px] w-full bg-red-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                          <span className="relative block text-[10px] font-bold text-red-500 transition-transform duration-300 group-hover:-translate-y-full flex items-center gap-1">
                            <FiTrash2 /> REMOVE
                          </span>
                          <span className="absolute inset-0 text-[10px] font-bold text-red-700 translate-y-full transition-transform duration-300 group-hover:translate-y-0 flex items-center gap-1">
                            <FiTrash2 /> REMOVE
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer - flex-shrink-0 (Sabit aşağıda qalır) */}
        <div className="p-4 md:p-6 border-t border-gray-100 bg-white shadow-[0_-10px_20px_rgba(0,0,0,0.02)] flex-shrink-0">
          <div className="flex flex-col mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-bold text-sm uppercase tracking-widest text-gray-400">
                Shipping
              </h2>
              <p className="font-medium font-[Jost] text-gray-800">
                {shippingCost === 0 ? (
                  <span className="text-green-600 uppercase text-xs font-bold tracking-widest">Free</span>
                ) : (
                  <span className="text-green-600 font-bold">+10.00 Azn</span>
                )}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-sm uppercase tracking-widest text-gray-400">
                Estimated Total
              </h2>
              <p className="font-medium font-[Jost] text-lg text-gray-800">
                {finalTotal}
                <span className="text-sm">.00 Azn</span>
              </p>
            </div>
            
            {shippingCost > 0 && (
              <p className="mt-3 text-[10px] text-gray-400 uppercase tracking-widest text-center italic">
                Add <span className="font-bold text-black">{SHIPPING_LIMIT - cartTotal} Azn</span> more for <span className="text-green-600 font-bold">Free</span> shipping
              </p>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <Link to="/checkout" onClick={() => setIsOpen(false)} className="relative w-full h-14 bg-black text-white rounded-xl overflow-hidden group cursor-pointer  shadow-lg active:scale-[0.98] transition-transform">
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold tracking-[3px] uppercase transition-transform duration-300 group-hover:-translate-y-full">
                Secure Checkout
              </span>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold tracking-[3px] uppercase translate-y-full transition-transform duration-300 group-hover:translate-y-0">
                Secure Checkout
              </span>
            </Link>
            <Link
              to="/viewcart"
              onClick={() => setIsOpen(false)}
              className="relative inline-block w-full h-14 bg-white text-black border border-black rounded-xl overflow-hidden group cursor-pointer active:scale-[0.98] transition-transform"
            >
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold tracking-[3px] uppercase transition-transform duration-300 group-hover:-translate-y-full">
                View Full Cart
              </span>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold tracking-[3px] uppercase translate-y-full transition-transform duration-300 group-hover:translate-y-0">
                View Full Cart
              </span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShoppingCart;