import { createContext, useContext, useEffect, useRef, useState } from "react";
import Lenis from "@studio-freight/lenis";

// ✅ Create Context
const SmoothScrollContext = createContext(null);

// ✅ Hook for easy usage
export const useSmoothScroll = () => useContext(SmoothScrollContext);

const SmoothScrollProvider = ({ children }) => {
  const lenisRef = useRef(null);
  const [scrollDirection, setScrollDirection] = useState("down");

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.6, // buttery smooth
      easing: (t) => 1 - Math.pow(1 - t, 4), // premium easing
      smoothWheel: true,
      smoothTouch: false,
      touchMultiplier: 6,
    });

    lenisRef.current = lenis;
    let lastScroll = 0;

    // ✅ RAF Loop
    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    // ✅ Track scroll direction
    lenis.on("scroll", ({ scroll }) => {
      setScrollDirection(scroll > lastScroll ? "down" : "up");
      lastScroll = scroll;
    });

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  // ✅ Smooth scroll to any element
  const scrollTo = (target) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, { duration: 1.2 });
    }
  };

  return (
    <SmoothScrollContext.Provider value={{ scrollTo, scrollDirection }}>
      {children}
    </SmoothScrollContext.Provider>
  );
};

export default SmoothScrollProvider;
