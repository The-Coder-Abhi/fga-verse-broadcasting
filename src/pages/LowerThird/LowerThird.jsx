import { useState, useEffect } from 'react';
import { db } from '../../services/firebase'; 
import { ref as dbRef, onValue } from 'firebase/database';
import useFitText from '../../hooks/useFitText';
import useFirebaseDisconnect from '../../hooks/useFirebaseDisconnect';
import './LowerThird.css'

const LowerThird = () => {
  const [versionChanger, setVersionChanger] = useState(true);
  const [presentation, setPresentation] = useState({
    title: "",
    body1: "",
    body2: "" 
  });

  // Determine which text should currently be on screen
  const currentText = versionChanger ? presentation.body1 : presentation.body2;
  
  const textRef = useFitText(currentText, 45);
  
  useFirebaseDisconnect(db);

  useEffect(() =>{
    const presentationRef = dbRef(db, 'live_presentation');
    
    const unsubscribe = onValue(presentationRef, (snapshot)=>{
      const data = snapshot.val();
      if(data){
        setPresentation({
          title: data.title || "",
          body1: data.body1 || "",
          body2: data.body2 || ""
        });
      }
    },(error) =>{
      console.error("Firebase Connection Error:", error);
    });
    
    return () => unsubscribe();
    
  },[]);

  useEffect(() => {
    // Instantly snap back to true (body1) whenever a new verse arrives
    setVersionChanger(true);

    // If there is no body2, it'll not start timer!
    if (!presentation.body2) return;

    // toggles versionChanger to switch language
    const toggleInterval = setInterval(() => {
      setVersionChanger((prev) => !prev);
    }, 3000); 

    // 4. This cleanup function destroys the timer if a new verse arrives
    return () => clearInterval(toggleInterval);
      }, [presentation.title,presentation.body1,presentation.body2]);
   
  
  
  useEffect(() => {
    // When the component loads, add the transparent class to the body
    document.body.classList.add('transparent-broadcast');
    
    // When the component unmounts (you switch pages), remove the class
    return () => {
      document.body.classList.remove('transparent-broadcast');
    };
  }, []);
  
  if (!presentation.body1) {
    if(!presentation.body2){
      return null;
    }
    return null; 
  }
  
  
  
  return (
    <div className="lower-third-wrapper">
      <div className="lower-third-graphic">
        
        {/* The Title Box */}
        {presentation.title && (
          <div className="lower-third-title-box">
            {presentation.title}
          </div>
        )}
        
        {/* The Main Verse Box */}
        <div ref={textRef} className="lower-third-text-box">
          {currentText}
        </div>
        

      </div>
    </div>
  )
}

export default LowerThird
