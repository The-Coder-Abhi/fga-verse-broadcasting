import { useEffect, useState } from 'react';
import OBSWebSocket from 'obs-websocket-js';

const obs = new OBSWebSocket();
const TARGET_SCENE = "Song View";

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
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>OBS Status: {connected ? '🟢 Connected' : '🔴 Disconnected'}</h2>
      <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
        <button onClick={handleButton1} disabled={!connected}>1 (Right View)</button>
        <button onClick={handleButton2} disabled={!connected}>2 (Middle View)</button>
        <button onClick={handleButton3} disabled={!connected}>3 (Left View)</button>
      </div>
    </div>
  );
}