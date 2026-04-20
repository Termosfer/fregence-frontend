import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import paymentMethods from "../../assets/5-pb.png";
import paymentMethods1 from "../../assets/5.png";
import { Link } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import type { CartItem } from "../../types/perfume";

const ViewCart = () => {
  const {
    cartItems,
    cartTotal,
    removeFromCart,
    updateQuantity,
    isLoading,
    isUpdating,
    updatingVariables, // O an artırılan/azaldılan məhsulun ID-si
    isRemoving,
    removingVariables, // O an silinən məhsulun ID-si
  } = useCart();

  // 1. Məhsulların yerinin dəyişməməsi üçün ID-yə görə sıralayırıq
  const sortedItems: CartItem[] = [...cartItems].sort(
    (a, b) => a.cartItemId - b.cartItemId,
  );

  if (isLoading) {
    return (
      <div className="text-center py-20 text-xl font-bold animate-pulse uppercase tracking-widest">
        Loading Cart...
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="py-40 px-4 flex flex-col items-center justify-center font-[Playfair]">
        <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-xl w-full max-w-2xl bg-white shadow-sm">
          <p className="text-gray-500 text-lg mb-6 italic text-[Playfair]">
            Your shopping cart is currently empty.
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
                            inline-flex itemsc-center justify-center
                          "
          >
            <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold transition-transform duration-300 group-hover:-translate-y-full ">
              Continue Shopping
            </span>
            <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-black translate-y-full transition-transform duration-300 group-hover:translate-y-0 ">
              Continue Shopping
            </span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 px-4 sm:px-8 lg:px-20 font-[Playfair] bg-white min-h-screen">
      {/* TITLE */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-10 text-gray-800 uppercase tracking-tight">
        Your Shopping Cart
      </h1>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* TABLE SECTION */}
        <div className="flex-1 overflow-x-auto text-left">
          <table className="w-full border-collapse">
            <thead className="hidden md:table-header-group border-b border-gray-100">
              <tr className="text-left text-gray-400 uppercase tracking-[2px] text-[10px] font-bold">
                <th className="py-6">Product Details</th>
                <th className="py-6 text-center">Quantity</th>
                <th className="py-6 text-right">Subtotal</th>
              </tr>
            </thead>

            <tbody>
              {sortedItems.map((item: CartItem) => {
                // HƏDƏF FOKUSLU LOADING: Yalnız bu sətir yenilənirmi?
                const isThisItemUpdating =
                  isUpdating && updatingVariables?.perfumeId === item.perfumeId;
                const isThisItemRemoving =
                  isRemoving && removingVariables === item.cartItemId;

                return (
                  <tr
                    key={item.cartItemId}
                    className={`border-b border-gray-50 transition-all duration-300 ${isThisItemRemoving ? "opacity-20 scale-95 pointer-events-none" : "opacity-100"}`}
                  >
                    {/* PRODUCT INFO */}
                    <td className="py-8 table-cell">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        <div className="w-24 h-32 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center p-2 border border-gray-100">
                          <img
                            src={item.imageUrl}
                            alt={item.perfumeName}
                            className="w-full h-full object-fill"
                          />
                        </div>

                        <div className="space-y-1 text-left">
                          <p className="text-[10px] text-gray-400 uppercase tracking-[2px] font-bold">
                            {item.brand}
                          </p>
                          <h2 className="font-bold text-lg text-gray-800 leading-tight">
                            {item.perfumeName}
                          </h2>
                          <p className="text-base font-medium text-[#81d8d0]">
                            {item.price}
                            <span className="text-xs">.00 azn</span>
                          </p>

                          {/* DELETE BUTTON */}
                          <button
                            onClick={() => removeFromCart(item.cartItemId)}
                            disabled={isThisItemRemoving}
                            className="relative inline-block overflow-hidden group tracking-widest cursor-pointer mt-4"
                          >
                            <span className="absolute bottom-0 left-0 h-[1px] w-full bg-red-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                            <span className="relative block text-[10px] font-bold text-red-500 transition-transform duration-300 group-hover:-translate-y-full flex items-center gap-1">
                              <FiTrash2 />{" "}
                              {isThisItemRemoving ? "DELETING..." : "REMOVE"}
                            </span>
                            <span className="absolute inset-0 text-[10px] font-bold text-red-700 translate-y-full transition-transform duration-300 group-hover:translate-y-0 flex items-center gap-1">
                              <FiTrash2 /> REMOVE
                            </span>
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* QUANTITY CONTROL */}
                    <td className="py-8 block md:table-cell text-left md:text-center">
                      <div className="flex md:justify-center mt-4 md:mt-0">
                        <div
                          className={`flex items-center gap-6 border border-gray-200 px-5 py-2.5 rounded-full bg-white transition-all ${isThisItemUpdating ? "shadow-inner border-gray-300" : "shadow-sm"}`}
                        >
                          <button
                            onClick={() =>
                              item.quantity > 1 &&
                              updateQuantity({
                                perfumeId: item.perfumeId,
                                quantity: -1,
                              })
                            }
                            disabled={isThisItemUpdating || item.quantity <= 1}
                            className={`cursor-pointer transition-all ${
                              item.quantity <= 1 || isThisItemUpdating
                                ? "text-gray-200"
                                : "hover:text-black text-gray-500"
                            }`}
                          >
                            <FiMinus />
                          </button>

                          <span
                            className={`w-6 text-center font-bold tabular-nums text-gray-800 ${isThisItemUpdating ? "animate-pulse" : ""}`}
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
                            disabled={isThisItemUpdating}
                            className={`cursor-pointer transition-all ${
                              isThisItemUpdating
                                ? "text-gray-200"
                                : "hover:text-black text-gray-500"
                            }`}
                          >
                            <FiPlus />
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* TOTAL PRICE */}
                    <td className="py-8 block md:table-cell text-left md:text-right font-bold text-base text-gray-800">
                      <span className="md:hidden font-bold text-gray-400 mr-2 text-xs uppercase tracking-widest">
                        Total:
                      </span>
                      {item.subTotal}
                      <span className="text-xs">.00 azn</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <Link
            to="/products"
            className="relative inline-block w-fit overflow-hidden group tracking-widest cursor-pointer mt-10 text-white"
          >
            <span className="absolute bottom-0 left-0 h-[1px] w-full bg-[#00000080] scale-x-100 group-hover:scale-x-0 transition-transform duration-300"></span>
            <span className="relative block text-xs font-bold text-gray-400 px-1 transition-transform duration-300 group-hover:-translate-y-full">
              CONTINUE SHOPPING
            </span>
            <span className="absolute inset-0 text-xs font-bold text-black px-1 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
              CONTINUE SHOPPING
            </span>
          </Link>
        </div>

        {/* SUMMARY SECTION */}
        <div className="w-full lg:w-[350px] xl:w-[450px] bg-gray-50 border border-gray-100 rounded-3xl p-10 h-fit shadow-2xl shadow-gray-100/50">
          <h2 className="text-xl font-bold mb-8 uppercase tracking-[2px] text-gray-800 border-b border-gray-200 pb-4">
            Order Summary
          </h2>

          <div className="space-y-5 mb-8">
            <div className="flex justify-between text-gray-600 font-medium">
              <span>Subtotal</span>
              <span className="text-black font-bold">
                {cartTotal}
                <span className="text-xs">.00 azn</span>
              </span>
            </div>
            <div className="flex justify-between text-gray-600 font-medium">
              <span>Shipping</span>
              <span className="text-green-600 font-bold text-xs uppercase tracking-widest">
                Free
              </span>
            </div>
          </div>

          <div className="flex justify-between font-bold border-t border-gray-200 pt-6 text-2xl text-black">
            <span>Total</span>
            <span className="tracking-tight">
              {cartTotal}
              <span className="text-xs">.00 azn</span>
            </span>
          </div>

          <Link to="/checkout" className="relative inline-block  w-full h-[60px] bg-black text-white rounded-2xl overflow-hidden group cursor-pointer mt-10 shadow-lg active:scale-[0.98] transition-transform">
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold tracking-[3px] uppercase transition-transform duration-300 group-hover:-translate-y-full">
              Proceed to Check Out
            </span>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold tracking-[3px] uppercase translate-y-full transition-transform duration-300 group-hover:translate-y-0">
              Confirm Order
            </span>
          </Link>

          {/* PAYMENT */}
          <div className="mt-10 text-center">
            <p className="text-[10px] text-gray-400 font-bold uppercase mb-4 tracking-[2px]">
              Guaranteed Safe Checkout
            </p>
            <div className="flex items-center justify-center">
              <img
                src={paymentMethods1}
                alt="Payments"
                className=" "
              />
              <img
                src={paymentMethods}
                alt="Payments"
                className=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCart;
