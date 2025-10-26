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
      } catch (err) {
        console.error('Failed to load chef data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return null; // Optional: Add a loader here

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
