import { motion } from "framer-motion";
import img16 from "../../assets/about1_1.webp";
import img17 from "../../assets/about1_2.webp";
import img18 from "../../assets/borcen-store-newdemo.myshopify.com.svg";
import img19 from "../../assets/borcen-store-newdemo.myshopify.com (1).svg";
import img20 from "../../assets/borcen-store-newdemo.myshopify.com (2).svg";
import Newsletter from "../../components/Newsletter";

const features = [
  {
    id: 1,
    title: "Design",
    description: "Crafting bottles that are as much a piece of art as the essence within. Minimalism meets timeless aesthetics.",
    image: img18,
  },
  {
    id: 2,
    title: "Innovation",
    description: "Utilizing rare molecular distillation to extract the purest notes from nature's most hidden corners.",
    image: img19,
  },
  {
    id: 3,
    title: "Journey",
    description: "Every scent is a passage through time and memory, curated to resonate with your unique identity.",
    image: img20,
  },
];

const About = () => {
  return (
    <div className="bg-white font-[Playfair]">
      {/* 1. HERO BREADCRUMB - Daha Dramatik */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden bg-[#FAFAF9]">
        <div className="absolute inset-0 z-0">
          {/* Buraya sənin breadcrumb image-in gəlir */}
          <div className="w-full h-full bg-[url('../../assets/map.webp')] bg-cover bg-fixed bg-center opacity-20 grayscale"></div>
        </div>
        <div className="relative z-10 text-center space-y-4 px-4">
          <motion.span 
            initial={{ opacity: 0, letterSpacing: "10px" }}
            animate={{ opacity: 1, letterSpacing: "4px" }}
            className="text-[10px] md:text-xs font-black uppercase text-[#81d8d0]"
          >
            Est. 2025 — The Essence of Art
          </motion.span>
          <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter text-gray-900">
            Our <span className="italic font-light text-gray-400">Atelier</span>
          </h1>
        </div>
      </section>

      {/* 2. OUR STORY - Editorial Layout */}
      <section className="py-24 px-4 sm:px-8 lg:px-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-2">
              <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight leading-none">Our Story</h2>
              <p className="text-xs font-black uppercase tracking-[4px] text-[#81d8d0]">The High Stress Favourite</p>
            </div>
            <p className="text-gray-500 text-lg leading-relaxed italic font-light">
              Founded on the belief that a fragrance should be more than a scent—it should be a masterpiece. We began our journey in a small atelier, 
              obsessing over the alchemy of rare oils and the emotions they evoke.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Praesent metus tellus, elementum eu, semper a, adipiscing nec, purus. Vestibulum volutpat pretium libero. 
              In ut quam vitae odio lacinia tincidunt. Etiam ut purus mattis mauris sodales aliquam. 
              Aenean massa. In dui magna, posuere eget, vestibulum et, tempor auctor, justo.
            </p>
          </motion.div>
          <div className="relative">
            <div className="overflow-hidden rounded-[3rem] shadow-2xl transition-transform duration-700 hover:scale-[0.98]">
              <img src={img16} alt="Atelier" className="w-full h-full object-cover" />
            </div>
            {/* Dekorativ Tiffany Blue Kvadrat */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#81d8d0]/10 -z-10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </section>

      {/* 3. WHO WE ARE - Inverted Layout */}
      <section className="py-24 bg-[#FAFAF9]">
        <div className="px-4 sm:px-8 lg:px-20 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1">
            <div className="overflow-hidden rounded-[3rem] shadow-2xl transition-transform duration-700 hover:scale-[1.02]">
              <img src={img17} alt="Who We Are" className="w-full h-full object-cover" />
            </div>
          </div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2 space-y-8"
          >
            <div className="space-y-2">
              <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight leading-none">Who We Are</h2>
              <p className="text-xs font-black uppercase tracking-[4px] text-[#81d8d0]">Crafting Emotions</p>
            </div>
            <p className="text-gray-500 text-lg leading-relaxed italic font-light">
              We are a collective of visionaries, chemists, and dreamers. Our team is dedicated to pushing the boundaries 
              of modern perfumery while respecting the ancient traditions of scent extraction.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Etiam ut purus mattis mauris sodales aliquam. Aenean massa. In dui magna, posuere eget, vestibulum et, 
              tempor auctor, justo. Vivamus consectetuer hendrerit lacus. In hac habitasse platea dictumst. 
              Ut tincidunt tincidunt erat.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 4. BRAND PILLARS - FEATURES */}
      <section className="py-32 px-4 sm:px-8 lg:px-20 bg-white text-center">
        <div className="max-w-3xl mx-auto mb-20 space-y-4">
          <h2 className="text-4xl font-bold uppercase tracking-tighter">Our Philosophies</h2>
          <p className="text-gray-400 text-sm italic uppercase tracking-widest">The pillars that define M-Parfum</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-7xl mx-auto">
          {features.map((feature) => (
            <motion.div 
              key={feature.id}
              whileHover={{ y: -10 }}
              className="flex flex-col items-center space-y-6 group"
            >
              <div className="w-24 h-24 rounded-full bg-[#FAFAF9] flex items-center justify-center p-6 border border-gray-50 shadow-inner group-hover:bg-black transition-colors duration-500">
                <img src={feature.image} alt={feature.title} className="w-full h-full object-contain group-hover:invert transition-all" />
              </div>
              <div className="space-y-3 px-4">
                <h3 className="text-2xl font-bold uppercase tracking-tight italic">{feature.title}</h3>
                <div className="w-12 h-[1.5px] bg-[#81d8d0] mx-auto group-hover:w-24 transition-all duration-500"></div>
                <p className="text-gray-400 text-sm leading-relaxed font-light italic">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <Newsletter />
    </div>
  );
};

export default About;