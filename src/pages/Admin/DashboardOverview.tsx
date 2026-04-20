import { useQuery } from "@tanstack/react-query";
import api from "../../api/axios";
import { 
  FiShoppingBag, FiUsers, FiBox, 
  FiStar, FiActivity 
} from "react-icons/fi";
import { GiReceiveMoney } from "react-icons/gi";

// Backend-dən gələn JSON-a uyğun interfeys
interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalPerfumes: number;
  totalRevenue: number;
  topSellingPerfume: string;
}

const DashboardOverview = () => {
  // 1. Real statistikanı çəkirik
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["admin-stats"],
    queryFn: () => api.get("/admin/dashboard/stats").then((res) => res.data),
  });

  const statCards = [
    { 
      label: "Total Revenue", 
      value: `${stats?.totalRevenue.toLocaleString()}.00 AZN`, 
      icon: <GiReceiveMoney />, 
      color: "text-emerald-600 bg-emerald-50" 
    },
    { 
      label: "Total Orders", 
      value: stats?.totalOrders || 0, 
      icon: <FiShoppingBag />, 
      color: "text-blue-600 bg-blue-50" 
    },
    { 
      label: "Inventory Items", 
      value: stats?.totalPerfumes || 0, 
      icon: <FiBox />, 
      color: "text-purple-600 bg-purple-50" 
    },
    { 
      label: "Registered Users", 
      value: stats?.totalUsers || 0, 
      icon: <FiUsers />, 
      color: "text-rose-600 bg-rose-50" 
    },
  ];

 if (isLoading) return <div className="py-20 text-center animate-pulse font-bold">LOADING...</div>;

  return (
    <div className="space-y-10 font-[Playfair]">
      {/* 1. ÜST BAŞLIQ */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-tighter text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-400 text-sm uppercase tracking-widest mt-1">Real-time store performance</p>
        </div>
        <div className="flex items-center gap-2 text-teal-600 bg-teal-50 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-teal-100">
           <FiActivity className="animate-pulse" /> Live System Status
        </div>
      </div>

      {/* 2. STATİSTİKA KARTLARI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-50 flex items-center gap-6 transition-all hover:shadow-xl hover:-translate-y-1 duration-300">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${stat.color} shadow-sm`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-800 tracking-tight">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* 3. ÖZƏL BÖLMƏ: TOP SELLING PERFUME */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Top Product Highlight */}
        <div className="lg:col-span-2 bg-[#0F172A] p-10 rounded-[2.5rem] text-white flex flex-col justify-between relative overflow-hidden shadow-2xl">
           <div className="relative z-10">
              <span className="bg-white/10 text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[3px] border border-white/10">
                ⭐ Top Selling Item
              </span>
              <h2 className="text-4xl font-bold mt-8 mb-4 max-w-md leading-tight tracking-tighter">
                {stats?.topSellingPerfume}
              </h2>
              <p className="text-gray-400 uppercase tracking-widest text-xs font-medium">
                The most popular fragrance in your collection this month.
              </p>
           </div>
           
           <button className="mt-10 bg-white text-black px-8 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-gray-200 transition-all w-fit relative z-10">
              View Product Details
           </button>

           {/* Dekorativ element */}
           <FiStar className="absolute -right-10 -bottom-10 text-white/5 w-64 h-64 rotate-12" />
        </div>

        {/* Quick Actions / System Health */}
        <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 flex flex-col justify-between shadow-sm">
           <h4 className="text-xs font-black uppercase tracking-[3px] text-gray-400 border-b pb-4 mb-6">Recent Reports</h4>
           <div className="space-y-6">
              <div className="flex items-center gap-4">
                 <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                 <span className="text-sm font-bold text-gray-700 uppercase tracking-tighter">Average Order: 240 AZN</span>
              </div>
              <div className="flex items-center gap-4">
                 <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                 <span className="text-sm font-bold text-gray-700 uppercase tracking-tighter">Customer Growth: +12%</span>
              </div>
              <div className="flex items-center gap-4">
                 <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                 <span className="text-sm font-bold text-gray-700 uppercase tracking-tighter">Conversion Rate: 3.4%</span>
              </div>
           </div>
           <div className="mt-10 pt-6 border-t border-gray-50 flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Database Sync</span>
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Stable</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;