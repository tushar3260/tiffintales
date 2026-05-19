import { useContext, useEffect, useState, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import ChefContext from '../Context/ChefContext';
import { toast } from 'react-hot-toast';
import { storage } from '../../../utils/Storage';

const ChefProtect = ({ children }) => {
  const { chef, chefToken } = useContext(ChefContext);
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const toastShownRef = useRef(false);

  useEffect(() => {
    const checkAuth = async () => {
      await new Promise((res) => setTimeout(res, 200));

      // ✅ Support both sync and async storage
      let storedToken = storage.getItem('chefToken');
      let storedChef = storage.getItem('chefData');

      // Handle promise-based storage
      if (storedToken instanceof Promise) storedToken = await storedToken;
      if (storedChef instanceof Promise) storedChef = await storedChef;

      // ✅ Check token from context OR localStorage
      const hasToken = chefToken || storedToken;
      // ✅ Allow if token exists (don't require specific role field — some chef docs may not have it)
      if (!hasToken) {
        if (!toastShownRef.current) {
          toast.error('🚫 Please login to access the chef dashboard.');
          toastShownRef.current = true;
        }
        setRedirect(true);
      } else {
        setAuthenticated(true);
      }

      setChecking(false);
    };

    checkAuth();
  }, [chef, chefToken]);

  if (checking) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-orange-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-orange-600 font-semibold text-lg">Verifying chef session...</p>
        </div>
      </div>
    );
  }

  if (redirect) {
    return <Navigate to="/chef/login" replace />;
  }

  return children;
};

export default ChefProtect;
