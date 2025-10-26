// src/hooks/useGsapFadeUp.js
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const useGsapFadeUp = ({
  delay = 0,
  yMove = 60,
  duration = 1.4,
  ease = "expo.out",
  stagger = 0,
  scrub = false,
  once = true,
  scale = 0.96,
} = {}) => {
  const ref = useRef();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const animation = gsap.fromTo(
      el,
      {
        opacity: 0,
        y: yMove,
        scale,
        filter: "blur(8px)",
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration,
        delay,
        ease,
        stagger,
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none reverse",
          scrub: scrub ? 0.5 : false,
          once,
        },
      }
    );

    return () => {
      if (animation.scrollTrigger) animation.scrollTrigger.kill();
      animation.kill();
    };
  }, [delay, yMove, duration, ease, stagger, scrub, once, scale]);

  return ref;
};
