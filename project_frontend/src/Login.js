import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Styles/Login.css";
import Navbar from "./components/Navbar";
import images from "./assets/exo";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3001/login", {
        username: username,
        password: password,
      });

      if (res.status === 201) {
        console.log("Login Successful");
        localStorage.setItem("token", JSON.stringify(res.data.token));
        navigate(`/profile/${res.data.username}`);
        } 
      } catch (err) {
        if(err.response.status === 404){
          alert("User not found");
        }
        else if(err.response.status === 401){
          alert("Invalid credentials");
        }
        else{
          alert("Please refresh and try again");
        }
        
    }
  };

  return (
    <div className="LoginPage">
      <Navbar isProfile={false}/>
      <div className="content-space">
        <div>
          <img src={images.logo_short} alt="" className="short-logo"/>
          <h1 className="head">Welcome to <br /> Goodspace Communications</h1>
        </div>
        <form className="form_login backdrop-blur-md" onSubmit={handleSubmit}>
          <div className="form-container">
            <h1 className="heading">Login</h1>
            <div className="input-container">
              <div className="username">
                <div className="username-text">Username</div>
                <input
                  type="text"
                  className="input-login"
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="password">
                <div className="password-text">Password</div>
                <input
                  type="password"
                  className="input-login"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="btn-container">
              <button type="submit" className="btn" id="Log-in">
                Log In
              </button>
              <button id="signup" className="btn" onClick={() => {navigate("/signup");}}>
                Sign Up
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
