import { useEffect, useRef } from 'react';

export const useScrollReveal = (threshold = 0.15) => {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // only trigger once
          }
        });
      },
      { threshold }
    );

    // Observe the element and all children with reveal classes
    const revealEls = element.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    revealEls.forEach(el => observer.observe(el));

    // Also observe the element itself if it has reveal class
    if (element.classList.contains('reveal') || 
        element.classList.contains('reveal-left') || 
        element.classList.contains('reveal-right')) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return ref;
};

export default useScrollReveal;
