import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./services/firebase";
import { Navigate } from "react-router-dom";
import "./App.css";
import LowerThird from "./pages/LowerThird/LowerThird";
import StageView from "./pages/StageView/StageView";
import SplitStageView from "./pages/SplitStageView/SplitStageView";
import LyricsView from "./pages/LyricsView/LyricsView";
import { HashRouter, Routes, Route } from "react-router-dom";
import ObsSourceToggler from "./pages/Source Control/ObsSourceToggler";
import PresenterDashboard from "./pages/PresenterDashboard/PresenterDashboard";
import Login from "./pages/Login/Login";

function App() {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    // Listen to Firebase authentication state
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Show a dark-themed loading screen while checking the auth state
  if (isAuthLoading) {
    return (
      <div className="verifying">
        Verifying Session...
      </div>
    );
  }

  return (
    // we are using HashRouter instead of BrowserRouter
    // to avoid github page not foud error normal routing does on work on the github
    <HashRouter>
      <Routes>
        <Route path="/" element={<StageView themeClass="" />}></Route>
        <Route path="/new" element={<StageView themeClass="newStageView" />} />
        <Route path="/lowerThird" element={<LowerThird />}></Route>
        <Route path="/lyrics" element={<LyricsView />}></Route>
        <Route
          path="/splitView"
          element={<SplitStageView themeClass="newStageView" />}
        ></Route>
        <Route path="/sourceToggle" element={<ObsSourceToggler />}></Route>
        {/* LOGIN ROUTE: Redirects to controller if already logged in */}
        <Route
          path="/login"
          element={user ? <Navigate to="/controller" replace /> : <Login />}
        />

        {/* PROTECTED ROUTE: Presenter Dashboard */}
        <Route
          path="/controller"
          element={
            user ? <PresenterDashboard /> : <Navigate to="/login" replace />
          }
        ></Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
