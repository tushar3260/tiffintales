import { createContext, useContext } from "react";

// Context
const SmoothScrollContext = createContext(null);

// Hook
export const useSmoothScroll = () => useContext(SmoothScrollContext);

const SmoothScrollProvider = ({ children }) => {
  // Native scroll – zero lag
  const scrollTo = (target) => {
    const el =
      typeof target === "string"
        ? document.querySelector(target)
        : target;

    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <SmoothScrollContext.Provider
      value={{ scrollTo, scrollDirection: "down" }}
    >
      {children}
    </SmoothScrollContext.Provider>
  );
};

export default SmoothScrollProvider;
