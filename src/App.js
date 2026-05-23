import './App.css';
import LowerThird from './pages/LowerThird/LowerThird';
import StageView from './pages/StageView/StageView';
import { BrowserRouter, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <BrowserRouter basename="/fga-verse-broadcasting">
    <Routes>
      <Route path="/" element={<StageView/>}></Route>
      <Route path="lowerThird" element={<LowerThird/>}></Route>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
