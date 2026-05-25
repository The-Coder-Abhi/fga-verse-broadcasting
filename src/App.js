import './App.css';
import LowerThird from './pages/LowerThird/LowerThird';
import StageView from './pages/StageView/StageView';
import { HashRouter, Routes, Route } from 'react-router-dom';


function App() {
  return (
    // we are using HashRouter instead of BrowserRouter 
    // to avoid github page not foud error normal routing does on work on the github
    <HashRouter >
    <Routes>
      <Route path="/" element={<StageView themeClass=""/>}></Route>
      <Route path="/new" element={<StageView themeClass="newStageView" />} />
      <Route path="/lowerThird" element={<LowerThird/>}></Route>
    </Routes>
    </HashRouter>
  );
}

export default App;
