import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import AdminContext from "../context/AdminContext";
import { storage } from "../../utils/Storage";

const AdminProtect = ({ children }) => {
  const { admin, adminToken, loading } = useContext(AdminContext);
  const [isChecking, setIsChecking] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Wait for context loading to complete
        if (loading) return;

        // Check if admin is authenticated and has admin role
        const hasValidToken = adminToken || await storage.getItem('AdminToken');
        const adminData = admin || await storage.getItem('AdminData');
        
        if (!hasValidToken || !adminData) {
          toast.error("⛔ Admin access denied. Please login first.");
          setShouldRedirect(true);
          return;
        }

        // Check if user has admin role
        if (adminData.role !== 'admin') {
          toast.error("⛔ Insufficient privileges. Admin access required.");
          setShouldRedirect(true);
          return;
        }

        // Optional: Verify token with backend
        const response = await fetch(`${import.meta.env.VITE_API_URL}/admins/verify`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${hasValidToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          toast.error("⛔ Session expired. Please login again.");
          // Clear invalid tokens
          storage.removeItem('AdminToken');
          storage.removeItem('AdminData');
          setShouldRedirect(true);
          return;
        }

      } catch (error) {
        console.error("Authentication check failed:", error);
        toast.error("⛔ Authentication error. Please login again.");
        setShouldRedirect(true);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuthentication();
  }, [admin, adminToken, loading]);

  // Show loading while context is loading or checking auth
  if (loading || isChecking) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#fff8ee] backdrop-blur-sm">
        <div className="flex flex-col justify-center items-center bg-white bg-opacity-80 p-8 rounded-xl shadow-2xl animate-fadeIn">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-dashed border-[#dc2626] rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-4 border-solid border-white rounded-full"></div>
          </div>
          <p className="mt-4 text-[#dc2626] font-semibold animate-pulse text-lg">
            Verifying Admin Credentials...
          </p>
        </div>
      </div>
    );
  }

  // Redirect to login if authentication failed
  if (shouldRedirect) {
    return <Navigate to="/admin/secure/tales/login" replace />;
  }

  return children;
};

export default AdminProtect;
