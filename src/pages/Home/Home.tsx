import { useEffect, useState } from "react";
import img1 from "../../assets/s56-1.webp";
import img2 from "../../assets/s56-2.webp";
import img3 from "../../assets/Floral.webp";
import img4 from "../../assets/Warm-_-Spicy.webp";
import img5 from "../../assets/Woody-_-Earthy.webp";
import img6 from "../../assets/Lavender.webp";
import img7 from "../../assets/Vanilla.webp";
import img8 from "../../assets/Fresh.webp";
import img9 from "../../assets/b9-1.webp";
import img10 from "../../assets/b9-2.webp";
import img11 from "../../assets/b9-3.webp";
import img13 from "../../assets/b124-1.webp";
import img14 from "../../assets/b124-2.jpg";
import "./home.css";
import { FiHeart, FiSearch, FiShoppingCart } from "react-icons/fi";
import type { PageResponse, Perfume } from "../../types/perfume";
import api from "../../api/axios";
import { useQuery } from "@tanstack/react-query";
import QuickModal from "../../components/QuickModal";
import { useWishlist } from "../../hooks/useWishlist";
import { useCart } from "../../hooks/useCart";
import { Link } from "react-router";
const slides = [
  {
    image: img1,
  },
  {
    image: img2,
  },
];
const images = [
  {
    image: img3,
    title: "Floral",
  },
  {
    image: img4,
    title: "Warm & Spicy",
  },
  {
    image: img5,
    title: "Woody & Earthy",
  },
  {
    image: img6,
    title: "Lavender",
  },
  {
    image: img7,
    title: "Vanilla",
  },
  {
    image: img8,
    title: "Fresh",
  },
];

const scentCards = [
  {
    id: 1,
    title: "Sandalwood",
    image: img9,
  },
  {
    id: 2,
    title: "Lavender",
    image: img10,
  },
  {
    id: 3,
    title: "Jasmine",
    image: img11,
  },
];

const fetchPerfumes = async (page = 0): Promise<PageResponse<Perfume>> => {
  const response = await api.get<PageResponse<Perfume>>(
    `/perfumes?page=${page}&size=4`,
  );
  return response.data;
};

const Home = () => {
  const [current, setCurrent] = useState<number>(0);
  const [open, isOpen] = useState<boolean>(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null,
  );
  const { addToWishlist } = useWishlist();
  const { addToCart } = useCart();
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const { data, isLoading, isError, error } = useQuery<PageResponse<Perfume>>({
    queryKey: ["perfumes"],
    queryFn: () => fetchPerfumes(6),
  });


  if (isError) {
    return (
      <div className="text-red-500 text-center py-20">
        Xəta: {(error as Error).message}
      </div>
    );
  }

  const handleOpenModal = (id: number) => {
    setSelectedProductId(id);
    isOpen(true);
  };
  return (
    <div className="">
      <div className="relative w-full h-[70vh] sm:h-[80vh] lg:h-screen overflow-hidden">
        {slides.map((src, index) => (
          <img
            key={index}
            src={src.image}
            alt={`slide-${index}`}
            className={`slideImage ${index === current ? "active" : ""}`}
          />
        ))}

        <div
          className="
      absolute
      top-1/2
      left-1/2 lg:left-auto lg:right-20
      -translate-x-1/2 lg:translate-x-0
      -translate-y-1/2
      flex flex-col
      gap-4 sm:gap-6
      text-center lg:text-left
      text-white
      z-10
      font-[Playfair]
      px-4
      max-w-[90%] sm:max-w-[520px]
    "
        >
          <h1
            className="
        text-xl lg:text-4xl
        tracking-[2px]
        font-normal
        text-nowrap
      "
          >
            Whispers Of Perfume
          </h1>

          <p
            className="
        text-sm lg:text-xl
        text-[#d1d1d1]
        font-medium
      "
          >
            The perfect harmony between passion, elegance and desire
          </p>

          <Link to="/products"
            className="
        cursor-pointer
        relative
        w-40 sm:w-44 lg:w-52
        h-[50px] sm:h-[56px]
        overflow-hidden
        border-2 border-white
        bg-transparent
        group
        mx-auto lg:mx-0
      "
          >
            <span
              className="
          absolute inset-0
          flex items-center justify-center
          text-sm sm:text-base lg:text-lg
          font-semibold
          text-white
          transition-transform duration-300
          group-hover:-translate-y-full
        "
            >
              SHOP NOW
            </span>

            <span
              className="
          absolute inset-0
          flex items-center justify-center
          text-sm sm:text-base lg:text-lg
          font-semibold
          text-white
          translate-y-full
          transition-transform duration-300
          group-hover:translate-y-0
        "
            >
              SHOP NOW
            </span>
          </Link>
        </div>
      </div>

      <section className="py-10 section">
        <div
          className="
    text-left
    px-4 sm:px-8 lg:px-20
    py-6 sm:py-8
  "
        >
          <h2
            className="
      text-2xl
      sm:text-3xl
      
      mb-3
    "
          >
            Shop By Notes
          </h2>

          <div
            className="
      w-16 sm:w-20 lg:w-28
      border-b-2
      border-[#81d8d0]
    "
          ></div>
        </div>

        <div
          className="
    grid
    grid-cols-1
    sm:grid-cols-2
    md:grid-cols-3
    lg:grid-cols-6
    gap-6
    px-4 sm:px-8 lg:px-20
    mt-10
  "
        >
          {images.map((img, index) => (
            <div
              key={index}
              className="
        flex flex-col items-center
        border border-[#e6e6e6]
        p-4
        hover:shadow-md
        transition
      "
            >
              <div className="overflow-hidden">
                <img
                  src={img.image}
                  alt={img.title}
                  className="
            w-40 sm:w-48 md:w-52 lg:w-60 
            cursor-pointer
            transition-transform
            duration-700
            hover:scale-110
          "
                />
              </div>

              <h3
                className="
          text-black
          text-lg sm:text-xl
          font-bold
          py-4
          hover:text-[#81d8d0]
          transition-colors
          cursor-pointer
          text-center
        "
              >
                {img.title}
              </h3>
            </div>
          ))}
        </div>

        <div
          className="
    flex flex-col md:flex-row
    items-start lg:items-center
    justify-between
    gap-4 lg:gap-15
    py-40
    px-4 sm:px-8 lg:px-20
    max-w-6xl
    mx-auto
  "
        >
          <h1
            className="
    text-2xl sm:text-3xl lg:text-6xl
    font-semibold
    w-full lg:w-1/2
  "
          >
            Our product
          </h1>

          <p
            className="
    text-sm sm:text-base lg:text-2xl
    w-full lg:w-1/2
    md:text-left
    
    text-[#00000080]
  "
          >
            Dive into the world of golf with exclusive events, community vibes,
            and beginner-friendly resources.
          </p>
        </div>

        <div
          className="
  grid 
  grid-cols-1 
  sm:grid-cols-2 
  lg:grid-cols-3 
  gap-6 
  mb-12 
  py-10 
  px-4 sm:px-8 lg:px-20
"
        >
          {scentCards.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-xl relative group"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full  object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Overlay */}
              <div
                className="
        absolute inset-0 
        bg-black/40 
        opacity-0 
        scale-95 
        group-hover:opacity-100 
        group-hover:scale-100 
        transition-all duration-700
      "
              ></div>

              {/* Title */}
              <h4
                className="
          absolute inset-0
          flex items-center justify-center
          text-white 
          text-xl sm:text-2xl lg:text-[40px]
          font-bold
          opacity-0 translate-y-6
          transition-all duration-700 ease-out
          group-hover:opacity-100
          group-hover:translate-y-0
        "
              >
                {item.title}
              </h4>
            </div>
          ))}
        </div>
      </section>

      <section className="py-10 section">
        <div className="text-center px-4 sm:px-8 lg:px-20 py-5">
          <h2 className="text-xl lg:text-3xl mb-3">Featured Products</h2>
          <div className="w-20 sm:w-28 border-b-2 border-[#81d8d0] mx-auto"></div>
        </div>

        <div
  className="
    grid
    grid-cols-1
    sm:grid-cols-2
    lg:grid-cols-3
    xl:grid-cols-4
    gap-10
    px-4 sm:px-8 lg:px-20
    mt-10
    
  "
>
  {isLoading
    ? 
      [...Array(4)].map((_, i) => (
        <div 
          key={i} 
          className="flex flex-col items-center justify-between p-4 bg-white rounded-lg shadow-sm animate-pulse border border-gray-50"
        >
          {/* Şəkil yeri üçün skelet */}
          <div className="w-full aspect-square bg-gray-100 rounded-lg mb-5"></div>
          
          {/* Mətn yerləri üçün skelet */}
          <div className="w-full flex flex-col items-center gap-3">
            <div className="h-4 bg-gray-100 rounded w-3/4"></div>
            <div className="h-4 bg-gray-100 rounded w-1/2"></div>
          </div>
        </div>
      ))
    : data?.content?.map((item) => (
        <div
          key={item.id}
          className="relative overflow-hidden flex flex-col items-center justify-between text-center group shadow-lg rounded-lg p-4 bg-white"
        >
          {/* ŞƏKİL SAHƏSİ */}
          <div className="w-full aspect-square overflow-hidden img-hover-effect">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
            />

            <span className="absolute top-3 -right-14 bg-red-500 text-white text-xs font-semibold px-16 py-1 rotate-45 shadow-lg">
              SALE
            </span>

            {/* HOVER İKONLARI */}
            <div
              className="
                absolute bottom-20 left-1/2 transform -translate-x-1/2 
                flex items-center justify-center gap-4
                transition-all duration-500
                opacity-100 translate-y-0
                xl:opacity-0 xl:translate-y-20
                xl:group-hover:opacity-100 xl:group-hover:translate-y-0
              "
            >
              <div
                className="relative inline-flex items-center justify-center w-[40px] h-[40px] md:w-[50px] md:h-[50px] bg-white rounded-full shadow-lg cursor-pointer hover:bg-black hover:text-white transition-colors duration-500"
                onClick={() => handleOpenModal(item.id)}
              >
                <FiSearch className="w-4 h-4 md:w-5 md:h-5" />
              </div>

              <div
                className="relative inline-flex items-center justify-center w-[40px] h-[40px] md:w-[50px] md:h-[50px] bg-white rounded-full shadow-lg cursor-pointer hover:bg-black hover:text-white transition-colors duration-500"
                onClick={() => addToWishlist(item)}
              >
                <FiHeart className="w-4 h-4 md:w-5 md:h-5" />
              </div>

              <div
                className="relative inline-flex items-center justify-center w-[40px] h-[40px] md:w-[50px] md:h-[50px] bg-white rounded-full shadow-lg cursor-pointer hover:bg-black hover:text-white transition-colors duration-500"
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(item);
                }}
              >
                <FiShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
              </div>
            </div>
          </div>

          {/* MƏTN SAHƏSİ */}
          <div className="mt-5">
            <h5 className="text-base font-semibold mb-2">{item.name}</h5>
            <div className="flex justify-center items-center gap-3 font-[Jost]">
              <span className="text-[#81d8d0] text-base font-semibold">
                {item.price}
                <span className="text-xs">.00 Azn</span>
              </span>
              {item.discountPrice && (
                <span className="line-through text-xs text-gray-500">
                  {item.discountPrice}.00 Azn
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
</div>
      </section>
      <QuickModal
        show={open}
        setShowModal={isOpen}
        productId={selectedProductId}
      />
      <section className="py-5 bg-[#f4ede5] section">
        <div
          className="
      flex flex-col lg:flex-row
      items-center justify-center
      gap-12
      py-10 
      px-4 sm:px-8 lg:px-20
     
    "
        >
          <div className="flex flex-col items-left gap-5 w-full lg:w-1/2">
            <div className="overflow-hidden w-full rounded-lg">
              <img
                src={img13}
                alt=""
                className="
            w-full h-[360px] sm:h-[540px] lg:h-[750px]
            object-cover
            transition-transform duration-1000
            hover:scale-110
          "
              />
            </div>

            <div className="text-left max-w-xl">
              <h6 className="text-2xl sm:text-3xl  mb-2">Start your journey</h6>
              <p className="text-sm sm:text-base lg:text-xl text-[#00000080]">
                As the seasons start to shift, add something richer to your
                fragrance wardrobe with warming notes of amber and spice.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-left gap-5 w-full lg:w-1/2">
            <div className="overflow-hidden w-full rounded-lg">
              <img
                src={img14}
                alt=""
                className="
             w-full h-[360px] sm:h-[540px] lg:h-[750px]
            object-cover
            transition-transform duration-1000
            hover:scale-110
          "
              />
            </div>

            <div className="text-left max-w-xl">
              <h6 className="text-2xl sm:text-3xl  mb-2">Autumn Scents</h6>
              <p className="text-sm sm:text-base lg:text-xl text-[#00000080]">
                As the seasons start to shift, add something richer to your
                fragrance wardrobe with warming notes of amber and spice.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
