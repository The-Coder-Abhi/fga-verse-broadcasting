import { useEffect, useState } from 'react';
import OBSWebSocket from 'obs-websocket-js';

// Initialize OBS instance outside the component
const obs = new OBSWebSocket();
const TARGET_SCENE = "Song View";

export default function ObsSourceToggler() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const connectToObs = async () => {
      try {
        // Replace 'YOUR_PASSWORD' with your actual OBS WebSocket password
        await obs.connect('ws://localhost:4455', 'Abhi2003');
        setConnected(true);
      } catch (error) {
        console.error('Failed to connect to OBS:', error);
      }
    };

    connectToObs();

    return () => {
      obs.disconnect();
    };
  }, []);

  // Helper function to show or hide a specific source in the target scene
  const setSourceVisibility = async (sourceName, isVisible) => {
    try {
      // 1. Get the internal Item ID for the source within "Song View"
      const { sceneItemId } = await obs.call('GetSceneItemId', {
        sceneName: TARGET_SCENE,
        sourceName: sourceName
      });

      // 2. Set the visibility using that ID
      await obs.call('SetSceneItemEnabled', {
        sceneName: TARGET_SCENE,
        sceneItemId: sceneItemId,
        sceneItemEnabled: isVisible
      });
    } catch (error) {
      console.error(`Error changing visibility for ${sourceName}:`, error);
    }
  };

  // Button 1: Right View ONLY
  const handleButton1 = async () => {
    if (!connected) return;
    await setSourceVisibility("Right View", true);
    await setSourceVisibility("Middle View", false);
    await setSourceVisibility("Left View", false);
  };

  // Button 2: Middle View ONLY
  const handleButton2 = async () => {
    if (!connected) return;
    await setSourceVisibility("Right View", false);
    await setSourceVisibility("Middle View", true);
    await setSourceVisibility("Left View", false);
  };

  // Button 3: Left View ONLY
  const handleButton3 = async () => {
    if (!connected) return;
    await setSourceVisibility("Right View", false);
    await setSourceVisibility("Middle View", false);
    await setSourceVisibility("Left View", true);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>OBS Status: {connected ? '🟢 Connected' : '🔴 Disconnected'}</h2>
      <p>Target Scene: <strong>{TARGET_SCENE}</strong></p>
      
      <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
        <button 
          onClick={handleButton1} 
          disabled={!connected}
          style={{ padding: '10px 20px', fontSize: '16px' }}
        >
          1 (Right View)
        </button>
        
        <button 
          onClick={handleButton2} 
          disabled={!connected}
          style={{ padding: '10px 20px', fontSize: '16px' }}
        >
          2 (Middle View)
        </button>

        <button 
          onClick={handleButton3} 
          disabled={!connected}
          style={{ padding: '10px 20px', fontSize: '16px' }}
        >
          3 (Left View)
        </button>
      </div>
    </div>
  );
}