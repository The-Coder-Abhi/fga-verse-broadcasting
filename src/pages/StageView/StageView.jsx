import { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import { ref as dbRef, onValue } from 'firebase/database';
import './StageView.css';
import Footer from '../../component/Footer/Footer';
import useFitText from '../../hooks/useFitText';
import useFirebaseDisconnect from '../../hooks/useFirebaseDisconnect';
import Splash from '../../component/Splash/Splash';

const StageView = ({ themeClass = "" }) => {
  const [presentation, setPresentation] = useState({
    title: "Connecting...",
    body: "",
    type: "standby"
  });

  const isBlank = presentation.body1 === "Blank";
  
  // Setting max size for useFitText Hook
  const primaryRef = useFitText(presentation.body1, 120);
  const secondaryRef = useFitText(presentation.body2, 105);
  
  // THE AUTO-DISCONNECTION
  useFirebaseDisconnect(db);

  useEffect(() => {
    const presentationRef = dbRef(db, 'live_presentation');
    
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
    }, (error) => {
      console.error("Firebase Connection/Quota Error:", error);
      setPresentation({ 
        title: "Screen Full", 
        body1: "We have reached our maximum viewer limit for today.", 
        body2: "Please try refreshing in a few minutes!", 
        type: "error" 
      });
    });

    return () => unsubscribe();
  }, []);

  const formatVerseText = (text) => {
    if (!text) return "";
    
    const parts = text.split(/(\*\*\*.*?\*\*\*)/g);
    
    return parts.map((part, index) => {
      // 1. Handle the yellow highlighted text
      if (part.startsWith("***") && part.endsWith("***")) {
        const innerText = part.slice(3, -3);
        return (
          <span key={index} className="highlight-yellow">
            {innerText}
          </span>
        );
      }
      
      // 2. Handle the regular text (The Fix)
      // This regex (/\s+/g) finds all multiple spaces, tabs, and hidden newlines 
      // caused by the XML <BR> tags and replaces them with a single normal space.
      let cleanText = part.replace(/\s+/g, ' ').trim();
      
      // Don't render empty spans if the text was just spaces
      if (!cleanText) return null;
      
      return <span key={index}>{cleanText}</span>;
    });
  };

  return (
    <div>
      <Splash/>
      <div className={`presentation-wrapper ${presentation.type} ${themeClass} ${isBlank ? 'Blank' : ''}`}>
          <h2 className="verse-title">{presentation.title}</h2>
        <div className="content-wrapper">
          <div className="verse-body">
            <div ref={primaryRef} className="text-fit-box primary-language">
              {/* Wrapped text in inner-text to fix flexbox text breaking */}
              <div className="inner-text">
                {isBlank || presentation.body1 === "Blank" ? "" : formatVerseText(presentation.body1)}
              </div>
            </div>
          </div>
          {presentation.body2 && (
            <div className="verse-body">
              <div ref={secondaryRef} className="text-fit-box secondary-language">
                <div className="inner-text">
                  {formatVerseText(presentation.body2)}
                </div>
              </div>
            </div>
          )}
        </div>
        {!isBlank && <Footer/>}
      </div>
    </div>
  )
}

export default StageView;