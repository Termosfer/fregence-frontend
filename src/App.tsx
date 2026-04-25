import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout/Layout";
import AdminLayout from "./pages/Admin/AdminLayout";
import DashboardOverview from "./pages/Admin/DashboardOverview";
import AdminProducts from "./pages/Admin/AdminProducts";
import AdminRoute from "./Router/AdminRoute";

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
           {/* Digər admin səhifələri... */}
        </Route>

        {/* 2. MAĞAZA YOLLARI */}
        <Route path="/*" element={<Layout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;