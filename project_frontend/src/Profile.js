import React from "react";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import Chatbox from "./components/Chatbox";
import './Styles/Profile.css';
import Navbar from "./components/Navbar";

const Profile = () => {
  const [socketId, setSocketId] = useState();
  const [socket, setSocket] = useState();

  useEffect(() => {
    const ocket = io("localhost:3001");
    setSocket(ocket);
    // socket.emit("sendMessage", "What is life?");
    ocket.on("welcome", (data) => {
      console.log(data);
      setSocketId(data);
    });
  }, []);

  return (
    <div className="Profile_page">
      <Navbar isProfile={true}/>
      {socket && <Chatbox socket={socket} socketId={socketId} />}
    </div>
  );
};

export default Profile;
