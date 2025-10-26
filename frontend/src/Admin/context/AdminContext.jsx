import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../../utils/Storage';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [adminToken, setAdminToken] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state to avoid flash

  // ✅ Load data from storage (handles async)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedAdmin = await storage.getItem('adminData');
        const storedToken = await storage.getItem('adminToken');
        if (storedAdmin) setAdmin(storedAdmin);
        if (storedToken) setAdminToken(storedToken);
      } catch (error) {
        console.error("Failed to load admin data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ✅ Keep storage in sync
  useEffect(() => {
    if (admin) storage.setItem('adminData', admin);
    else storage.removeItem('adminData');

    if (adminToken) storage.setItem('adminToken', adminToken);
    else storage.removeItem('adminToken');
  }, [admin, adminToken]);

  // Optional: Show loading placeholder
  if (loading) return null;

  return (
    <AdminContext.Provider value={{ admin, setAdmin, adminToken, setAdminToken }}>
      {children}
    </AdminContext.Provider>
  );
};

// ✅ Custom hook for accessing admin context
export const useAdmin = () => useContext(AdminContext);

export default AdminContext;
