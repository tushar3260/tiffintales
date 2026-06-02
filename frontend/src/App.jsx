import React, { lazy, Suspense, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";
import { UserProvider } from "./context/userContext.jsx";
import CartProvider from "./context/CartContext.jsx";
import { ChefProvider } from "./pages/Chef/Context/ChefContext.jsx";
import { AdminProvider } from "./Admin/context/AdminContext.jsx";
import UserProtect from "./ProtectWrapper/UserProtect.jsx";

// ── Eagerly loaded (first paint critical) ──
import LandingPage from "./pages/LandingPage.jsx";

// ── Lazily loaded (split into separate bundles) ──
const Login              = lazy(() => import("./pages/LoginPage.jsx"));
const Signup             = lazy(() => import("./pages/SignupPage.jsx"));
const Dashboard          = lazy(() => import("./pages/DashBoard.jsx"));
const Cart               = lazy(() => import("./pages/Cart.jsx"));
const Allchef            = lazy(() => import("./pages/Allchef.jsx"));
const AllMeals           = lazy(() => import("./pages/AllMeals"));
const ChefDetail         = lazy(() => import("./pages/Chef/ChefDetail.jsx"));
const AddLocation        = lazy(() => import("./pages/AddLocation.jsx"));
const OTPPage            = lazy(() => import("./pages/OTPPage.jsx"));
const ResetPassword      = lazy(() => import("./pages/ResetPassword.jsx"));
const ForgotPassword     = lazy(() => import("./pages/ForgotPassword.jsx"));
const Checkout           = lazy(() => import("./pages/Checkout.jsx"));
const OrderNowPage       = lazy(() => import("./components/OrderNowPage.jsx"));
const ProfilePage        = lazy(() => import("./pages/ProfilePage.jsx"));
const MyOrderPage        = lazy(() => import("./pages/MyOrderPage.jsx"));
const OrderChat          = lazy(() => import("./pages/OrderChat.jsx"));
const GalleryPage        = lazy(() => import("./pages/GalleryPage.jsx"));
const Subscription       = lazy(() => import("./pages/Subscription.jsx"));
const Aboutus            = lazy(() => import("./pages/Aboutus.jsx"));
const Team               = lazy(() => import("./pages/Team.jsx"));
const Helpandsupport     = lazy(() => import("./pages/Helpandsupport.jsx"));
const Termcondition      = lazy(() => import("./pages/Termcondition.jsx"));
const Refundcancellation = lazy(() => import("./pages/Refundcancellation.jsx"));
const PrivacyPolicy      = lazy(() => import("./pages/PrivacyPolicy.jsx"));
const ContactUs          = lazy(() => import("./pages/ContactUs.jsx"));
const Disclaimer         = lazy(() => import("./pages/Disclaimer.jsx"));
const Blog               = lazy(() => import("./pages/Blog.jsx"));
const BlogPost           = lazy(() => import("./pages/BlogPost.jsx"));

// Dashboard sub-pages
const DashboardLayout  = lazy(() => import("./components/Dashcomponents/DashboardLayout.jsx"));
const OrderSummary     = lazy(() => import("./components/Dashcomponents/OrderSummary.jsx"));
const Charts           = lazy(() => import("./components/Dashcomponents/Charts.jsx"));
const Tracker          = lazy(() => import("./components/Dashcomponents/Tracker.jsx"));
const SubscriptionPage = lazy(() => import("./components/Dashcomponents/SubscriptionPage.jsx"));
const Wallet           = lazy(() => import("./components/Dashcomponents/Wallet.jsx"));
const ReferAndEarn     = lazy(() => import("./components/Dashcomponents/ReferAndEarnPage.jsx"));
const Support          = lazy(() => import("./components/Dashcomponents/Support.jsx"));
const Settings         = lazy(() => import("./components/Dashcomponents/Setting.jsx"));
const UpcomingMeals    = lazy(() => import("./components/Dashcomponents/UpcomingMeals.jsx"));

// Heavy sections
const ChefApp  = lazy(() => import("./pages/Chef/ChefApp.jsx"));
const AdminApp = lazy(() => import("./Admin/AdminApp.jsx"));

// ── Global route-level loading spinner ──
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-orange-500 text-sm font-semibold tracking-wide animate-pulse">
        Loading...
      </p>
    </div>
  </div>
);

function App() {
  const [showLogin, setShowLogin]   = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />

      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <UserProvider>
          <CartProvider>
            <BrowserRouter>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* ── Landing Page (eager) ── */}
                  <Route
                    path="/"
                    element={
                      <>
                        <LandingPage
                          onLoginClick={() => setShowLogin(true)}
                          onSignupClick={() => setShowSignup(true)}
                        />
                        {showLogin && (
                          <Login
                            onClose={() => setShowLogin(false)}
                            onSignupClick={() => {
                              setShowLogin(false);
                              setShowSignup(true);
                            }}
                          />
                        )}
                        {showSignup && (
                          <Signup
                            onClose={() => setShowSignup(false)}
                            onLoginClick={() => {
                              setShowSignup(false);
                              setShowLogin(true);
                            }}
                          />
                        )}
                      </>
                    }
                  />

                  <Route
                    path="/login"
                    element={
                      <div className="relative">
                        <LandingPage disableButtons />
                        <div className="absolute inset-0 bg-black/30 backdrop-blur-md" />
                        <Login />
                      </div>
                    }
                  />

                  <Route
                    path="/signup"
                    element={
                      <div className="relative">
                        <LandingPage disableButtons />
                        <div className="absolute inset-0 bg-black/30 backdrop-blur-md" />
                        <Signup />
                      </div>
                    }
                  />

                  {/* ── Public routes ── */}
                  <Route path="/cart"                  element={<Cart />} />
                  <Route path="/allchef"               element={<Allchef />} />
                  <Route path="/addlocation"           element={<AddLocation />} />
                  <Route path="/otp"                   element={<OTPPage />} />
                  <Route path="/forgot-password"       element={<ForgotPassword />} />
                  <Route path="/reset-password/:token" element={<ResetPassword />} />
                  <Route path="/meals"                 element={<AllMeals />} />
                  <Route path="/chef-detail/:id"       element={<ChefDetail />} />
                  <Route path="/checkout"              element={<Checkout />} />
                  <Route path="/orders"                element={<MyOrderPage />} />
                  <Route path="/aboutus"               element={<Aboutus />} />
                  <Route path="/team"                  element={<Team />} />
                  <Route path="/help"                  element={<Helpandsupport />} />
                  <Route path="/terms"                 element={<Termcondition />} />
                  <Route path="/privacy"               element={<PrivacyPolicy />} />
                  <Route path="/refund"                element={<Refundcancellation />} />
                  <Route path="/gallery"               element={<GalleryPage />} />
                  <Route path="/blog"                  element={<Blog />} />
                  <Route path="/blog/:slug"            element={<BlogPost />} />
                  <Route path="/contact"               element={<ContactUs />} />
                  <Route path="/disclaimer"            element={<Disclaimer />} />
                  <Route path="/subscribe"             element={<Subscription />} />
                  <Route path="/careers"               element={<Team />} />
                  <Route path="/profile"               element={<ProfilePage />} />

                  {/* ── Protected: Order Now ── */}
                  <Route
                    path="/order-now/:id"
                    element={
                      <UserProtect>
                        <OrderNowPage />
                      </UserProtect>
                    }
                  />

                  {/* ── Subscription shortcut ── */}
                  <Route
                    path="/subscription"
                    element={
                      <UserProtect>
                        <DashboardLayout />
                      </UserProtect>
                    }
                  >
                    <Route index element={<SubscriptionPage />} />
                  </Route>

                  {/* ── Protected Dashboard ── */}
                  <Route
                    path="/dashboard/*"
                    element={
                      <UserProtect>
                        <DashboardLayout />
                      </UserProtect>
                    }
                  >
                    <Route index               element={<Dashboard />} />
                    <Route path="orders"       element={<OrderSummary />} />
                    <Route path="chat/:orderId" element={<OrderChat isChef={false} />} />
                    <Route path="tracker"      element={<Tracker />} />
                    <Route path="charts"       element={<Charts />} />
                    <Route path="subscription" element={<SubscriptionPage />} />
                    <Route path="wallet"       element={<Wallet />} />
                    <Route path="refer"        element={<ReferAndEarn />} />
                    <Route path="support"      element={<Support />} />
                    <Route path="settings"     element={<Settings />} />
                    <Route path="upcoming"     element={<UpcomingMeals />} />
                  </Route>

                  {/* ── Chef section ── */}
                  <Route
                    path="/chef/*"
                    element={
                      <ChefProvider>
                        <ChefApp />
                      </ChefProvider>
                    }
                  />

                  {/* ── Admin section ── */}
                  <Route
                    path="/admin/secure/tales/*"
                    element={
                      <AdminProvider>
                        <AdminApp />
                      </AdminProvider>
                    }
                  />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </CartProvider>
        </UserProvider>
      </GoogleOAuthProvider>
    </div>
  );
}

export default App;
