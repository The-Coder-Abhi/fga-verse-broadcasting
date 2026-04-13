import { useState,useEffect, useLayoutEffect, useRef } from 'react';
import { db } from './firebase';
import { ref as dbRef ,onValue } from 'firebase/database';
import logo from './logo.svg';
import './App.css';
import Footer from './Footer';


// ==========================================
// THE CUSTOM AUTO-SCALING HOOK
// ==========================================
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

function App() {
  
  const [presentation,setPresentation] = useState({
    title: "Connecting...",
    body: "",
    type: "standby"
  });

  //setting max size
  const primaryRef = useFitText(presentation.body1, 70);
  const secondaryRef = useFitText(presentation.body2, 55);
  
  useEffect(() => {
    const presentationRef = dbRef(db,'live_presentation');
    
    const unsubscribe = onValue(presentationRef, (snapshot) => {
      const data = snapshot.val();
      if(data){
        setPresentation({
          title: data.title || "",
          body1: data.body1 || "",
          body2: data.body2 || "",
          type: data.type || "live"
        });
      }
    },(error) => {
      console.error("Firebase Read Error:",error);
      setPresentation({ title: "Connection Error", body1: "Please refresh the page.", body2:"", type: "error" });
    });

    return () => unsubscribe();

  },[]);
  
  return (
    <div className={`presentation-wrapper ${presentation.type}`}>
        <h2 className="verse-title">{presentation.title}</h2>
      <div className="content-wrapper">
        <div className="verse-body">
          <div ref={primaryRef} className="text-fit-box primary-language">
            {presentation.body1}
          </div>
        </div>
        {presentation.body2 && (
        <div className="verse-body">
          <div ref={secondaryRef} className="text-fit-box secondary-language">
            {presentation.body2}
          </div>
        </div>
      )}
      </div>
      <Footer/>
    </div>
  );
}

export default App;
