import { useState,useEffect, useLayoutEffect, useRef } from 'react';
import { db } from './firebase';
import { ref as dbRef ,onValue, goOffline, goOnline } from 'firebase/database';
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
  const [showSplash, setShowSplash] = useState(true);
  
  const [presentation,setPresentation] = useState({
    title: "Connecting...",
    body: "",
    type: "standby"
  });

  //setting max size
  const primaryRef = useFitText(presentation.body1, 70);
  const secondaryRef = useFitText(presentation.body2, 55);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    // Cleanup the timer if the component closes early
    return () => clearTimeout(timer);
  }, []);

  // ==========================================
  // THE AUTO-DISCONNECT ENGINE
  // ==========================================
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        
        console.log("Tab hidden: Disconnecting from Firebase!");
        goOffline(db);
      } else {
        console.log("Tab visible: Reconnecting to Firebase!");
        goOnline(db);
      }
    };

    // Tell the browser to listen for the user switching tabs
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup the listener if the component closes
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

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
      console.error("Firebase Connection/Quota Error:", error);
      setPresentation({ 
        title: "Screen Full", 
        body1: "We have reached our maximum viewer limit for today.", 
        body2: "Please try refreshing in a few minutes!", 
        type: "error" 
      });
    });

    return () => unsubscribe();

  },[]);

  if (showSplash) {
    return (
      <div className="splash-screen">
        {/* We are using the logo.svg that already exists in your React folder */}
        <img src={logo} alt="Logo" className="splash-logo" />
        <h1 className="splash-title">VerseView Broadcast</h1>
        <p className="splash-subtitle">Connecting to live feed...</p>
      </div>
    );
  }
  
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
