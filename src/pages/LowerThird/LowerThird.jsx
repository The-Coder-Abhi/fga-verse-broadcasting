import { useState, useEffect } from 'react';
import { db } from '../../services/firebase'; 
import { ref as dbRef, onValue } from 'firebase/database';
import useFitText from '../../hooks/useFitText';
import useFirebaseDisconnect from '../../hooks/useFirebaseDisconnect';
import './LowerThird.css'

const LowerThird = () => {
  
  const [presentation, setPresentation] = useState({
    title: "",
    body1: ""
  });

  const textRef = useFitText(presentation.body1, 45);

  useFirebaseDisconnect(db);

  useEffect(() =>{
    const presentationRef = dbRef(db, 'live_presentation');

    const unsubscribe = onValue(presentationRef, (snapshot)=>{
      const data = snapshot.val();
      if(data){
        setPresentation({
          title: data.title || "",
          body1: data.body1 || ""
        });
      }
    },(error) =>{
      console.error("Firebase Connection Error:", error);
    });

    return () => unsubscribe();

  },[]);

  useEffect(() => {
    // When the component loads, add the transparent class to the body
    document.body.classList.add('transparent-broadcast');

    // When the component unmounts (you switch pages), remove the class
    return () => {
      document.body.classList.remove('transparent-broadcast');
    };
  }, []);

  if (!presentation.body1) {
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
          {presentation.body1}
        </div>

      </div>
    </div>
  )
}

export default LowerThird
