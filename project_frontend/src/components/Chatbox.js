import React from "react";
import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { useSpeechSynthesis } from "react-speech-kit";
import { useSpeechRecognition } from "react-speech-kit";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import "../Styles/Chatbox.css";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import DeleteIcon from "@mui/icons-material/Delete";
import ClipLoader from "react-spinners/ClipLoader";
import PauseIcon from "@mui/icons-material/Pause";
import Navbar from "./Navbar";

const Chatbox = ({ socket, socketId }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [username, setusername] = useState("");
  const [text, setText] = useState("");
  const { speak, cancel } = useSpeechSynthesis();
  // const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  // const [textspeech, setTextSpeech] = useState("");
  const videoRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const { listen, listening, stop } = useSpeechRecognition({
    onResult: (result) => {
      // Handle the recognized speech result
      setMessage(result);
    },
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const chatContainerRef = useRef();

  useEffect(() => {
    // Scroll to the bottom when new content is added
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  const handleReply = useCallback((reply) => {
    setMessages((Messages) => [
      ...Messages,
      { content: reply.reply_text, isUser: false },
    ]);
    console.log(reply);
    setText(reply.reply_text);
    setLoading(false);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const tok = JSON.parse(token);
    setusername(tok.username);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const tokenObj = JSON.parse(token);
        console.log(tokenObj.username);
        // console.log(token.username);
        const response = await axios.get(
          "http://localhost:3001/get-conversation",
          {
            params: {
              username: tokenObj.username,
            },
          }
        );
        console.log(response.data.message);
        setMessages(response.data.message);
        if (response.data.msg) {
          let latestMsg =
            response.data.message[response.data.message.length - 1].content;
          setText(latestMsg);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData(); // Call the function to fetch data
  }, []);

  useEffect(() => {
    socket.on("gpt_reply", handleReply);
    return () => {
      socket.off("gpt_reply", handleReply);
    };
  }, [handleReply, socket]);

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      socket.emit("user_message", {
        from: socketId,
        content: message,
        username: username,
      });
      const msg = [...messages, { isUser: true, content: message }];
      setMessages(msg);
      setMessage("");
    } catch (e) {
      console.log(e);
    }
  };

  const handleAudioClick = (e) => {
    e.preventDefault();
    // Ensure that `speech` is a function before calling it
    if (typeof speak === "function") {
      if (!isPlaying) {
        setIsPlaying(true);
        speak({
          text: text,
          onEnd: () => {
            setIsPlaying(false);
            console.log("hi");
          },
        });
      } else {
        setIsPlaying(false);
        cancel();
      }
    } else {
      console.error("Speech synthesis is not available.");
    }
  };

  // const handleSpeechtoText = (e) => {
  //   e.preventDefault();
  //   try {
  //     socket.emit("u"ser_message", {
  //       from: socketId,
  //       content: transcript,
  //       username: username,
  //     });
  //     const msg = [...messages, { isUser: true, content: transcript }];
  //     setMessages(msg);
  //     setTranscript("");
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  useEffect(() => {
    let stream;

    const setupCamera = async () => {
      try {
        if (isCameraOn) {
          stream = await navigator.mediaDevices.getUserMedia({ video: true });

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } else {
          // If turning off camera, stop the stream and tracks
          if (stream) {
            const tracks = stream.getTracks();
            tracks.forEach((track) => track.stop());
            if (videoRef.current) {
              videoRef.current.srcObject = null;
            }
          }
        }
      } catch (error) {
        console.error("Error accessing webcam:", error);
      }
    };

    setupCamera();

    // Cleanup function to stop the stream when the component unmounts
    return () => {
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [isCameraOn]);

  const handleToggleCamera = () => {
    setIsCameraOn((prev) => !prev);
  };

  const deleteChat = () => {
    try
    {
      const res = axios.delete("http://localhost:3001/delete-chat", {
      username: username
    });
    if(res.status === 201){
      setMessage([]);
    }}
    catch(e){
      console.log("Error");
    }
  }

  return (
    <div className="completepage">
      <div className="form_profile">
        <div className="chatting">
          <ul className="chat-container" ref={chatContainerRef}>
            {Array.isArray(messages) &&
              messages.map((element, id) => (
                <li
                  className={`${!element.isUser ? "chat_bot" : "chat_user"}`}
                  key={id}
                >
                  {!element.isUser ? "Bot: " : "Me: "}
                  {element.content}
                </li>
              ))}
          </ul>
          <form className="prompt-container" onSubmit={handleSubmit}>
            {loading ? (
              <div className="prompt">
                <ClipLoader
                  loading="true"
                  size={15}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              </div>
            ) : (
              <input
                className="prompt"
                type="text"
                value={message}
                placeholder="Type message"
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
                required
              />
            )}
            <button className="prompt-btn" type="submit">
              <SendOutlinedIcon className="icon" />
            </button>
            <div className="prompt-btn">
              {!listening ? (
                <MicIcon
                  className="icon"
                  onClick={() => {
                    listen();
                  }}
                />
              ) : (
                <StopIcon
                  className="icon"
                  onClick={() => {
                    stop();
                  }}
                />
              )}
            </div>
            <div className="prompt-btn">
              <DeleteIcon
                className="icon"
                onClick={() => {
                  setMessage("");
                }}
              />
            </div>
            {/* <div className="prompt-btn">
              <DeleteIcon
              className="icon"
              onClick={deleteChat} />
            </div> */}
          </form>
        </div>

        <div className="next-container">
          <div className="video-container">
            {!isCameraOn && <div className="placeholder-container"></div>}
            {isCameraOn && (
              <video
                className="actual-video"
                ref={videoRef}
                autoPlay
                playsInline
                width="256"
                height="192"
              />
            )}
            <div className="video-btn-container">
              <div className="btn-back">
                <button className="video-btn" onClick={handleToggleCamera}>
                  {isCameraOn ? (
                    <VideocamOffIcon className="video-icon" />
                  ) : (
                    <VideocamIcon className="video-icon" />
                  )}
                </button>
              </div>
              <p>Video</p>
            </div>
          </div>
          <div className="audio-btn-container">
            <div className="video-btn-container">
              <div className="btn-back">
                <button className="video-btn" onClick={handleAudioClick}>
                  {isPlaying ? (
                    <PauseIcon className="video-icon" />
                  ) : (
                    <PlayArrowIcon className="video-icon" />
                  )}
                </button>
              </div>
              <p>Audio</p>
            </div>
          </div>
        </div>

        {/* <p>Microphone : {listening ? "on" : "off"} </p> */}
        {/* {!listening ? (
        <button
          onClick={() => {
            listen();
          }}
        >
          {" "}
          Record
        </button>
      ) : (
        <button
          onClick={() => {
            stop();
          }}
        >
          Stop
        </button>
      )} */}
        {/* <button
        onClick={() => {
          setTranscript("");
        }}
      >
        {" "}
        Delete{" "}
      </button>
      <button onClick={handleSpeechtoText}> Search </button> */}
        {/* <button onClick={}>Reset</button> */}
        {/* <input
        value={transcript}
        type="text"
        onChange={(e) => {
          setTranscript(e.target.value);
        }}
      /> */}
      </div>
    </div>
  );
};

export default Chatbox;
