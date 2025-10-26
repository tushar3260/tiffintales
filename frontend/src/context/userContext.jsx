import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/Storage';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedUser = await storage.getItem('userData');
        // console.log("stored user :",storedUser)
        const storedToken = await storage.getItem('usertoken');
        setUser(storedUser || null);
        setToken(storedToken || null);
      } catch (err) {
        // console.error("Failed to load user data", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Save data whenever user/token changes
  useEffect(() => {
    const saveData = async () => {
      try {
        if (user) await storage.setItem('userData', user);
        else await storage.removeItem('userData');

        if (token) await storage.setItem('usertoken', token);
        else await storage.removeItem('usertoken');
      } catch (err) {
        // console.error("Failed to save user data", err);
      }
    };
    saveData();
  }, [user, token]);

  return (
    <UserContext.Provider value={{ user, setUser, token, setToken, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
export default UserContext;
