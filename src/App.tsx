import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout/Layout";
import AdminLayout from "./pages/Admin/AdminLayout";
import DashboardOverview from "./pages/Admin/DashboardOverview";
import AdminProducts from "./pages/Admin/AdminProducts";
import AdminRoute from "./Router/AdminRoute";
import AdminOrders from "./pages/Admin/AdminOrders";
import AdminMessages from "./pages/Admin/AdminMessages";
import AdminSubscribers from "./pages/Admin/AdminSubscribers";
import AdminUsers from "./pages/Admin/AdminUsers";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. ADMIN YOLLARI - AdminRoute ilə qorunur */}
        <Route 
          path="/admin/*" 
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          } 
        >
           <Route index element={<DashboardOverview />} />
           <Route path="products" element={<AdminProducts />} />
           <Route path="orders" element={<AdminOrders/>} />
           <Route path="contacts" element={<AdminMessages/>} />
           <Route path="contacts" element={<AdminMessages/>} />
           <Route path="subscribers" element={<AdminSubscribers/>} />
           <Route path="users" element={<AdminUsers/>} />
           {/* Digər admin səhifələri... */}
        </Route>

        {/* 2. MAĞAZA YOLLARI */}
        <Route path="/*" element={<Layout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;