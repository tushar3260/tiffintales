import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import ChefSignup from './ChefSignup';
import ChefLogin from './ChefLogin';
import ChefLanding from './ChefLanding';
import ChefDashboard from './ChefDashboard';
import ChefProtect from './chefProtect/chefProtect';

import ChefMenu from './chefComponents/ChefMenu';
import ChefOrders from './chefComponents/ChefOrders';
import ChefReviews from './chefComponents/ChefReviews';
import ChefMessages from './chefComponents/Chefmessages';
import ChefEarning from './chefComponents/ChefEarning';
import ChefOverview from './chefComponents/ChefOverview';
import OrderChat from '../OrderChat.jsx'; // ✅ Shared OrderChat page

const ChefApp = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<ChefLanding />} />
      <Route
        path="/login"
        element={
          <div className="relative">
            <ChefLanding disableButtons />
            <div className="absolute inset-0 bg-black/30 backdrop-blur-md" />
            <ChefLogin />
          </div>
        }
      />
      <Route
        path="/signup"
        element={
          <div className="relative">
            <ChefLanding disableButtons />
            <div className="absolute inset-0 bg-black/30 backdrop-blur-md" />
            <ChefSignup />
          </div>
        }
      />

      {/* Protected Dashboard Layout Route */}
      <Route
        path="/chefdashboard"
        element={
          <ChefProtect>
            <ChefDashboard />
          </ChefProtect>
        }
      >
        <Route index element={<ChefOverview />} />
        <Route path="menu" element={<ChefMenu />} />
        <Route path="orders" element={<ChefOrders />} />
        <Route path="messages" element={<ChefMessages />} />
        <Route path="reviews" element={<ChefReviews />} />
        <Route path="earnings" element={<ChefEarning />} />
      </Route>

      {/* ✅ Chef Chat Route — outside dashboard layout so it fills full screen */}
      <Route
        path="/chat/:orderId"
        element={
          <ChefProtect>
            <OrderChat isChef={true} />
          </ChefProtect>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default ChefApp;
