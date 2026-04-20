import { Link } from "react-router-dom";
import { 
  FaInstagram, 
  FaFacebookF, 
  FaTwitter, 
  FaLinkedinIn 
} from "react-icons/fa"; // npm install react-icons
import logo from "../assets/black.png";
import img1 from "../assets/5.png";
import img2 from "../assets/5-pb.png";
import img4 from "../assets/Kapital_Bank_logo_2025.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 pt-10 pb-8 font-[Playfair]">
      <div className="px-4 sm:px-8 lg:px-20 mx-auto ">
        
        {/* Üst Hissə: Grid Struktur */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-4 ">
          
          {/* Sütun 1: Logo və Təsvir */}
          <div className="flex flex-col gap-6 items-center md:justify-start">
            <img src={logo} alt="MI Parfum Logo" className="w-40 object-contain" />
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs italic ">
              Discover the essence of elegance. High-end fragrances curated for your unique style.
            </p>
            {/* Sosial İkonlar */}
            <div className="flex gap-4 justify-center md:justify-start">
              <a href="#" className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300">
                <FaInstagram size={14} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300">
                <FaFacebookF size={14} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300">
                <FaTwitter size={14} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300">
                <FaLinkedinIn size={14} />
              </a>
            </div>
          </div>

          {/* Sütun 2: Quick Links */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-6">Explore</h4>
            <ul className="flex flex-col gap-4 text-gray-500 text-sm font-medium">
              <li><Link to="/" className="hover:text-black transition-colors">Home</Link></li>
              <li><Link to="/shops" className="hover:text-black transition-colors">Shops</Link></li>
              <li><Link to="/products" className="hover:text-black transition-colors">All Products</Link></li>
              <li><Link to="/about" className="hover:text-black transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Sütun 3: Support & Policy */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-6">Customer Care</h4>
            <ul className="flex flex-col gap-4 text-gray-500 text-sm font-medium">
              <li><Link to="/contact" className="hover:text-black transition-colors">Contact</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-black transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-black transition-colors">Terms of Services</Link></li>
              <li><Link to="/faq" className="hover:text-black transition-colors">FAQs</Link></li>
            </ul>
          </div>

          {/* Sütun 4: Ödəniş və Əlaqə */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-6">Secure Payment</h4>
            <div className="flex flex-wrap items-center justify-center gap-4 mb-6 opacity-80">
              <img src={img1} alt="Visa" className="h-6 grayscale hover:grayscale-0 transition-all cursor-pointer" />
              <img src={img2} alt="Mastercard" className="h-6 grayscale hover:grayscale-0 transition-all cursor-pointer" />
              <img src={img4} alt="Kapital Bank" className="h-6 grayscale hover:grayscale-0 transition-all cursor-pointer" />
            </div>
            <div className="text-gray-500 text-sm italic">
              <p>Email: support@mparfum.com</p>
              <p>Phone: +994 (55) 000 00 00</p>
            </div>
          </div>

        </div>

        {/* Alt Hissə: Copyright */}
        <div className="border-t border-gray-100 pt-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-xs text-gray-400 font-medium tracking-widest uppercase">
            © {currentYear} MI PARFUM. Crafted with passion.
          </span>
          <div className="flex gap-6 text-[10px] font-bold text-gray-300 uppercase tracking-[2px]">
            <span>Handmade Quality</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;