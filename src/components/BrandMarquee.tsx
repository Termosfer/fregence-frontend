
const brands = [
  "Chanel", "Dior", "Gucci", "Tom Ford", 
  "Creed", "YSL", "Prada", "Versace", 
  "Byredo", "Kilian", "Armani"
];

const BrandMarquee = () => {
  return (
    <div className="py-16 bg-black overflow-hidden select-none border-y border-white/10">
      {/* Klass adını dəyişdik: animate-marquee-infinite */}
      <div className="animate-marquee-infinite">
        
        {/* BİRİNCİ SIRA */}
        <div className="flex items-center gap-16 md:gap-32 px-10">
          {brands.map((brand, index) => (
            <span
              key={index}
              className={`text-4xl md:text-6xl font-serif uppercase tracking-tighter`}
              style={{ 
                WebkitTextStroke: "1px rgba(255, 255, 255, 0.2)",
                color: index % 2 === 0 ? "rgba(255, 255, 255, 0.2)" : "transparent"
              }}
            >
              {brand}
            </span>
          ))}
        </div>

        {/* İKİNCİ SIRA (Sonsuzluq görüntüsü üçün eynisini bura da qoyuruq) */}
        <div className="flex items-center gap-16 md:gap-32 px-10">
          {brands.map((brand, index) => (
            <span
              key={`repeat-${index}`}
              className={`text-4xl md:text-6xl font-serif uppercase tracking-tighter`}
              style={{ 
                WebkitTextStroke: "1px rgba(255, 255, 255, 0.2)",
                color: index % 2 === 0 ? "rgba(255, 255, 255, 0.2)" : "transparent"
              }}
            >
              {brand}
            </span>
          ))}
        </div>
        
      </div>
    </div>
  );
};

export default BrandMarquee;