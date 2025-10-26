import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

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
import ChefOverview from './chefComponents/ChefOverview'; // this is the dashboard main content
// ⚠️ Create this file if not done (contains StatsCard + OrderCard like earlier)

const ChefApp = () => {
  return (
   
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<ChefLanding />} />
        <Route
  path="/login"
  element={
    <div className="relative">
      <ChefLanding disableButtons /> {/* Background Landing Page */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-md"></div> {/* Blur Layer */}
      <ChefLogin />
    </div>
  }
/>

<Route
  path="/signup"
  element={
    <div className="relative">
      <ChefLanding disableButtons /> {/* Background Landing Page */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-md"></div> {/* Blur Layer */}
      <ChefSignup />
    </div>
  }
/>


        {/* Protected Dashboard Layout Route */}
        <Route path="/chefdashboard" element={
          <ChefProtect>
            <ChefDashboard />
          </ChefProtect>
        }>
          {/* Nested Routes for Dashboard */}
          <Route index element={<ChefOverview />} />
          <Route path="menu" element={<ChefMenu />} />
          <Route path="orders" element={<ChefOrders />} />
          <Route path="messages" element={<ChefMessages />} />
          <Route path="reviews" element={<ChefReviews />} />
          <Route path="earnings" element={<ChefEarning />} />
        </Route>

        {/* Optional: Handle 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
   
  );
};

export default ChefApp;
