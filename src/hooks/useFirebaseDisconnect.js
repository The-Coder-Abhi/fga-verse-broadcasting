import { useEffect } from 'react';
import { goOnline, goOffline } from 'firebase/database';

const useFirebaseDisconnect = (db) => {
  // ==========================================
    // THE AUTO-DISCONNECT ENGINE
    // ==========================================
    useEffect(() => {
        // in case db isn't initialized yet
        if (!db) return;

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
    }, [db]); 
}

export default useFirebaseDisconnect
