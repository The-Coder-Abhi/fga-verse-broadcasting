import { useState,useEffect } from 'react';
import logo from './logo.svg';

const Splash = () => {
    const [showSplash, setShowSplash] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
          setShowSplash(false);
        }, 2500);
    
        // Cleanup the timer if the component closes early
        return () => clearTimeout(timer);
      }, []);
  return (
    <div>

    {showSplash && (
        <div 
        className="splash-screen" 
        style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999 }}
        >
          <img src={logo} alt="Logo" className="splash-logo" />
          <h1 className="splash-title">VerseView Broadcast</h1>
          <p className="splash-subtitle">Connecting to live feed...</p>
        </div>
      )}
      </div>
  )
}

export default Splash
