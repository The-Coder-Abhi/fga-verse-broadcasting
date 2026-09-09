import { useEffect, useState } from 'react';
import OBSWebSocket from 'obs-websocket-js';
import './ObsSourceToggler.css';

const obs = new OBSWebSocket();
const TARGET_SCENE = "Song View Toggle";

export default function ObsSourceToggler() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const connectToObs = async () => {
      try {
        await obs.connect('ws://localhost:4455', 'Abhi2003');
        setConnected(true);
      } catch (error) {
        console.error('Failed to connect to OBS:', error);
      }
    };
    connectToObs();
    return () => { obs.disconnect(); };
  }, []);

  const setSourceVisibility = async (sourceName, isVisible) => {
    try {
      const { sceneItemId } = await obs.call('GetSceneItemId', {
        sceneName: TARGET_SCENE,
        sourceName: sourceName
      });
      await obs.call('SetSceneItemEnabled', {
        sceneName: TARGET_SCENE,
        sceneItemId: sceneItemId,
        sceneItemEnabled: isVisible
      });
    } catch (error) {
      console.error(`Error changing visibility for ${sourceName}:`, error);
    }
  };

  const handleButton1 = async () => {
    if (!connected) return;
    await setSourceVisibility("Right View", true);
    await setSourceVisibility("Middle View", false);
    await setSourceVisibility("Left View", false);
  };

  const handleButton2 = async () => {
    if (!connected) return;
    await setSourceVisibility("Right View", false);
    await setSourceVisibility("Middle View", true);
    await setSourceVisibility("Left View", false);
  };

  const handleButton3 = async () => {
    if (!connected) return;
    await setSourceVisibility("Right View", false);
    await setSourceVisibility("Middle View", false);
    await setSourceVisibility("Left View", true);
  };

  return (
    <div className="obs-dock-container">
      <h2 className="status-header">
        OBS Status: <span className={connected ? "status-connected" : "status-disconnected"}>
          {connected ? 'Connected' : 'Disconnected'}
        </span>
      </h2>
      <p className="target-scene-text">Target Scene: <strong>{TARGET_SCENE}</strong></p>
      
      <div className="button-group">
        <button className="premium-btn" onClick={handleButton1} disabled={!connected}>
          Show Right View
        </button>
        <button className="premium-btn" onClick={handleButton2} disabled={!connected}>
          Show Middle View
        </button>
        <button className="premium-btn" onClick={handleButton3} disabled={!connected}>
          Show Left View
        </button>
      </div>
    </div>
  );
}