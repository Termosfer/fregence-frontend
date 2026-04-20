import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout/Layout";
import AdminLayout from "./pages/Admin/AdminLayout";
import DashboardOverview from "./pages/Admin/DashboardOverview"; // Bu səhifəni yaratmalısan
import AdminProducts from "./pages/Admin/AdminProducts"; // Bu səhifəni yaratmalısan
import AdminOrders from "./pages/Admin/AdminOrders";
import AdminMessages from "./pages/Admin/AdminMessages";
import AdminSubscribers from "./pages/Admin/AdminSubscribers";
import AdminUsers from "./pages/Admin/AdminUsers";

function App() {
  const userRole = localStorage.getItem("role");
  const isAdmin = userRole === "ADMIN";

  return (
    <BrowserRouter>
      <Routes>
        {/* 1. ADMIN YOLLARI (Header və Footer BURADA YOXDUR) */}
        {isAdmin ? (
          <Route path="/admin/*" element={<AdminLayout />}>
             <Route index element={<DashboardOverview />} />
             <Route path="products" element={<AdminProducts />} />
             <Route path="orders" element={<AdminOrders />} />
             <Route path="contacts" element={<AdminMessages />} />
             <Route path="subscribers" element={<AdminSubscribers />} />
             <Route path="users" element={<AdminUsers />} />
             {/* Digər admin səhifələrini buraya əlavə edəcəksən */}
          </Route>
        ) : (
          /* Admin deyilsə və /admin-ə girməyə çalışırsa ana səhifəyə at */
          <Route path="/admin/*" element={<Navigate to="/" replace />} />
        )}

        {/* 2. MAĞAZA YOLLARI (Header və Footer BURADADIR) */}
        <Route path="/*" element={<Layout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;