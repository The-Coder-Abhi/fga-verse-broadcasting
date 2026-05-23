import './App.css';
import LowerThird from './pages/LowerThird/LowerThird';
import StageView from './pages/StageView/StageView';
import { HashRouter, Routes, Route } from 'react-router-dom';


function App() {
  return (
    // we are using HashRouter instead of BrowserRouter 
    // to avoid github page not foud error normal routing does on work on the github
    <HashRouter basename="/fga-verse-broadcasting">
    <Routes>
      <Route path="/" element={<StageView/>}></Route>
      <Route path="/lowerThird" element={<LowerThird/>}></Route>
    </Routes>
    </HashRouter>
  );
}

export default App;
