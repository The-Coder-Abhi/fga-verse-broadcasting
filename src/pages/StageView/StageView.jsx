import { useState,useEffect} from 'react';
import { db } from '../../services/firebase';
import { ref as dbRef ,onValue } from 'firebase/database';
import './StageView.css';
import Footer from '../../component/Footer/Footer';
import useFitText from '../../hooks/useFitText';
import useFirebaseDisconnect from '../../hooks/useFirebaseDisconnect';
import Splash from '../../component/Splash/Splash';

const StageView = () => {
    const [presentation,setPresentation] = useState({
    title: "Connecting...",
    body: "",
    type: "standby"
  });

  //setting max size for useFitText Hook
  const primaryRef = useFitText(presentation.body1, 70);
  const secondaryRef = useFitText(presentation.body2, 55);
  

  // THE AUTO-DISCONNECTION
  useFirebaseDisconnect(db)


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

  return (
    <div>
    <Splash/>
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
  </div>
  )
}

export default StageView
