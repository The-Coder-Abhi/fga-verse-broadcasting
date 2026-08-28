import { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import { ref as dbRef, onValue } from 'firebase/database';
import OBSWebSocket from 'obs-websocket-js';
import '../StageView/StageView.css'; // Reusing existing styles
import Footer from '../../component/Footer/Footer';
import useFitText from '../../hooks/useFitText';
import useFirebaseDisconnect from '../../hooks/useFirebaseDisconnect';
import Splash from '../../component/Splash/Splash';

// Initialize OBS WebSocket outside the component
const obs = new OBSWebSocket();

const SplitStageView = ({ themeClass = "" }) => {
  const [presentation, setPresentation] = useState({
    title: "Connecting...",
    body: "",
    type: "standby"
  });
  
  const [obsConnected, setObsConnected] = useState(false);

  const isBlank = presentation.body1 === "Blank";
  const isSong = presentation.title === "Live Worship";
  console.log(presentation.title);
  
  const primaryRef = useFitText(presentation.body1, 120);
  const secondaryRef = useFitText(presentation.body2, 105);
  
  useFirebaseDisconnect(db);

  // 1. CONNECT TO OBS WEBSOCKET
  useEffect(() => {
    const connectOBS = async () => {
      try {
        await obs.connect('ws://localhost:4455', 'Abhi2003');
        console.log("SplitStageView connected to OBS WebSocket");
        setObsConnected(true);
      } catch (error) {
        console.error("Failed to connect to OBS", error);
      }
    };
    
    connectOBS();

    return () => {
      obs.disconnect();
    };
  }, []);

  // 2. TRIGGER OBS SCENE CHANGE
  useEffect(() => {
    const switchScene = async () => {
      if (!obsConnected) return; 
      
      try {
        if (isBlank) {
          await obs.call('SetCurrentProgramScene', { sceneName: 'Main DSLR' });
        } else if (isSong) {
          await obs.call('SetCurrentProgramScene', { sceneName: 'Song View' });
        }else {
          await obs.call('SetCurrentProgramScene', { sceneName: 'Verse View' });
        }
      } catch (error) {
        console.error("Scene switch failed", error);
      }
    };

    switchScene();
  }, [isBlank, isSong, obsConnected]);

  // 3. FIREBASE CONNECTION 
  useEffect(() => {
    const presentationRef = dbRef(db, 'live_presentation');
    
    const unsubscribe = onValue(presentationRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
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

  return (
    <div>
      <Splash/>
      <div className={`presentation-wrapper ${presentation.type} ${themeClass} ${isBlank ? 'Blank' : ''}`}>
        <h2 className="verse-title">{presentation.title}</h2>
        <div className="content-wrapper">
          <div className="verse-body">
            <div ref={primaryRef} className="text-fit-box primary-language">
              {isBlank || presentation.body1 === "Blank" ? "" : presentation.body1}
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
        {!isBlank && !isSong ? <Footer/> : null}
      </div>
    </div>
  );
}

export default SplitStageView;