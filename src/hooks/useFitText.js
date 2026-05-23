import { useEffect, useRef } from 'react';

//? ==========================================
//? THE CUSTOM AUTO-SCALING HOOK
//? ==========================================
const useFitText = (text, maxFontSize) => {
  const textRef = useRef(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    const resizeText = () => {
      // 1. Hide the text while we do the math
      el.style.opacity = 0; 
      el.style.fontSize = `${maxFontSize}px`;

      // 2. Wait 10ms for CSS Flexbox to physically draw the 50/50 split
      setTimeout(() => {
        let currentSize = maxFontSize;
        const minSize = 16;

        // 3. Measure against both height AND width to prevent edge-cramping
        while (
          (el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth) 
          && currentSize > minSize
        ) {
          currentSize -= 1;
          el.style.fontSize = `${currentSize}px`;
        }

        // 4. Show the perfectly sized text!
        el.style.opacity = 1;
      }, 10); 
    };

    // Run when text changes, AND if the user resizes the browser window
    resizeText();
    window.addEventListener('resize', resizeText);
    
    return () => window.removeEventListener('resize', resizeText);
  }, [text, maxFontSize]);

  return textRef;
};

export default useFitText