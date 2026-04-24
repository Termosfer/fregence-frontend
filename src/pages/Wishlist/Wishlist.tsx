import { Link } from "react-router-dom";
import { useWishlist } from "../../hooks/useWishlist";
import { useCart } from "../../hooks/useCart";
/* import Recomendation from "../../components/Recomendation"; */

const Wishlist = () => {
  const { wishlist, removeFromWishlist, isLoading } = useWishlist();
  const { addToCart } = useCart();
  if (isLoading) {
    return (
      <div className="text-center py-20 text-xl font-bold animate-pulse uppercase tracking-widest">
        Loading Wishlist...
      </div>
    );
  }

  return (
    <div className="py-10 px-4 sm:px-8 lg:px-20 font-[Playfair]">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-10">
        Wishlist ({wishlist.length})
      </h1>

      <div className="w-full">
        {wishlist.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-xl">
            <p className="text-gray-500 text-lg mb-6 italic text-[Playfair]">
              Your wishlist is currently empty.
            </p>
            <Link
              to="/products"
              className="
                            relative  md:min-w-[120px]
                            h-[46px] w-[120px] overflow-hidden group
                            rounded-full bg-black text-white
                            border border-black transition
                            hover:bg-white hover:text-black
                            cursor-pointer
                            inline-flex items-center justify-center
                          "
            >
              <span className="absolute inset-0 flex items-center  justify-center text-sm font-semibold transition-transform duration-300 group-hover:-translate-y-full ">
                Shop Now
              </span>
              <span className="absolute inset-0 flex items-center  justify-center text-sm font-semibold text-black translate-y-full transition-transform duration-300 group-hover:translate-y-0 ">
                Shop Now
              </span>
            </Link>
          </div>
        ) : (
          <div className="">
            <table className="w-full border-collapse lg:min-w-0">
              <thead className="hidden md:table-header-group border-b-2 border-t-2 border-gray-300">
                <tr className="text-center text-[#00000080] font-medium text-md lg:text-lg">
                  <th className="py-6 text-left">Product</th>
                  <th className="py-6">Price</th>
                  <th className="py-6">Stock Status</th>
                  <th className="py-6"></th>
                </tr>
              </thead>

              <tbody>
                {wishlist.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b-2 border-gray-300 block md:table-row mb-6 lg:mb-0"
                  >
                    {/* Product Info */}
                    <td className="py-6 block lg:table-cell">
                      <div className="flex items-center gap-4">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-20 h-24 object-contain rounded-md bg-gray-50"
                        />
                        <div className="text-left">
                          <p className="font-semibold text-base sm:text-lg">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-400 uppercase tracking-widest">
                            {item.brand}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-6 font-medium font-[Jost] text-lg hidden md:table-cell text-center">
                      {item.price}<span className="text-sm">.00 azn</span>
                    </td>

                    {/* Stock Status */}
                    <td className="py-6 text-green-600 font-semibold text-lg hidden md:table-cell text-center">
                      In Stock
                    </td>

                    {/* Actions */}
                    <td className="py-6 block md:table-cell">
                      <div className="flex flex-col items-center sm:flex-row lg:justify-end gap-4">
                        {/* Add to Cart Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(item);
                          }}
                          className="
                            relative w-full md:min-w-[120px]
                            h-[46px] overflow-hidden group
                            rounded-full border border-black
                            transition-colors duration-300
                            hover:bg-black
                            cursor-pointer
                          "
                        >
                          <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-black transition-transform duration-300 group-hover:-translate-y-full group-hover:text-white uppercase">
                            Add to Cart
                          </span>
                          <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-white translate-y-full transition-transform duration-300 group-hover:translate-y-0 uppercase">
                            Add to Cart
                          </span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromWishlist(item.id);
                          }}
                          className="
                            relative w-full md:min-w-[120px]
                            h-[46px] overflow-hidden group
                            rounded-full bg-black text-white
                            border border-black transition
                            hover:bg-white hover:text-black
                            cursor-pointer
                          "
                        >
                          <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold transition-transform duration-300 group-hover:-translate-y-full uppercase">
                            Remove
                          </span>
                          <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-black translate-y-full transition-transform duration-300 group-hover:translate-y-0 uppercase">
                            Remove
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="mt-10">{/* <Recomendation /> */}</div>
    </div>
  );
};

export default Wishlist;
