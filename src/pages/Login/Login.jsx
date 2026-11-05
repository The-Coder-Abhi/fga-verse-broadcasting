import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebase";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try{
        await signInWithEmailAndPassword(auth, email, password);
    }catch(error){
        setError("Invalid email or password");
    }
  }
  return(
    <div className="login_container">
      <form  onSubmit={handleLogin} className="login_form">
        <h2>VersePresenter Login</h2>
        
        {error && <div className="error_message">{error}</div>}
        
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        
        <button type="submit">
          Secure Login
        </button>
      </form>
    </div>
  );
};

export default Login;
