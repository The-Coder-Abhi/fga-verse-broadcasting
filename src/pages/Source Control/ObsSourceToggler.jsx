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

  const handleRightView = async () => {
    if (!connected) return;
    await setSourceVisibility("Right View", true);
    await setSourceVisibility("Middle View", false);
    await setSourceVisibility("Left View", false);
  };

  const handleMiddleView = async () => {
    if (!connected) return;
    await setSourceVisibility("Right View", false);
    await setSourceVisibility("Middle View", true);
    await setSourceVisibility("Left View", false);
  };

  const handleLeftView = async () => {
    if (!connected) return;
    await setSourceVisibility("Right View", false);
    await setSourceVisibility("Middle View", false);
    await setSourceVisibility("Left View", true);
  };

  const handleFullScreenVerse = async () => {
    if (!connected) return;
    try {
      await obs.call('SetCurrentPreviewScene', { sceneName: 'Verse' });
      await obs.call('SetCurrentProgramScene', { sceneName: 'Verse' });
    } catch (error) {
      console.error('Error switching to Full Screen Verse:', error);
    }
  };

  const handleCameraEmergency = async () => {
    if (!connected) return;
    try {
      await obs.call('SetCurrentPreviewScene', { sceneName: 'Main DSLR' });
      await obs.call('SetCurrentProgramScene', { sceneName: 'Main Camo' });
    } catch (error) {
      console.error('Error switching to Camera Emergency:', error);
    }
  };

  const handleSongView = async () => {
    if (!connected) return;
    try {
      await obs.call('SetCurrentPreviewScene', { sceneName: 'Song Verse TV' });
      await obs.call('SetCurrentProgramScene', { sceneName: 'Song View' });
    } catch (error) {
      console.error('Error switching to Song View:', error);
    }
  };

  const handleVerseView = async () => {
    if (!connected) return;
    try {
      await obs.call('SetCurrentPreviewScene', { sceneName: 'Song Verse TV' });
      await obs.call('SetCurrentProgramScene', { sceneName: 'Song Verse TV' });
    } catch (error) {
      console.error('Error switching to Verse:', error);
    }
  };

  return (
    <div className="obs-dock-container">
      <h2 className="status-header">
        OBS Status: <span className={connected ? "status-connected" : "status-disconnected"}>
          {connected ? 'Connected' : 'Disconnected'}
        </span>
      </h2>

      <div className="button-group emergency-group">
        <h1>Emergency Controls</h1>
        <p className="target-scene-text">Studio Mode Overrides</p>
        <button 
          className="premium-btn emergency-btn" 
          onClick={handleFullScreenVerse} 
          disabled={!connected}
        >
          Full Screen Verse
        </button>
        <button 
          className="premium-btn emergency-btn" 
          onClick={handleCameraEmergency} 
          disabled={!connected}
        >
          Camera Emergency
        </button>
      </div>

      <div className="button-group emergency-group">
        <h1>Scene Controls</h1>
        <p className="target-scene-text">Studio Mode Overrides</p>
        <button 
          className="premium-btn emergency-btn" 
          onClick={handleSongView} 
          disabled={!connected}
        >
          Songs
        </button>
        <button 
          className="premium-btn emergency-btn" 
          onClick={handleVerseView} 
          disabled={!connected}
        >
          Verse
        </button>
      </div>
      
      <div className="button-group">
        <h1>View Controls</h1>
      <p className="target-scene-text">Target Scene: <strong>{TARGET_SCENE}</strong></p>
        <button className="premium-btn" onClick={handleRightView} disabled={!connected}>
          Show Right View
        </button>
        <button className="premium-btn" onClick={handleMiddleView} disabled={!connected}>
          Show Middle View
        </button>
        <button className="premium-btn" onClick={handleLeftView} disabled={!connected}>
          Show Left View
        </button>
      </div>
    </div>
  );
}