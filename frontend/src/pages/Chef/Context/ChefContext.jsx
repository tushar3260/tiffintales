import { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../../../utils/Storage';

const ChefContext = createContext();

export const ChefProvider = ({ children }) => {
  const [chef, setChef] = useState(null);
  const [chefToken, setChefToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedChef = await storage.getItem('chefData');
        const storedToken = await storage.getItem('chefToken');
        if (storedChef) setChef(storedChef);
        if (storedToken) setChefToken(storedToken);
      } catch {
        // silent — storage may not be available
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-orange-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-orange-600 font-semibold">Loading chef session...</p>
      </div>
    </div>
  );

  return (
    <ChefContext.Provider value={{ chef, setChef, chefToken, setChefToken }}>
      {children}
    </ChefContext.Provider>
  );
};

export const useChef = () => {
  const context = useContext(ChefContext);
  if (!context) {
    throw new Error('useChef must be used within a ChefProvider');
  }
  return context;
};

export default ChefContext;
