import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../../utils/Storage';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [adminToken, setAdminToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Load data from storage (handles async)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ Use consistent storage keys
        const storedAdmin = await storage.getItem('AdminData');
        const storedToken = await storage.getItem('AdminToken');
        
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

  // ✅ Keep storage in sync - only update when values actually change
  useEffect(() => {
    if (!loading) { // Don't save during initial load
      if (admin) {
        storage.setItem('AdminData', admin);
      } else {
        storage.removeItem('AdminData');
      }
    }
  }, [admin, loading]);

  useEffect(() => {
    if (!loading) { // Don't save during initial load
      if (adminToken) {
        storage.setItem('AdminToken', adminToken);
      } else {
        storage.removeItem('AdminToken');
      }
    }
  }, [adminToken, loading]);

  // ✅ Show loading placeholder
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#fff8ee]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <AdminContext.Provider value={{ 
      admin, 
      setAdmin, 
      adminToken, 
      setAdminToken,
      loading 
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};

export default AdminContext;
