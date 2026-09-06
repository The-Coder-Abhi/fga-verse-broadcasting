import './App.css';
import LowerThird from './pages/LowerThird/LowerThird';
import StageView from './pages/StageView/StageView';
import SplitStageView from './pages/SplitStageView/SplitStageView';
import LyricsView from './pages/LyricsView/LyricsView';
import { HashRouter, Routes, Route } from 'react-router-dom';
import ObsSourceToggler from './pages/Source Control/ObsSourceToggler';


function App() {
  return (
    // we are using HashRouter instead of BrowserRouter 
    // to avoid github page not foud error normal routing does on work on the github
    <HashRouter >
    <Routes>
      <Route path="/" element={<StageView themeClass=""/>}></Route>
      <Route path="/new" element={<StageView themeClass="newStageView" />} />
      <Route path="/lowerThird" element={<LowerThird/>}></Route>
      <Route path="/lyrics" element={<LyricsView/>}></Route>
      <Route path="/splitView" element={<SplitStageView  themeClass="newStageView"/>}></Route>
      <Route path="/sourceToggle" element={<ObsSourceToggler/>}></Route>
    </Routes>
    </HashRouter>
  );
}

export default App;
