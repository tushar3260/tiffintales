// utils/tokenManager.js
import { storage } from './Storage';
import { toast } from 'react-hot-toast';

export const setupTokenExpiry = (setAdmin, setAdminToken) => {
  const checkTokenExpiry = async () => {
    const token = await storage.getItem('AdminToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        
        if (payload.exp < currentTime) {
          // Token expired
          storage.removeItem('AdminToken');
          storage.removeItem('AdminData');
          setAdmin(null);
          setAdminToken(null);
          toast.error('Session expired. Please login again.');
          window.location.href = '/admin/secure/tales/login';
        }
      } catch (error) {
        console.error('Token validation error:', error);
      }
    }
  };

  // Check every 5 minutes
  return setInterval(checkTokenExpiry, 5 * 60 * 1000);
};
