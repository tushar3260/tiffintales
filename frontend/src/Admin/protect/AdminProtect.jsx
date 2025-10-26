import { useContext, useEffect, useState, useRef } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import AdminContext from "../context/AdminContext";
import { storage } from "../../utils/Storage";
const AdminProtect = ({ children }) => {
  const { admin, adminToken } = useContext(AdminContext);

  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const toastShownRef = useRef(false);

  useEffect(() => {
    const checkAuth = async () => {
      await new Promise((res) => setTimeout(res, 300)); // lil animation buffer

      const storedAdmin = storage.getItem("AdminData");
      const storedToken = storage.getItem("AdminToken");

      const role = admin?.role || storedAdmin?.role || null;

      if (!storedToken || role !== "admin") {
        if (!toastShownRef.current) {
          toast.error("⛔ Admin access denied. Please login first.");
          toastShownRef.current = true;
        }
        setRedirect(true);
      } else {
        setAuthenticated(true);
      }

      setChecking(false);
    };

    checkAuth();
  }, [adminToken]); // Only re-run if token changes

  if (checking || (!admin && !storage.getItem("AdminData"))) {
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

  if (redirect) {
    return <Navigate to="/admin/secure/tales/login" replace />;
  }

  return children;
};

export default AdminProtect;
