import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLogin from './AdminLogin.jsx';
import AdminSignup from './AdminSignup.jsx';
import AdminDashboard from './AdminDashboard.jsx';
import AdminAllUsers from './admincomponents/AdminAllusers.jsx';
import AdminAllChefs from './admincomponents/AdminAllchef.jsx';
import AdminAllOrders from './admincomponents/AdminAllorder.jsx';
import CreateDiscount from './admincomponents/CreateDiscount.jsx'; // ✅ Import your discount page
import { AdminProvider } from './context/AdminContext.jsx';
import AdminProtect from "./protect/AdminProtect.jsx"

function AdminApp() {
  return (
    <AdminProvider>
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/" element={<AdminSignup />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <AdminProtect>
              <AdminDashboard />
            </AdminProtect>
          }
        />
        <Route
          path="/users"
          element={
            <AdminProtect>
              <AdminAllUsers />
            </AdminProtect>
          }
        />
        <Route
          path="/chefs"
          element={
            <AdminProtect>
              <AdminAllChefs />
            </AdminProtect>
          }
        />
        <Route
          path="/orders"
          element={
            <AdminProtect>
              <AdminAllOrders />
            </AdminProtect>
          }
        />

        {/* ✅ New Discount Route */}
        <Route
          path="/discounts"
          element={
            <AdminProtect>
              <CreateDiscount />
            </AdminProtect>
          }
        />
      </Routes>
    </AdminProvider>
  );
}

export default AdminApp;
